package org.options.platform.identity.security;

import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.*;
import org.options.platform.ops.web.ApiFailure;
import org.springframework.stereotype.Component;

@Component
public class PasswordPolicy {
  private final Set<String> blocked;

  public PasswordPolicy() throws java.io.IOException {
    try (var input = getClass().getResourceAsStream("/identity/blocked-password-sha256.txt")) {
      if (input == null) throw new IllegalStateException("Password blocklist missing");
      blocked =
          Set.copyOf(new String(input.readAllBytes(), StandardCharsets.UTF_8).lines().toList());
    }
  }

  public static String normalize(String password) {
    return Normalizer.normalize(password, Normalizer.Form.NFC);
  }

  public String accepted(String password) {
    String value = normalize(password);
    int size = value.codePointCount(0, value.length());
    if (size < 15
        || size > 128
        || blocked.contains(
            HexFormat.of().formatHex(IdentityThrottle.digest(value.toLowerCase(Locale.ROOT)))))
      throw new ApiFailure(
          422,
          "PASSWORD_POLICY",
          "Use 15–128 characters and a password that is not commonly used.");
    return value;
  }
}
