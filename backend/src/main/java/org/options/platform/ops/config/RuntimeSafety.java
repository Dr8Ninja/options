package org.options.platform.ops.config;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
final class RuntimeSafety implements InitializingBean {
  private final AppProperties properties;
  private final Environment env;

  RuntimeSafety(AppProperties properties, Environment env) {
    this.properties = properties;
    this.env = env;
  }

  @Override
  public void afterPropertiesSet() {
    String password = env.getRequiredProperty("spring.datasource.password");
    if (password.isBlank()) throw new IllegalStateException("A database password is required");
    if (properties.environment() == AppProperties.Environment.PRODUCTION) {
      String user = env.getRequiredProperty("spring.datasource.username");
      String url = env.getRequiredProperty("spring.datasource.url");
      if (java.util.Arrays.asList(env.getActiveProfiles()).contains("local")
          || java.util.Set.of("options_local", "postgres", "test").contains(user)
          || !url.matches(".*[?&]sslmode=verify-full(?:&.*)?$"))
        throw new IllegalStateException(
            "Production requires a dedicated database role, verified TLS and no local profile");
    }
  }
}
