package org.options.platform.identity.persistence;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/** No navigation collections, password getter, or entity-to-wire serialization. */
@Entity
@Table(name = "account")
@com.fasterxml.jackson.annotation.JsonIgnoreType
public class Account {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, updatable = false)
  private UUID publicId;

  @Column(nullable = false)
  private String email;

  @Column(nullable = false)
  private String emailKey;

  @Column(nullable = false)
  private String passwordHash;

  private String displayName;

  @Column(nullable = false)
  private String status;

  private Instant verifiedAt;
  private Instant lastLoginAt;

  @Column(nullable = false)
  private long authGeneration;

  @Column(nullable = false, updatable = false)
  private Instant eligibilityAttestedAt;

  @Column(nullable = false)
  private String theme;

  private Long interestPathId;
  private Instant deletionRequestedAt;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  @Version private long lockVersion;

  protected Account() {}

  public static Account unverified(String email, String emailKey, String hash, Instant attestedAt) {
    if (!hash.startsWith("{argon2id}$argon2id$"))
      throw new IllegalArgumentException("Encoded password required");
    var account = new Account();
    account.publicId = UUID.randomUUID();
    account.email = email.strip();
    account.emailKey = emailKey;
    account.passwordHash = hash;
    account.status = "UNVERIFIED";
    account.theme = "system";
    account.eligibilityAttestedAt = attestedAt;
    account.createdAt = Instant.now();
    account.updatedAt = account.createdAt;
    return account;
  }

  public Long id() {
    return id;
  }

  public UUID publicId() {
    return publicId;
  }

  public long version() {
    return lockVersion;
  }

  public String displayName() {
    return displayName;
  }

  public void rename(String name) {
    displayName = name;
    updatedAt = Instant.now();
  }
}
