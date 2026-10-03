package org.options.platform.identity.api;

import jakarta.validation.constraints.*;

public final class IdentityDtos {
  private IdentityDtos() {}

  public record RegisterInput(
      @NotBlank @Email @Size(max = 320) String email,
      @NotNull String password,
      @Size(min = 1, max = 100) String displayName,
      @NotNull @AssertTrue Boolean eligibilityAttested) {}

  public record LoginInput(
      @NotBlank @Email @Size(max = 320) String email, @NotNull String password) {}

  public record EmailInput(@NotBlank @Email @Size(max = 320) String email) {}

  public record PasswordInput(@NotNull String password) {}

  public record TokenInput(@NotBlank @Pattern(regexp = "[A-Za-z0-9_-]{43}") String token) {}

  public record ResetInput(
      @NotBlank @Pattern(regexp = "[A-Za-z0-9_-]{43}") String token, @NotNull String newPassword) {}

  public record ChangePasswordInput(@NotNull String newPassword) {}

  public record ProfileInput(
      @Size(min = 1, max = 100) String displayName,
      @NotNull @Pattern(regexp = "system|light|dark") String theme,
      @Size(max = 160) String interestPathId) {}
}
