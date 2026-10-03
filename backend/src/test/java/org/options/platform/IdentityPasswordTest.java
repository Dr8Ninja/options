package org.options.platform;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.options.platform.identity.security.*;

class IdentityPasswordTest {
  @Test
  void unicodeIsNormalizedAndBoundedByCodePoints() throws Exception {
    var policy = new PasswordPolicy();
    var hashes = new PasswordHashes();
    String composed = "An éclair beside 7 lanterns";
    String decomposed = java.text.Normalizer.normalize(composed, java.text.Normalizer.Form.NFD);
    assertThat(policy.accepted(decomposed)).isEqualTo(composed);
    assertThat(hashes.matches(decomposed, hashes.encode(composed))).isTrue();
    assertThat(policy.accepted("🪷".repeat(128)).codePointCount(0, 256)).isEqualTo(128);
    assertThatThrownBy(() -> policy.accepted("🪷".repeat(129)))
        .isInstanceOf(org.options.platform.ops.web.ApiFailure.class);
  }
}
