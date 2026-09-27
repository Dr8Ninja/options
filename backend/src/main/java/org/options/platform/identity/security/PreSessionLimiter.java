package org.options.platform.identity.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.options.platform.ops.web.Problems;
import org.springframework.web.filter.OncePerRequestFilter;

/** Fixed-size global token bucket; no identifiers retained. P13 adds account/source budgets. */
final class PreSessionLimiter extends OncePerRequestFilter {
  private double tokens = 60;
  private long updated = System.nanoTime();

  synchronized boolean acquire(long now) {
    tokens = Math.min(60, tokens + (now - updated) / 1_000_000_000.0);
    updated = now;
    if (tokens < 1) return false;
    tokens -= 1;
    return true;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    if ("GET".equals(req.getMethod())
        && "/api/v1/auth/csrf".equals(req.getRequestURI())
        && req.getSession(false) == null
        && !acquire(System.nanoTime())) {
      res.setHeader("Retry-After", "1");
      Problems.write(
          req, res, 429, "RATE_LIMITED", "Please wait before requesting another security token.");
      return;
    }
    chain.doFilter(req, res);
  }
}
