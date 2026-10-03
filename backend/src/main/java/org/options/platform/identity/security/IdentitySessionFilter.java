package org.options.platform.identity.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import org.options.platform.identity.service.IdentitySessions;
import org.springframework.web.filter.OncePerRequestFilter;

public final class IdentitySessionFilter extends OncePerRequestFilter {
  private final IdentitySessions sessions;

  public IdentitySessionFilter(IdentitySessions sessions) {
    this.sessions = sessions;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    try {
      sessions.current(req);
    } catch (org.springframework.dao.DataAccessException
        | org.springframework.transaction.TransactionException ex) {
      res.setHeader("Retry-After", "30");
      org.options.platform.ops.web.Problems.write(
          req, res, 503, "TEMPORARILY_UNAVAILABLE", "Account service is temporarily unavailable.");
      return;
    }
    chain.doFilter(req, res);
  }
}
