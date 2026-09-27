package org.options.platform.identity.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Set;
import org.options.platform.ops.web.Problems;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** Known public resources have no mutation methods. Reject before session/CSRF allocation. */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class PublicReadMethods extends OncePerRequestFilter {
  private static final Set<String> COLLECTIONS =
      Set.of(
          "programs",
          "phases",
          "modules",
          "topics",
          "resources",
          "paths",
          "projects",
          "capstones",
          "content-version",
          "search",
          "discovery-facets",
          "routes");
  private static final Set<String> DETAILS =
      Set.of(
          "programs",
          "phases",
          "modules",
          "topics",
          "subtopics",
          "resources",
          "paths",
          "projects",
          "capstones",
          "exercises",
          "quizzes");

  @Override
  protected void doFilterInternal(
      HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    String[] parts = req.getRequestURI().split("/", -1);
    boolean known =
        parts.length >= 4
            && parts[1].equals("api")
            && parts[2].equals("v1")
            && ((parts.length == 4 && COLLECTIONS.contains(parts[3]))
                || (parts.length == 5 && DETAILS.contains(parts[3]) && !parts[4].isEmpty()));
    if (known && !Set.of("GET", "HEAD").contains(req.getMethod())) {
      res.setHeader("Allow", "GET, HEAD");
      Problems.write(
          req, res, 405, "METHOD_NOT_ALLOWED", "This public resource only supports reading.");
      return;
    }
    chain.doFilter(req, res);
  }
}
