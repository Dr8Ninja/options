package org.options.platform.ops.web;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class SafeErrors {
  @ExceptionHandler(ApiFailure.class)
  ResponseEntity<Problems.Body> expected(ApiFailure failure, HttpServletRequest request) {
    var result =
        ResponseEntity.status(failure.status)
            .header("Content-Type", "application/problem+json")
            .header("Cache-Control", "no-store");
    if (failure.status == 503) result.header("Retry-After", "30");
    return result.body(Problems.body(request, failure.status, failure.code, failure.getMessage()));
  }

  @ExceptionHandler({
    jakarta.validation.ConstraintViolationException.class,
    org.springframework.web.method.annotation.HandlerMethodValidationException.class,
    org.springframework.web.bind.MethodArgumentNotValidException.class,
    org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class
  })
  ResponseEntity<Problems.Body> invalid(HttpServletRequest request) {
    return expected(ApiFailure.query(), request);
  }

  @ExceptionHandler(org.springframework.web.servlet.resource.NoResourceFoundException.class)
  ResponseEntity<Problems.Body> unavailable(HttpServletRequest request) {
    return ResponseEntity.status(404)
        .header("Content-Type", "application/problem+json")
        .header("Cache-Control", "no-store")
        .body(Problems.body(request, 404, "NOT_FOUND", "This item is not available."));
  }

  @ExceptionHandler(org.springframework.dao.DataAccessException.class)
  ResponseEntity<Problems.Body> databaseUnavailable(HttpServletRequest request) {
    return expected(ApiFailure.unavailable(), request);
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<Problems.Body> unexpected(HttpServletRequest request) {
    return ResponseEntity.status(500)
        .header("Content-Type", "application/problem+json")
        .header("Cache-Control", "no-store")
        .body(Problems.body(request, 500, "INTERNAL_ERROR", "The request could not be completed."));
  }
}
