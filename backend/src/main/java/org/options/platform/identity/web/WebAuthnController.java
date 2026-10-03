package org.options.platform.identity.web;

import jakarta.servlet.http.*;
import jakarta.validation.Valid;
import java.util.UUID;
import org.options.platform.identity.api.IdentityDtos.*;
import org.options.platform.identity.api.IdentityResponses.*;
import org.options.platform.identity.api.WebAuthnInputs.*;
import org.options.platform.identity.security.IdentityThrottle;
import org.options.platform.identity.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class WebAuthnController {
  private final IdentitySessions sessions;
  private final IdentityWebAuthn keys;
  private final IdentityThrottle throttle;

  public WebAuthnController(
      IdentitySessions sessions, IdentityWebAuthn keys, IdentityThrottle throttle) {
    this.sessions = sessions;
    this.keys = keys;
    this.throttle = throttle;
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "beginCredentialRegistration")
  @PostMapping("/me/webauthn/registration-options")
  public RegistrationOptions registerOptions(HttpServletRequest req) {
    var a = sessions.recent(req);
    throttle.take("WEBAUTHN", a.publicId().toString(), 30, 900);
    return keys.registrationOptions(
        a.publicId().toString(), a.generation(), req.getSession().getId());
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "registerCredential")
  @PostMapping("/me/webauthn/credentials")
  @ResponseStatus(HttpStatus.CREATED)
  public Credential register(@Valid @RequestBody RegistrationInput input, HttpServletRequest req) {
    var a = sessions.recent(req);
    return keys.register(a.publicId().toString(), a.generation(), req.getSession().getId(), input);
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "Assertionoptions")
  @PostMapping("/auth/webauthn/assertion-options")
  public AssertionOptions assertOptions(HttpServletRequest req) {
    var a = sessions.require(req);
    throttle.take("WEBAUTHN", a.publicId().toString(), 30, 900);
    return keys.assertionOptions(a.publicId().toString(), a.generation(), req.getSession().getId());
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "Assertions")
  @PostMapping("/auth/webauthn/assertions")
  public Session assertion(
      @Valid @RequestBody AssertionInput input, HttpServletRequest req, HttpServletResponse res) {
    var a = sessions.require(req);
    keys.assertKey(a.publicId().toString(), a.generation(), req.getSession().getId(), input);
    sessions.factor(a, req, res);
    return sessions.describe(req);
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "listCredentials")
  @GetMapping("/me/webauthn/credentials")
  public Credentials list(HttpServletRequest req) {
    var a = sessions.require(req);
    return keys.list(a.publicId().toString(), a.generation());
  }

  @io.swagger.v3.oas.annotations.Operation(operationId = "revokeCredential")
  @DeleteMapping("/me/webauthn/credentials/{credentialId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void remove(
      @PathVariable UUID credentialId, HttpServletRequest req, HttpServletResponse res) {
    var a = sessions.recent(req);
    keys.remove(a.publicId().toString(), a.generation(), credentialId);
    sessions.logout(req, res);
  }
}
