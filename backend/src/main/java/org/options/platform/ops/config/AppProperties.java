package org.options.platform.ops.config;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("app")
public record AppProperties(@NotNull URI publicOrigin, @NotNull Environment environment) {
  public enum Environment {
    LOCAL,
    TEST,
    PRODUCTION
  }

  @AssertTrue(
      message =
          "public origin must be an HTTPS origin without credentials, path, query or fragment")
  public boolean isOriginSafe() {
    return publicOrigin != null
        && "https".equals(publicOrigin.getScheme())
        && publicOrigin.getHost() != null
        && publicOrigin.getRawUserInfo() == null
        && (publicOrigin.getRawPath() == null || publicOrigin.getRawPath().isEmpty())
        && publicOrigin.getRawQuery() == null
        && publicOrigin.getRawFragment() == null
        && (environment != Environment.PRODUCTION
            || !java.util.Set.of("localhost", "127.0.0.1", "::1", "[::1]")
                .contains(publicOrigin.getHost()));
  }
}
