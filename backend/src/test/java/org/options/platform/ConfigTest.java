package org.options.platform;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.validation.Validation;
import java.net.URI;
import org.junit.jupiter.api.Test;
import org.options.platform.ops.config.AppProperties;

class ConfigTest {
  @Test
  void configurationRejectsMissingAndUnsafeOrigins() {
    try (var factory = Validation.buildDefaultValidatorFactory()) {
      var validator = factory.getValidator();
      assertThat(validator.validate(new AppProperties(null, null))).isNotEmpty();
      for (String origin :
          new String[] {
            "http://localhost:8443",
            "https://user:secret@example.invalid",
            "https://example.invalid/path",
            "https://example.invalid?secret=1"
          })
        assertThat(
                validator.validate(
                    new AppProperties(URI.create(origin), AppProperties.Environment.LOCAL)))
            .isNotEmpty();
      assertThat(
              validator.validate(
                  new AppProperties(
                      URI.create("https://localhost:8443"), AppProperties.Environment.PRODUCTION)))
          .isNotEmpty();
      assertThat(
              validator.validate(
                  new AppProperties(
                      URI.create("https://localhost:8443"), AppProperties.Environment.LOCAL)))
          .isEmpty();
    }
  }
}
