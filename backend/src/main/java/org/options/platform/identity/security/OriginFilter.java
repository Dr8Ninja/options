package org.options.platform.identity.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.util.Set;
import org.options.platform.ops.web.Problems;
import org.springframework.web.filter.OncePerRequestFilter;

final class OriginFilter extends OncePerRequestFilter {
  private static final Set<String> SAFE = Set.of("GET", "HEAD", "OPTIONS", "TRACE");
  private final String origin;

  OriginFilter(URI origin) {
    this.origin = origin.toString();
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    if (!SAFE.contains(request.getMethod())
        && (!sameOrigin(request) || "cross-site".equals(request.getHeader("Sec-Fetch-Site")))) {
      Problems.write(
          request, response, 403, "ORIGIN_REJECTED", "This request origin is not allowed.");
      return;
    }
    chain.doFilter(request, response);
  }

  private boolean sameOrigin(HttpServletRequest request) {
    String supplied = request.getHeader("Origin");
    if (supplied != null) return origin.equals(supplied);
    String referer = request.getHeader("Referer");
    if (referer == null) return false;
    try {
      URI uri = URI.create(referer);
      return uri.getRawUserInfo() == null
          && origin.equals(uri.getScheme() + "://" + uri.getRawAuthority());
    } catch (IllegalArgumentException ignored) {
      return false;
    }
  }
}
