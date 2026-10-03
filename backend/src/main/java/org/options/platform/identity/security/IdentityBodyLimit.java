package org.options.platform.identity.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import org.options.platform.ops.web.Problems;
import org.springframework.web.filter.OncePerRequestFilter;

/** Bounds identity JSON before parsing/hashing, including chunked requests. */
final class IdentityBodyLimit extends OncePerRequestFilter {
  private static final int LIMIT = 65536;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    String path = request.getRequestURI();
    if (!(path.startsWith("/api/v1/auth/")
            || path.equals("/api/v1/me")
            || path.startsWith("/api/v1/me/"))
        || !(request.getMethod().equals("POST") || request.getMethod().equals("PUT"))) {
      chain.doFilter(request, response);
      return;
    }
    if (request.getContentLengthLong() > LIMIT) {
      Problems.write(
          request, response, 413, "REQUEST_TOO_LARGE", "The submitted request is too large.");
      return;
    }
    byte[] data = request.getInputStream().readNBytes(LIMIT + 1);
    if (data.length > LIMIT) {
      Problems.write(
          request, response, 413, "REQUEST_TOO_LARGE", "The submitted request is too large.");
      return;
    }
    chain.doFilter(
        new HttpServletRequestWrapper(request) {
          @Override
          public ServletInputStream getInputStream() {
            var stream = new ByteArrayInputStream(data);
            return new ServletInputStream() {
              @Override
              public int read() {
                return stream.read();
              }

              @Override
              public boolean isFinished() {
                return stream.available() == 0;
              }

              @Override
              public boolean isReady() {
                return true;
              }

              @Override
              public void setReadListener(ReadListener listener) {
                throw new UnsupportedOperationException("Synchronous JSON only");
              }
            };
          }

          @Override
          public BufferedReader getReader() {
            return new BufferedReader(
                new InputStreamReader(getInputStream(), StandardCharsets.UTF_8));
          }
        },
        response);
  }
}
