package org.options.platform.identity.repository;

import java.sql.*;
import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.web.webauthn.api.*;
import org.springframework.security.web.webauthn.management.*;
import org.springframework.stereotype.Repository;

@Repository
public class WebAuthnRepository
    implements PublicKeyCredentialUserEntityRepository, UserCredentialRepository {
  private final JdbcTemplate jdbc;

  public WebAuthnRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  private PublicKeyCredentialUserEntity user(String where, Object value) {
    var rows =
        jdbc.query(
            "select a.public_id,u.user_handle from identity_webauthn_user u join account a on a.id=u.account_id where "
                + where
                + "=? and a.status='ACTIVE'",
            (r, n) ->
                ImmutablePublicKeyCredentialUserEntity.builder()
                    .id(new Bytes(r.getBytes(2)))
                    .name(r.getString(1))
                    .displayName("Options learning account")
                    .build(),
            value);
    return rows.isEmpty() ? null : rows.getFirst();
  }

  @Override
  public PublicKeyCredentialUserEntity findById(Bytes id) {
    return user("u.user_handle", id.getBytes());
  }

  @Override
  public PublicKeyCredentialUserEntity findByUsername(String name) {
    try {
      return user("a.public_id", UUID.fromString(name));
    } catch (IllegalArgumentException ex) {
      return null;
    }
  }

  @Override
  public void save(PublicKeyCredentialUserEntity user) {
    jdbc.update(
        "insert into identity_webauthn_user(account_id,user_handle) select id,? from account where public_id=? and status='ACTIVE' on conflict(account_id) do nothing",
        user.getId().getBytes(),
        UUID.fromString(user.getName()));
  }

  @Override
  public void delete(Bytes id) {
    jdbc.update(
        "update webauthn_credential set revoked_at=now(),lock_version=lock_version+1,updated_at=now() where credential_id=? and revoked_at is null",
        id.getBytes());
  }

  private static java.time.Instant instant(ResultSet r, String key) throws SQLException {
    var t = r.getTimestamp(key);
    return t == null ? null : t.toInstant();
  }

  private CredentialRecord record(ResultSet r, int ignored) throws SQLException {
    return ImmutableCredentialRecord.builder()
        .credentialType(PublicKeyCredentialType.PUBLIC_KEY)
        .credentialId(new Bytes(r.getBytes("credential_id")))
        .userEntityUserId(new Bytes(r.getBytes("user_handle")))
        .publicKey(new ImmutablePublicKeyCose(r.getBytes("public_key")))
        .signatureCount(r.getLong("sign_count"))
        .uvInitialized(r.getBoolean("uv_initialized"))
        .transports(
            new HashSet<>(
                Arrays.stream(r.getString("transports").split(","))
                    .filter(x -> !x.isBlank())
                    .map(AuthenticatorTransport::valueOf)
                    .toList()))
        .backupEligible(r.getBoolean("backup_eligible"))
        .backupState(r.getBoolean("backed_up"))
        .attestationObject(new Bytes(r.getBytes("attestation_object")))
        .attestationClientDataJSON(new Bytes(r.getBytes("attestation_client_data")))
        .created(instant(r, "created_at"))
        .lastUsed(instant(r, "last_used_at"))
        .label(r.getString("label"))
        .build();
  }

  @Override
  public CredentialRecord findByCredentialId(Bytes id) {
    var rows =
        jdbc.query(
            "select * from webauthn_credential where credential_id=? and revoked_at is null",
            this::record,
            id.getBytes());
    return rows.isEmpty() ? null : rows.getFirst();
  }

  @Override
  public List<CredentialRecord> findByUserId(Bytes id) {
    return jdbc.query(
        "select * from webauthn_credential where user_handle=? and revoked_at is null order by id",
        this::record,
        id.getBytes());
  }

  @Override
  public void save(CredentialRecord r) {
    int count =
        jdbc.update(
            """
    insert into webauthn_credential(account_id,credential_id,user_handle,public_key,sign_count,label,transports,backup_eligible,backed_up,uv_initialized,attestation_object,attestation_client_data,last_used_at)
    select u.account_id,?,?,?,?,?,?,?,?,?,?,?,? from identity_webauthn_user u where u.user_handle=?
    on conflict(credential_id) do update set sign_count=excluded.sign_count,backed_up=excluded.backed_up,uv_initialized=excluded.uv_initialized,last_used_at=excluded.last_used_at,updated_at=now(),lock_version=webauthn_credential.lock_version+1
    where webauthn_credential.account_id=excluded.account_id and webauthn_credential.user_handle=excluded.user_handle and webauthn_credential.revoked_at is null
    """,
            r.getCredentialId().getBytes(),
            r.getUserEntityUserId().getBytes(),
            r.getPublicKey().getBytes(),
            r.getSignatureCount(),
            r.getLabel(),
            String.join(
                ",",
                r.getTransports().stream().map(AuthenticatorTransport::getValue).sorted().toList()),
            r.isBackupEligible(),
            r.isBackupState(),
            r.isUvInitialized(),
            r.getAttestationObject().getBytes(),
            r.getAttestationClientDataJSON().getBytes(),
            r.getLastUsed() == null ? null : Timestamp.from(r.getLastUsed()),
            r.getUserEntityUserId().getBytes());
    if (count != 1) throw new IllegalStateException("Credential cannot be saved");
  }
}
