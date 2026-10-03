package org.options.platform.identity.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.*;

public final class WebAuthnInputs {
  public record Attestation(
      @NotBlank @Pattern(regexp = "[A-Za-z0-9_-]{1,24000}") String clientDataJSON,
      @NotBlank @Pattern(regexp = "[A-Za-z0-9_-]{1,24000}") String attestationObject,
      @NotNull @Size(max = 5)
          List<@Pattern(regexp = "usb|nfc|ble|internal|hybrid") String> transports) {}

  public record Assertion(
      @NotBlank @Pattern(regexp = "[A-Za-z0-9_-]{1,24000}") String clientDataJSON,
      @NotBlank @Pattern(regexp = "[A-Za-z0-9_-]{1,24000}") String authenticatorData,
      @NotBlank @Pattern(regexp = "[A-Za-z0-9_-]{1,24000}") String signature,
      @Pattern(regexp = "[A-Za-z0-9_-]{1,24000}") String userHandle) {}

  public record RegistrationInput(
      @NotBlank @Size(max = 24000) String id,
      @NotBlank @Pattern(regexp = "[A-Za-z0-9_-]{1,24000}") String rawId,
      @NotNull @Pattern(regexp = "public-key") String type,
      @NotBlank @Size(max = 100) String label,
      @NotNull @Valid Attestation response,
      @NotNull @Size(max = 0) Map<String, String> clientExtensionResults) {}

  public record AssertionInput(
      @NotBlank @Size(max = 24000) String id,
      @NotBlank @Pattern(regexp = "[A-Za-z0-9_-]{1,24000}") String rawId,
      @NotNull @Pattern(regexp = "public-key") String type,
      @NotNull @Valid Assertion response,
      @NotNull @Size(max = 0) Map<String, String> clientExtensionResults) {}
}
