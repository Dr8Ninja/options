package org.options.platform;

import static org.assertj.core.api.Assertions.*;

import java.net.URI;
import org.junit.jupiter.api.Test;
import org.options.platform.identity.service.IdentityMail;
import org.options.platform.ops.config.AppProperties;
import org.springframework.mock.env.MockEnvironment;

class IdentityConfigTest {
  @Test
  void productionCannotUseLocalOrUnconfiguredSmtp() {
    var app =
        new AppProperties(
            URI.create("https://learning.example.invalid"), AppProperties.Environment.PRODUCTION);
    assertThatThrownBy(
            () ->
                new IdentityMail(
                    null,
                    null,
                    new MockEnvironment().withProperty("IDENTITY_MAIL_MODE", "LOCAL"),
                    app))
        .isInstanceOf(IllegalStateException.class);
    assertThatThrownBy(
            () ->
                new IdentityMail(
                    null,
                    null,
                    new MockEnvironment().withProperty("IDENTITY_MAIL_MODE", "SMTP"),
                    app))
        .isInstanceOf(IllegalStateException.class);
    assertThatCode(() -> new IdentityMail(null, null, new MockEnvironment(), app))
        .doesNotThrowAnyException();
  }
}
