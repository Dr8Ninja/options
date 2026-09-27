package org.options.platform.ops.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/** Runs before readiness: a production web process never receives migration/erasure authority. */
@Component
final class ProductionDatabaseSafety implements ApplicationRunner {
  private final AppProperties properties;
  private final Environment environment;
  private final JdbcTemplate jdbc;

  ProductionDatabaseSafety(AppProperties properties, Environment environment, JdbcTemplate jdbc) {
    this.properties = properties;
    this.environment = environment;
    this.jdbc = jdbc;
  }

  @Override
  public void run(ApplicationArguments arguments) {
    if (properties.environment() != AppProperties.Environment.PRODUCTION) return;
    if (environment.getProperty("spring.flyway.enabled", Boolean.class, true))
      throw new IllegalStateException(
          "Production migrations must run separately before starting the runtime");
    Boolean unsafe =
        jdbc.queryForObject(
            "select rolsuper or rolcreatedb or rolcreaterole or rolreplication or has_schema_privilege(current_user,current_schema(),'CREATE') or pg_has_role(current_user,'otr_privacy','MEMBER') from pg_roles where rolname=current_user",
            Boolean.class);
    if (!Boolean.FALSE.equals(unsafe))
      throw new IllegalStateException("Production runtime database privileges are excessive");
  }
}
