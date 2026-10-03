package org.options.platform.identity.service;

import java.util.*;
import org.options.platform.identity.api.IdentityDtos.*;
import org.options.platform.identity.api.IdentityResponses.*;
import org.options.platform.identity.model.Identity;
import org.options.platform.identity.repository.IdentityRepository;
import org.options.platform.identity.security.*;
import org.options.platform.ops.web.ApiFailure;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IdentityService {
  private final IdentityRepository repo;
  private final PasswordHashes hashes;
  private final PasswordPolicy policy;

  public IdentityService(IdentityRepository repo, PasswordHashes hashes, PasswordPolicy policy) {
    this.repo = repo;
    this.hashes = hashes;
    this.policy = policy;
  }

  public static String email(String value) {
    return value.strip().toLowerCase(Locale.ROOT);
  }

  public Identity find(String id) {
    return repo.byPublicId(id, false);
  }

  public Identity user(String value) {
    return repo.byEmail(email(value), false);
  }

  public static ApiFailure denied() {
    return new ApiFailure(401, "AUTHENTICATION_REQUIRED", "Sign in to continue.");
  }

  public static ApiFailure invalidToken() {
    return new ApiFailure(
        400, "TOKEN_INVALID", "This link is invalid or expired. Request a new message.");
  }

  public Identity active(String id, long generation, boolean lock) {
    var a = repo.byPublicId(id, lock);
    if (a == null || !a.status().equals("ACTIVE") || a.generation() != generation) throw denied();
    return a;
  }

  @Transactional
  public void register(RegisterInput input) {
    String hash = hashes.encode(policy.accepted(input.password()));
    Long id = repo.register(email(input.email()), hash, input.displayName());
    if (id != null) {
      var a = repo.byId(id, true);
      repo.enqueue(a, "VERIFY", null);
      repo.audit(id, "REGISTERED");
    }
  }

  @Transactional
  public void request(String address, String purpose) {
    var a = repo.byEmail(email(address), true);
    if (a == null) return;
    if ((purpose.equals("VERIFY") && a.status().equals("UNVERIFIED"))
        || (purpose.equals("RESET") && a.status().equals("ACTIVE"))) repo.enqueue(a, purpose, null);
  }

  @Transactional
  public Identity login(String id, long generation) {
    var a = repo.byPublicId(id, true);
    if (a == null
        || a.generation() != generation
        || !Set.of("ACTIVE", "UNVERIFIED").contains(a.status())
        || (a.status().equals("UNVERIFIED")
            && a.created().isBefore(java.time.Instant.now().minusSeconds(604800)))) throw denied();
    repo.login(a.id());
    repo.audit(a.id(), "PASSWORD_LOGIN");
    return a;
  }

  @Transactional
  public void confirm(String secret, String purpose, String password) {
    String hash = password == null ? null : hashes.encode(policy.accepted(password));
    var token = repo.token(IdentityThrottle.digest(secret));
    if (token == null || !token.purpose().equals(purpose)) throw invalidToken();
    var a = repo.byId(token.accountId(), true);
    if (a == null
        || a.generation() != token.generation()
        || !Set.of("ACTIVE", "UNVERIFIED").contains(a.status())
        || !repo.consume(token.id())) throw invalidToken();
    switch (purpose) {
      case "VERIFY" -> {
        if (!a.status().equals("UNVERIFIED")
            || a.created().isBefore(java.time.Instant.now().minusSeconds(604800)))
          throw invalidToken();
        repo.verify(a.id());
      }
      case "RESET" -> {
        if (!a.status().equals("ACTIVE")) throw invalidToken();
        repo.removePrivileges(a.id());
        repo.password(a.id(), hash);
      }
      case "CHANGE_EMAIL" -> {
        if (repo.byEmail(token.target(), false) != null) throw invalidToken();
        repo.email(a.id(), token.target());
      }
      default -> throw invalidToken();
    }
    repo.audit(a.id(), purpose + "_CONFIRMED");
  }

  @Transactional
  public void revoke(String id, long generation) {
    var a = active(id, generation, true);
    repo.revoke(a.id());
    repo.audit(a.id(), "LOGOUT_ALL");
  }

  @Transactional
  public void changePassword(String id, long generation, String value) {
    var a = active(id, generation, true);
    repo.password(a.id(), hashes.encode(policy.accepted(value)));
    repo.audit(a.id(), "PASSWORD_CHANGED");
  }

  @Transactional
  public void changeEmail(String id, long generation, String value) {
    var a = active(id, generation, true);
    String target = email(value);
    if (repo.byEmail(target, false) == null) repo.enqueue(a, "CHANGE_EMAIL", target);
    repo.audit(a.id(), "EMAIL_CHANGE_REQUESTED");
  }

  @Transactional
  public void cancelEmail(String id, long generation) {
    var a = active(id, generation, true);
    repo.cancelEmail(a.id());
  }

  public Profile profile(Identity a) {
    return new Profile(
        a.publicId().toString(),
        a.email(),
        a.displayName(),
        a.theme(),
        null,
        a.status().equals("ACTIVE"),
        "v" + a.version());
  }

  @Transactional
  public Profile profile(String id, long generation, ProfileInput input, String version) {
    var a = active(id, generation, true);
    if (!("\"v" + a.version() + "\"").equals(version))
      throw new ApiFailure(412, "VERSION_CONFLICT", "Reload your account before editing.");
    repo.profile(a.id(), input.displayName(), input.theme(), input.interestPathId(), a.version());
    return profile(repo.byId(a.id(), false));
  }
}
