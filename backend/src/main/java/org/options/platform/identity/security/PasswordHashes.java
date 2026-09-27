package org.options.platform.identity.security;

import java.util.Map;
import java.util.concurrent.Semaphore;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.stereotype.Component;

/** Persistence hashing only. Account enrollment/password policy and login remain P13. */
@Component
public final class PasswordHashes {
  private final DelegatingPasswordEncoder encoder =
      new DelegatingPasswordEncoder(
          "argon2id", Map.of("argon2id", new Argon2PasswordEncoder(16, 32, 1, 19456, 2)));
  private final Semaphore workers = new Semaphore(2);

  public String encode(String password) {
    int length = password.codePointCount(0, password.length());
    if (length < 15 || length > 128) throw new IllegalArgumentException("Password length invalid");
    if (!workers.tryAcquire()) throw new IllegalStateException("Password service busy");
    try {
      return encoder.encode(password);
    } finally {
      workers.release();
    }
  }

  public boolean matches(String password, String encoded) {
    if (password.codePointCount(0, password.length()) > 128) return false;
    if (!workers.tryAcquire()) throw new IllegalStateException("Password service busy");
    try {
      return encoder.matches(password, encoded);
    } finally {
      workers.release();
    }
  }
}
