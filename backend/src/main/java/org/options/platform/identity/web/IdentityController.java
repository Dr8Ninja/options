package org.options.platform.identity.web;

import jakarta.servlet.http.*;
import jakarta.validation.Valid;
import org.options.platform.identity.api.IdentityDtos.*;
import org.options.platform.identity.api.IdentityResponses.*;
import org.options.platform.identity.security.*;
import org.options.platform.identity.service.*;
import org.options.platform.ops.web.ApiFailure;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class IdentityController {
  private final IdentityService identities;
  private final IdentitySessions sessions;
  private final IdentityThrottle throttle;
  private final AuthenticationManager manager;

  public IdentityController(
      IdentityService identities,
      IdentitySessions sessions,
      IdentityThrottle throttle,
      AuthenticationManager manager) {
    this.identities = identities;
    this.sessions = sessions;
    this.throttle = throttle;
    this.manager = manager;
  }

  private static Acknowledgment accepted() {
    return new Acknowledgment(
        "If this address is eligible, a message will be queued. Use the latest message. Delivery depends on the configured mail service.");
  }

  private static Acknowledgment confirmed() {
    return new Acknowledgment("The request is complete. Sign in again when required.");
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "getSession")
  @GetMapping("/auth/session")
  public Session session(HttpServletRequest req) {
    return sessions.describe(req);
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "register")
  @PostMapping("/auth/register")
  @ResponseStatus(HttpStatus.ACCEPTED)
  public Acknowledgment register(@Valid @RequestBody RegisterInput input, HttpServletRequest req) {
    throttle.request("VERIFY", IdentityService.email(input.email()), req.getRemoteAddr());
    identities.register(input);
    return accepted();
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "requestVerification")
  @PostMapping("/auth/verification-requests")
  @ResponseStatus(HttpStatus.ACCEPTED)
  public Acknowledgment verification(@Valid @RequestBody EmailInput input, HttpServletRequest req) {
    throttle.request("VERIFY", IdentityService.email(input.email()), req.getRemoteAddr());
    identities.request(input.email(), "VERIFY");
    return accepted();
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "requestPasswordReset")
  @PostMapping("/auth/password-reset-requests")
  @ResponseStatus(HttpStatus.ACCEPTED)
  public Acknowledgment recovery(@Valid @RequestBody EmailInput input, HttpServletRequest req) {
    throttle.request("RESET", IdentityService.email(input.email()), req.getRemoteAddr());
    identities.request(input.email(), "RESET");
    return accepted();
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "confirmVerification")
  @PostMapping("/auth/verification-confirmations")
  public Acknowledgment verify(@Valid @RequestBody TokenInput input, HttpServletRequest req) {
    throttle.take("VERIFY", "confirmation:" + req.getRemoteAddr(), 30, 900);
    identities.confirm(input.token(), "VERIFY", null);
    return confirmed();
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "confirmPasswordReset")
  @PostMapping("/auth/password-reset-confirmations")
  public Acknowledgment reset(@Valid @RequestBody ResetInput input, HttpServletRequest req) {
    throttle.take("RESET", "confirmation:" + req.getRemoteAddr(), 30, 900);
    identities.confirm(input.token(), "RESET", input.newPassword());
    return confirmed();
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "confirmEmailChange")
  @PostMapping("/auth/email-change-confirmations")
  public Acknowledgment emailConfirmation(
      @Valid @RequestBody TokenInput input, HttpServletRequest req) {
    throttle.take("CHANGE_EMAIL", "confirmation:" + req.getRemoteAddr(), 30, 900);
    identities.confirm(input.token(), "CHANGE_EMAIL", null);
    return confirmed();
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "login")
  @PostMapping("/auth/login")
  public Session login(
      @Valid @RequestBody LoginInput input, HttpServletRequest req, HttpServletResponse res) {
    authenticate(input.email(), input.password(), req, res, false);
    return sessions.describe(req);
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "reauthenticate")
  @PostMapping("/auth/reauthentication")
  public Session reauthenticate(
      @Valid @RequestBody PasswordInput input, HttpServletRequest req, HttpServletResponse res) {
    var a = sessions.require(req);
    authenticate(a.email(), input.password(), req, res, true);
    return sessions.describe(req);
  }

  private void authenticate(
      String email,
      String password,
      HttpServletRequest req,
      HttpServletResponse res,
      boolean again) {
    if (password.codePointCount(0, password.length()) > 128 || password.isEmpty())
      throw new ApiFailure(400, "INVALID_INPUT", "Check the submitted fields.");
    throttle.take("LOGIN", "source:" + req.getRemoteAddr(), 100, 900);
    throttle.take("LOGIN", "global", 300, 60);
    throttle.checkLogin(IdentityService.email(email));
    try {
      var auth =
          manager.authenticate(
              UsernamePasswordAuthenticationToken.unauthenticated(
                  IdentityService.email(email), PasswordPolicy.normalize(password)));
      sessions.authenticated(auth, req, res, again);
      throttle.successfulLogin(IdentityService.email(email));
    } catch (AuthenticationException e) {
      throttle.failedLogin(IdentityService.email(email));
      throw new ApiFailure(
          401, "INVALID_CREDENTIALS", "The email or password could not be verified.");
    }
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "logout")
  @PostMapping("/auth/logout")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void logout(HttpServletRequest req, HttpServletResponse res) {
    sessions.logout(req, res);
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "logoutAll")
  @PostMapping("/auth/logout-all")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void logoutAll(HttpServletRequest req, HttpServletResponse res) {
    var a = sessions.require(req);
    identities.revoke(a.publicId().toString(), a.generation());
    sessions.logout(req, res);
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "getProfile")
  @GetMapping("/me")
  public ResponseEntity<Profile> profile(HttpServletRequest req) {
    var p = identities.profile(sessions.require(req));
    return ResponseEntity.ok().eTag(p.version()).body(p);
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "replaceProfile")
  @PutMapping("/me")
  public ResponseEntity<Profile> profile(
      @Valid @RequestBody ProfileInput input,
      @RequestHeader(value = "If-Match", required = false) String version,
      HttpServletRequest req) {
    if (version == null)
      throw new ApiFailure(428, "PRECONDITION_REQUIRED", "Reload your account before editing.");
    var a = sessions.require(req);
    var p = identities.profile(a.publicId().toString(), a.generation(), input, version);
    return ResponseEntity.ok().eTag(p.version()).body(p);
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "changePassword")
  @PostMapping("/me/password")
  @ResponseStatus(HttpStatus.ACCEPTED)
  public Acknowledgment password(
      @Valid @RequestBody ChangePasswordInput input,
      HttpServletRequest req,
      HttpServletResponse res) {
    var a = sessions.recent(req);
    identities.changePassword(a.publicId().toString(), a.generation(), input.newPassword());
    sessions.logout(req, res);
    return confirmed();
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "requestEmailChange")
  @PostMapping("/me/email-change")
  @ResponseStatus(HttpStatus.ACCEPTED)
  public Acknowledgment email(@Valid @RequestBody EmailInput input, HttpServletRequest req) {
    var a = sessions.recent(req);
    throttle.request("CHANGE_EMAIL", a.publicId().toString(), req.getRemoteAddr());
    identities.changeEmail(a.publicId().toString(), a.generation(), input.email());
    return accepted();
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "cancelEmailChange")
  @DeleteMapping("/me/email-change")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void cancelEmail(HttpServletRequest req) {
    var a = sessions.require(req);
    identities.cancelEmail(a.publicId().toString(), a.generation());
  }
}
