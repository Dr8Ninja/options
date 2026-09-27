package org.options.platform.ops.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import tools.jackson.databind.json.JsonMapper;

public final class Problems {
  private static final JsonMapper JSON = JsonMapper.builder().build();

  private Problems() {}

  public record Body(
      String type,
      String title,
      int status,
      String code,
      String message,
      List<Object> fieldErrors,
      String timestamp,
      String requestId) {}

  public static Body body(HttpServletRequest request, int status, String code, String message) {
    Object id = request.getAttribute(RequestCorrelationFilter.ATTRIBUTE);
    return new Body(
        "urn:otr:problem:" + code,
        HttpStatus.valueOf(status).getReasonPhrase(),
        status,
        code,
        message,
        List.of(),
        Instant.now().toString(),
        id == null ? UUID.randomUUID().toString() : id.toString());
  }

  public static void write(
      HttpServletRequest request,
      HttpServletResponse response,
      int status,
      String code,
      String message)
      throws IOException {
    response.setStatus(status);
    response.setContentType("application/problem+json");
    response.setHeader("Cache-Control", "no-store");
    response.getWriter().write(JSON.writeValueAsString(body(request, status, code, message)));
  }
}
