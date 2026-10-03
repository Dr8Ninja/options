package org.options.platform.identity.security;

import java.util.Map;
import java.util.concurrent.Semaphore;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.stereotype.Component;

/** Bounded framework Argon2id hashing with the same NFC normalization at enrollment and login. */
@Component
public final class PasswordHashes
    implements org.springframework.security.crypto.password.PasswordEncoder {
  private final DelegatingPasswordEncoder encoder =
      new DelegatingPasswordEncoder(
          "argon2id", Map.of("argon2id", new Argon2PasswordEncoder(16, 32, 1, 19456, 2)));
  private final Semaphore workers = new Semaphore(2);

  public String encode(CharSequence raw) {
    String password = PasswordPolicy.normalize(raw.toString());
    int length = password.codePointCount(0, password.length());
    if (length < 15 || length > 128) throw new IllegalArgumentException("Password length invalid");
    if (!workers.tryAcquire())
      throw new org.options.platform.ops.web.ApiFailure(
          503, "TEMPORARILY_UNAVAILABLE", "Account service is busy. Try again later.");
    try {
      return encoder.encode(password);
    } finally {
      workers.release();
    }
  }

  public boolean matches(CharSequence raw, String encoded) {
    String password = PasswordPolicy.normalize(raw.toString());
    if (password.codePointCount(0, password.length()) > 128) return false;
    if (!workers.tryAcquire())
      throw new org.options.platform.ops.web.ApiFailure(
          503, "TEMPORARILY_UNAVAILABLE", "Account service is busy. Try again later.");
    try {
      return encoder.matches(password, encoded);
    } finally {
      workers.release();
    }
  }
}
