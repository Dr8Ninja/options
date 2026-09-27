package org.options.platform.ops.web;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestCorrelationFilter extends OncePerRequestFilter {
  public static final String ATTRIBUTE = "requestId";

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    // Do not reflect caller-controlled identifiers, paths, query strings or headers in logs.
    String id = UUID.randomUUID().toString();
    request.setAttribute(ATTRIBUTE, id);
    response.setHeader("X-Request-ID", id);
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Vary", "Cookie");
    response.setHeader("X-Robots-Tag", "noindex, nofollow");
    MDC.put("requestId", id);
    long started = System.nanoTime();
    try {
      chain.doFilter(request, response);
    } finally {
      Object matched =
          request.getAttribute(
              "org.springframework.web.servlet.HandlerMapping.bestMatchingPattern");
      String route = matched instanceof String value ? value : "unmatched";
      LoggerFactory.getLogger(getClass())
          .atInfo()
          .addKeyValue("route", route)
          .addKeyValue("status", response.getStatus())
          .addKeyValue("durationMs", (System.nanoTime() - started) / 1_000_000)
          .log("http_request");
      MDC.remove("requestId");
    }
  }
}
