package org.options.platform.identity.web;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CsrfController {
  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Csrf(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED,
              allowableValues = {"X-CSRF-TOKEN"})
          String headerName,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED,
              minLength = 1,
              maxLength = 2048)
          String token) {}

  @io.swagger.v3.oas.annotations.Operation(operationId = "getCsrf")
  @GetMapping("/api/v1/auth/csrf")
  public Csrf csrf(CsrfToken token) {
    return new Csrf(token.getHeaderName(), token.getToken());
  }
}
