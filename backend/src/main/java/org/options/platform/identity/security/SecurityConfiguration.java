package org.options.platform.identity.security;

import org.options.platform.ops.config.AppProperties;
import org.options.platform.ops.web.Problems;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CsrfException;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.security.web.csrf.XorCsrfTokenRequestAttributeHandler;
import org.springframework.session.web.http.DefaultCookieSerializer;

@Configuration
@org.springframework.security.config.annotation.authorization.EnableMultiFactorAuthentication(
    authorities = {})
public class SecurityConfiguration {
  @Bean
  UserDetailsService noDefaultAccounts() {
    return username -> {
      throw new UsernameNotFoundException("Unavailable");
    };
  }

  @Bean
  DefaultCookieSerializer sessionCookie() {
    DefaultCookieSerializer cookie = new DefaultCookieSerializer();
    cookie.setCookieName("__Host-OTRSESSION");
    cookie.setCookiePath("/");
    cookie.setUseSecureCookie(true);
    cookie.setUseHttpOnlyCookie(true);
    cookie.setSameSite("Lax");
    return cookie;
  }

  @Bean
  @org.springframework.core.annotation.Order(0)
  SecurityFilterChain management(HttpSecurity http) throws Exception {
    http.securityMatcher(
        org.springframework.boot.security.autoconfigure.actuate.web.servlet.EndpointRequest
            .toAnyEndpoint());
    http.authorizeHttpRequests(
        auth ->
            auth.requestMatchers(
                    org.springframework.boot.security.autoconfigure.actuate.web.servlet
                        .EndpointRequest.to("health"))
                .permitAll()
                .anyRequest()
                .denyAll());
    return http.build();
  }

  @Bean
  SecurityFilterChain security(HttpSecurity http, AppProperties properties) throws Exception {
    http.authorizeHttpRequests(
        auth -> {
          auth.requestMatchers(HttpMethod.GET, "/api/v1/auth/csrf", "/api/health").permitAll();
          for (var method : java.util.List.of(HttpMethod.GET, HttpMethod.HEAD))
            auth.requestMatchers(
                    method,
                    "/api/v1/content-version",
                    "/api/v1/search",
                    "/api/v1/discovery-facets",
                    "/api/v1/routes",
                    "/api/v1/programs",
                    "/api/v1/phases",
                    "/api/v1/modules",
                    "/api/v1/topics",
                    "/api/v1/resources",
                    "/api/v1/paths",
                    "/api/v1/projects",
                    "/api/v1/capstones",
                    "/api/v1/programs/{id}",
                    "/api/v1/phases/{id}",
                    "/api/v1/modules/{id}",
                    "/api/v1/topics/{id}",
                    "/api/v1/subtopics/{id}",
                    "/api/v1/resources/{id}",
                    "/api/v1/paths/{id}",
                    "/api/v1/projects/{id}",
                    "/api/v1/capstones/{id}",
                    "/api/v1/exercises/{id}",
                    "/api/v1/quizzes/{id}")
                .permitAll();
          if (properties.environment() == AppProperties.Environment.LOCAL
              || properties.environment() == AppProperties.Environment.TEST)
            auth.requestMatchers(HttpMethod.GET, "/v3/api-docs").permitAll();
          auth.anyRequest().denyAll();
        });
    http.csrf(
        csrf ->
            csrf.csrfTokenRepository(new HttpSessionCsrfTokenRepository())
                .csrfTokenRequestHandler(new XorCsrfTokenRequestAttributeHandler()));
    http.addFilterBefore(new OriginFilter(properties.publicOrigin()), CsrfFilter.class);
    http.addFilterBefore(new PreSessionLimiter(), CsrfFilter.class);
    http.formLogin(AbstractHttpConfigurer::disable)
        .httpBasic(AbstractHttpConfigurer::disable)
        .logout(AbstractHttpConfigurer::disable)
        .requestCache(AbstractHttpConfigurer::disable)
        .cors(AbstractHttpConfigurer::disable);
    http.exceptionHandling(
        errors ->
            errors
                .authenticationEntryPoint(
                    (req, res, ex) ->
                        Problems.write(
                            req, res, 401, "AUTHENTICATION_REQUIRED", "Sign in to continue."))
                .accessDeniedHandler(
                    (req, res, ex) ->
                        Problems.write(
                            req,
                            res,
                            403,
                            ex instanceof CsrfException ? "CSRF_INVALID" : "ACCESS_DENIED",
                            ex instanceof CsrfException
                                ? "Refresh the security token and try again deliberately."
                                : "This action is not available.")));
    return http.build();
  }
}
