package org.options.platform.identity.security;

import java.util.Map;
import java.util.Set;
import org.options.platform.PlatformApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.core.annotation.Order;
import org.springframework.security.authorization.AuthorityAuthorizationManager;
import org.springframework.security.authorization.AuthorizationManagers;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.webauthn.api.AuthenticatorSelectionCriteria;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialRpEntity;
import org.springframework.security.web.webauthn.api.ResidentKeyRequirement;
import org.springframework.security.web.webauthn.api.UserVerificationRequirement;
import org.springframework.security.web.webauthn.management.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.testcontainers.postgresql.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

/** Test classpath only. Never packaged in the application JAR or container. */
public class WebAuthnFixture {
  public static void main(String[] args) {
    System.setProperty("test.webauthn-fixture", "true");
    var db =
        new PostgreSQLContainer(
            DockerImageName.parse(
                    "postgres@sha256:86c951e05bf56c93d95d397747fb8820ac76cc3bedb78f43abd83eedbe3666ae")
                .asCompatibleSubstituteFor("postgres"));
    db.start();
    System.setProperty("spring.datasource.url", db.getJdbcUrl());
    System.setProperty("spring.datasource.username", db.getUsername());
    System.setProperty("spring.datasource.password", db.getPassword());
    Runtime.getRuntime().addShutdownHook(new Thread(db::stop));
    new SpringApplicationBuilder(PlatformApplication.class, FixtureConfig.class).run(args);
  }

  @TestConfiguration
  @Import(FixtureController.class)
  public static class FixtureConfig {
    @Bean
    @Primary
    UserDetailsService fixtureUsers() {
      String password = System.getenv("FIXTURE_PASSWORD");
      if (password == null || password.length() < 20)
        throw new IllegalStateException("Ephemeral fixture password required");
      return new InMemoryUserDetailsManager(
          User.withUsername("fixture").password("{noop}" + password).roles("EDITOR").build());
    }

    @Bean
    @Primary
    PublicKeyCredentialUserEntityRepository fixtureEntities() {
      return new MapPublicKeyCredentialUserEntityRepository();
    }

    @Bean
    @Primary
    UserCredentialRepository fixtureCredentials() {
      return new MapUserCredentialRepository();
    }

    @Bean
    WebAuthnRelyingPartyOperations fixtureOperations(
        PublicKeyCredentialUserEntityRepository entities, UserCredentialRepository credentials) {
      var rp =
          PublicKeyCredentialRpEntity.builder()
              .id("localhost")
              .name("Isolated compatibility test")
              .build();
      var operations =
          new Webauthn4JRelyingPartyOperations(
              entities, credentials, rp, Set.of("https://localhost:18443"));
      operations.setCustomizeCreationOptions(
          options ->
              options.authenticatorSelection(
                  AuthenticatorSelectionCriteria.builder()
                      .residentKey(ResidentKeyRequirement.REQUIRED)
                      .userVerification(UserVerificationRequirement.REQUIRED)
                      .build()));
      operations.setCustomizeRequestOptions(
          options -> options.userVerification(UserVerificationRequirement.REQUIRED));
      return operations;
    }

    @Bean
    @Order(-1)
    SecurityFilterChain fixtureSecurity(
        HttpSecurity http,
        @org.springframework.beans.factory.annotation.Qualifier("fixtureUsers")
            UserDetailsService users)
        throws Exception {
      http.securityMatcher(
          "/fixture", "/fixture/**", "/login", "/login/**", "/logout", "/webauthn/**");
      var provider =
          new org.springframework.security.authentication.dao.DaoAuthenticationProvider(users);
      provider.setPasswordEncoder(
          org.springframework.security.crypto.factory.PasswordEncoderFactories
              .createDelegatingPasswordEncoder());
      http.authenticationManager(
          new org.springframework.security.authentication.ProviderManager(provider));
      http.authorizeHttpRequests(
          auth ->
              auth.requestMatchers("/fixture", "/login", "/login/**")
                  .permitAll()
                  .requestMatchers("/fixture/privileged")
                  .access(
                      AuthorizationManagers.allOf(
                          AuthorityAuthorizationManager.hasRole("EDITOR"),
                          AuthorityAuthorizationManager.hasAuthority("FACTOR_PASSWORD"),
                          AuthorityAuthorizationManager.hasAuthority("FACTOR_WEBAUTHN")))
                  .anyRequest()
                  .authenticated());
      http.formLogin(
          form ->
              form.loginPage("/fixture")
                  .loginProcessingUrl("/login")
                  .successHandler((req, res, auth) -> res.setStatus(204)));
      http.webAuthn(
          web ->
              web.rpId("localhost")
                  .rpName("Isolated compatibility test")
                  .allowedOrigins("https://localhost:18443"));
      http.addFilterBefore(
          new OriginFilter(java.net.URI.create("https://localhost:18443")), CsrfFilter.class);
      http.exceptionHandling(
          e ->
              e.authenticationEntryPoint((req, res, ex) -> res.setStatus(401))
                  .accessDeniedHandler((req, res, ex) -> res.setStatus(403)));
      return http.build();
    }
  }

  @RestController
  @org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(
      name = "test.webauthn-fixture",
      havingValue = "true")
  public static class FixtureController {
    @GetMapping(value = "/fixture", produces = "text/html")
    String page() {
      return "<!doctype html><html lang='en'><title>Isolated security test</title><body>Test fixture</body></html>";
    }

    @GetMapping("/fixture/privileged")
    Map<String, String> privileged() {
      return Map.of("result", "both factors verified");
    }
  }
}
