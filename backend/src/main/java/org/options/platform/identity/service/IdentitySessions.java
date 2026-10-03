package org.options.platform.identity.service;

import jakarta.servlet.http.*;
import java.time.Instant;
import java.util.*;
import org.options.platform.identity.api.IdentityResponses.Session;
import org.options.platform.identity.model.Identity;
import org.options.platform.identity.security.IdentityUser;
import org.options.platform.ops.web.ApiFailure;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.*;
import org.springframework.security.core.authority.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.session.ChangeSessionIdAuthenticationStrategy;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.csrf.*;
import org.springframework.stereotype.Service;

@Service
public class IdentitySessions {
  public static final String GENERATION = "identity.generation",
      PASSWORD = "identity.passwordAt",
      FACTOR = "identity.webauthnAt",
      START = "identity.started",
      ACTIVITY = "identity.activityAt";
  private final IdentityService identities;
  private final HttpSessionSecurityContextRepository contexts =
      new HttpSessionSecurityContextRepository();

  public IdentitySessions(IdentityService identities) {
    this.identities = identities;
  }

  public Identity current(HttpServletRequest req) {
    var auth = SecurityContextHolder.getContext().getAuthentication();
    var session = req.getSession(false);
    if (auth == null
        || !auth.isAuthenticated()
        || session == null
        || !(session.getAttribute(GENERATION) instanceof Long gen)) return null;
    var a = identities.find(auth.getName());
    long now = Instant.now().getEpochSecond();
    if (a == null
        || a.generation() != gen
        || !Set.of("ACTIVE", "UNVERIFIED").contains(a.status())
        || !(session.getAttribute(START) instanceof Long start)
        || now >= start + (a.privileged() ? 28800 : 604800)
        || !(session.getAttribute(ACTIVITY) instanceof Long activity)
        || now >= activity + (a.privileged() || !a.status().equals("ACTIVE") ? 900 : 86400)) {
      session.invalidate();
      SecurityContextHolder.clearContext();
      return null;
    }
    if (!req.getRequestURI().equals("/api/v1/auth/session")) session.setAttribute(ACTIVITY, now);
    session.setMaxInactiveInterval(a.privileged() || !a.status().equals("ACTIVE") ? 900 : 86400);
    return a;
  }

  public Identity require(HttpServletRequest req) {
    var a = current(req);
    if (a == null || !a.status().equals("ACTIVE")) throw IdentityService.denied();
    return a;
  }

  public Identity recent(HttpServletRequest req) {
    var a = require(req);
    var s = req.getSession(false);
    long now = Instant.now().getEpochSecond();
    if (!(s.getAttribute(PASSWORD) instanceof Long p)
        || now - p >= 300
        || (a.privileged() && (!(s.getAttribute(FACTOR) instanceof Long f) || now - f >= 300)))
      throw new ApiFailure(
          403,
          "REAUTHENTICATION_REQUIRED",
          "Confirm your password and required security key before continuing.");
    return a;
  }

  public void authenticated(
      Authentication auth,
      HttpServletRequest req,
      HttpServletResponse res,
      boolean reauthentication) {
    var user = (IdentityUser) auth.getPrincipal();
    var a = identities.login(auth.getName(), user.generation());
    var old = req.getSession(false);
    Long oldStart = old != null ? (Long) old.getAttribute(START) : null;
    Long oldFactor = reauthentication && old != null ? (Long) old.getAttribute(FACTOR) : null;
    new ChangeSessionIdAuthenticationStrategy().onAuthentication(auth, req, res);
    new CsrfAuthenticationStrategy(new HttpSessionCsrfTokenRepository())
        .onAuthentication(auth, req, res);
    var s = req.getSession(true);
    s.setAttribute(GENERATION, a.generation());
    s.setAttribute(ACTIVITY, Instant.now().getEpochSecond());
    s.setAttribute(PASSWORD, Instant.now().getEpochSecond());
    s.setAttribute(
        START, reauthentication && oldStart != null ? oldStart : Instant.now().getEpochSecond());
    s.removeAttribute(FACTOR);
    if (oldFactor != null) s.setAttribute(FACTOR, oldFactor);
    s.setMaxInactiveInterval(a.privileged() || !a.status().equals("ACTIVE") ? 900 : 86400);
    save(a, req, res);
  }

  public void factor(Identity a, HttpServletRequest req, HttpServletResponse res) {
    req.changeSessionId();
    req.getSession().setAttribute(FACTOR, Instant.now().getEpochSecond());
    new CsrfAuthenticationStrategy(new HttpSessionCsrfTokenRepository())
        .onAuthentication(SecurityContextHolder.getContext().getAuthentication(), req, res);
    save(a, req, res);
  }

  private void save(Identity a, HttpServletRequest req, HttpServletResponse res) {
    var authorities = new ArrayList<GrantedAuthority>();
    a.roles().forEach(x -> authorities.add(new SimpleGrantedAuthority("ROLE_" + x)));
    authorities.add(
        FactorGrantedAuthority.withAuthority(FactorGrantedAuthority.PASSWORD_AUTHORITY)
            .issuedAt(Instant.ofEpochSecond((Long) req.getSession().getAttribute(PASSWORD)))
            .build());
    if (req.getSession().getAttribute(FACTOR) != null)
      authorities.add(
          FactorGrantedAuthority.withAuthority(FactorGrantedAuthority.WEBAUTHN_AUTHORITY)
              .issuedAt(Instant.ofEpochSecond((Long) req.getSession().getAttribute(FACTOR)))
              .build());
    var auth =
        UsernamePasswordAuthenticationToken.authenticated(
            a.publicId().toString(), null, authorities);
    var context = SecurityContextHolder.createEmptyContext();
    context.setAuthentication(auth);
    SecurityContextHolder.setContext(context);
    contexts.saveContext(context, req, res);
  }

  public Session describe(HttpServletRequest req) {
    var a = current(req);
    if (a == null) return new Session(false, null, "ANONYMOUS", List.of(), null, null, null, null);
    var s = req.getSession();
    Long p = (Long) s.getAttribute(PASSWORD),
        f = (Long) s.getAttribute(FACTOR),
        start = (Long) s.getAttribute(START);
    return new Session(
        true,
        a.publicId().toString(),
        a.status().equals("UNVERIFIED")
            ? "UNVERIFIED"
            : a.privileged() && f == null ? "MFA_REQUIRED" : "ACTIVE",
        a.roles(),
        time(p),
        time(f),
        time(
            Math.min(
                (Long) s.getAttribute(ACTIVITY) + s.getMaxInactiveInterval(),
                start + (a.privileged() ? 28800 : 604800))),
        time(start + (a.privileged() ? 28800 : 604800)));
  }

  private static String time(Long value) {
    return value == null ? null : Instant.ofEpochSecond(value).toString();
  }

  public void logout(HttpServletRequest req, HttpServletResponse res) {
    var s = req.getSession(false);
    if (s != null) s.invalidate();
    SecurityContextHolder.clearContext();
    var cookie = new Cookie("__Host-OTRSESSION", "");
    cookie.setSecure(true);
    cookie.setHttpOnly(true);
    cookie.setPath("/");
    cookie.setMaxAge(0);
    cookie.setAttribute("SameSite", "Lax");
    res.addCookie(cookie);
  }
}
