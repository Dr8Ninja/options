package org.options.platform.ops.web;

/** Safe, fixed public error; never carries rejected values or database diagnostics. */
public final class ApiFailure extends RuntimeException {
  public final int status;
  public final String code;

  public ApiFailure(int status, String code, String message) {
    super(message);
    this.status = status;
    this.code = code;
  }

  public static ApiFailure query() {
    return new ApiFailure(400, "INVALID_QUERY", "Check the query parameters.");
  }

  public static ApiFailure missing() {
    return new ApiFailure(404, "NOT_FOUND", "This item is not available.");
  }

  public static ApiFailure unavailable() {
    return new ApiFailure(
        503, "TEMPORARILY_UNAVAILABLE", "Public content is temporarily unavailable.");
  }
}
