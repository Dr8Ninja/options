package org.options.platform.identity.service;

import java.util.*;
import org.options.platform.identity.api.IdentityDtos.*;
import org.options.platform.identity.api.IdentityResponses.*;
import org.options.platform.identity.api.WebAuthnInputs.*;
import org.options.platform.identity.repository.*;
import org.options.platform.ops.config.AppProperties;
import org.options.platform.ops.web.ApiFailure;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.webauthn.api.*;
import org.springframework.security.web.webauthn.jackson.WebauthnJacksonModule;
import org.springframework.security.web.webauthn.management.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.node.ObjectNode;

@Service
public class IdentityWebAuthn {
  private final WebAuthnRepository credentials;
  private final ChallengeRepository challenges;
  private final IdentityService identities;
  private final IdentityRepository accounts;
  private final JdbcTemplate jdbc;
  private final Webauthn4JRelyingPartyOperations operations;
  private final JsonMapper json =
      JsonMapper.builder().addModule(new WebauthnJacksonModule()).build();

  public IdentityWebAuthn(
      WebAuthnRepository credentials,
      ChallengeRepository challenges,
      IdentityService identities,
      IdentityRepository accounts,
      JdbcTemplate jdbc,
      AppProperties app) {
    this.credentials = credentials;
    this.challenges = challenges;
    this.identities = identities;
    this.accounts = accounts;
    this.jdbc = jdbc;
    operations =
        new Webauthn4JRelyingPartyOperations(
            credentials,
            credentials,
            PublicKeyCredentialRpEntity.builder()
                .id(app.publicOrigin().getHost())
                .name("Options learning")
                .build(),
            Set.of(app.publicOrigin().toString()));
    operations.setCustomizeCreationOptions(
        x ->
            x.timeout(java.time.Duration.ofMinutes(5))
                .authenticatorSelection(
                    AuthenticatorSelectionCriteria.builder()
                        .residentKey(ResidentKeyRequirement.PREFERRED)
                        .userVerification(UserVerificationRequirement.REQUIRED)
                        .build()));
    operations.setCustomizeRequestOptions(
        x ->
            x.timeout(java.time.Duration.ofMinutes(5))
                .userVerification(UserVerificationRequirement.REQUIRED));
  }

  private Authentication principal(String id) {
    return UsernamePasswordAuthenticationToken.authenticated(id, null, List.of());
  }

  @Transactional
  public RegistrationOptions registrationOptions(String id, long generation, String session) {
    return json.treeToValue(options(id, generation, session, true), RegistrationOptions.class);
  }

  @Transactional
  public AssertionOptions assertionOptions(String id, long generation, String session) {
    return json.treeToValue(options(id, generation, session, false), AssertionOptions.class);
  }

  @Transactional
  public ObjectNode options(String id, long generation, String session, boolean register) {
    var a = identities.active(id, generation, true);
    if (register && list(id, generation).items().size() >= 10)
      throw new ApiFailure(409, "CREDENTIAL_LIMIT", "Remove an unused security key first.");
    Object options =
        register
            ? operations.createPublicKeyCredentialCreationOptions(() -> principal(id))
            : operations.createCredentialRequestOptions(() -> principal(id));
    String text = json.writeValueAsString(options);

    ObjectNode node = (ObjectNode) json.readTree(text);
    node.remove("extensions");
    if (register) ((ObjectNode) node.get("authenticatorSelection")).remove("requireResidentKey");
    challenges.save(
        a.id(), session, register ? "REGISTER" : "AUTHENTICATE", json.writeValueAsString(node));
    return node;
  }

  @Transactional
  public Credential register(String id, long generation, String session, RegistrationInput input) {
    var a = identities.active(id, generation, true);
    String raw = challenges.consume(a.id(), session, "REGISTER");
    if (!input.id().equals(input.rawId())) throw IdentityService.invalidToken();
    try {
      var response =
          AuthenticatorAttestationResponse.builder()
              .clientDataJSON(Bytes.fromBase64(input.response().clientDataJSON()))
              .attestationObject(Bytes.fromBase64(input.response().attestationObject()))
              .transports(
                  input.response().transports().stream()
                      .map(AuthenticatorTransport::valueOf)
                      .toList())
              .build();
      var key =
          PublicKeyCredential.<AuthenticatorAttestationResponse>builder()
              .id(input.id())
              .rawId(Bytes.fromBase64(input.rawId()))
              .type(PublicKeyCredentialType.PUBLIC_KEY)
              .response(response)
              .clientExtensionResults(new ImmutableAuthenticationExtensionsClientOutputs(List.of()))
              .build();
      operations.registerCredential(
          new ImmutableRelyingPartyRegistrationRequest(
              restoreRegistration(raw), new RelyingPartyPublicKey(key, input.label())));
      accounts.audit(a.id(), "WEBAUTHN_REGISTERED");
      return jdbc.queryForObject(
          "select public_id,label,created_at,backup_eligible from webauthn_credential where credential_id=? and account_id=?",
          (r, n) ->
              new Credential(
                  r.getString(1),
                  r.getString(2),
                  r.getTimestamp(3).toInstant().toString(),
                  r.getBoolean(4)),
          Bytes.fromBase64(input.rawId()).getBytes(),
          a.id());
    } catch (ApiFailure e) {
      throw e;
    } catch (RuntimeException e) {
      throw new ApiFailure(
          400, "WEBAUTHN_INVALID", "The security key could not be verified. Start again.");
    }
  }

  @Transactional
  public void assertKey(String id, long generation, String session, AssertionInput input) {
    var a = identities.active(id, generation, true);
    String raw = challenges.consume(a.id(), session, "AUTHENTICATE");
    if (!input.id().equals(input.rawId())) throw IdentityService.invalidToken();
    try {
      var stored = credentials.findByCredentialId(Bytes.fromBase64(input.rawId()));
      var user = credentials.findByUsername(id);
      if (stored == null || user == null || !stored.getUserEntityUserId().equals(user.getId()))
        throw IdentityService.invalidToken();
      var response =
          AuthenticatorAssertionResponse.builder()
              .clientDataJSON(Bytes.fromBase64(input.response().clientDataJSON()))
              .authenticatorData(Bytes.fromBase64(input.response().authenticatorData()))
              .signature(Bytes.fromBase64(input.response().signature()))
              .userHandle(
                  input.response().userHandle() == null
                      ? null
                      : Bytes.fromBase64(input.response().userHandle()))
              .build();
      var key =
          PublicKeyCredential.<AuthenticatorAssertionResponse>builder()
              .id(input.id())
              .rawId(Bytes.fromBase64(input.rawId()))
              .type(PublicKeyCredentialType.PUBLIC_KEY)
              .response(response)
              .clientExtensionResults(new ImmutableAuthenticationExtensionsClientOutputs(List.of()))
              .build();
      var verified =
          operations.authenticate(
              new RelyingPartyAuthenticationRequest(restoreAssertion(raw), key));
      if (!verified.getName().equals(id)) throw IdentityService.invalidToken();
      accounts.audit(a.id(), "WEBAUTHN_ASSERTED");
    } catch (ApiFailure e) {
      throw e;
    } catch (RuntimeException e) {
      throw new ApiFailure(
          400, "WEBAUTHN_INVALID", "The security key could not be verified. Start again.");
    }
  }

  // Persist only the closed wire shape; reconstruct framework values explicitly.
  // No polymorphic deserialization or executable content is accepted from the database.
  private List<PublicKeyCredentialDescriptor> descriptors(List<CredentialDescriptor> list) {
    return list.stream()
        .map(
            d ->
                PublicKeyCredentialDescriptor.builder()
                    .type(PublicKeyCredentialType.PUBLIC_KEY)
                    .id(Bytes.fromBase64(d.id()))
                    .transports(
                        new HashSet<>(
                            d.transports().stream().map(AuthenticatorTransport::valueOf).toList()))
                    .build())
        .toList();
  }

  private PublicKeyCredentialCreationOptions restoreRegistration(String raw) {
    var o = json.readValue(raw, RegistrationOptions.class);
    var algorithms =
        List.of(
            PublicKeyCredentialParameters.ES256,
            PublicKeyCredentialParameters.ES384,
            PublicKeyCredentialParameters.ES512,
            PublicKeyCredentialParameters.RS256,
            PublicKeyCredentialParameters.RS384,
            PublicKeyCredentialParameters.RS512,
            PublicKeyCredentialParameters.EdDSA);
    return PublicKeyCredentialCreationOptions.builder()
        .rp(PublicKeyCredentialRpEntity.builder().id(o.rp().id()).name(o.rp().name()).build())
        .user(
            ImmutablePublicKeyCredentialUserEntity.builder()
                .id(Bytes.fromBase64(o.user().id()))
                .name(o.user().name())
                .displayName(o.user().displayName())
                .build())
        .challenge(Bytes.fromBase64(o.challenge()))
        .pubKeyCredParams(
            o.pubKeyCredParams().stream()
                .map(
                    p ->
                        algorithms.stream()
                            .filter(a -> a.getAlg().getValue() == p.alg())
                            .findFirst()
                            .orElseThrow())
                .toList())
        .timeout(java.time.Duration.ofMillis(o.timeout()))
        .excludeCredentials(descriptors(o.excludeCredentials()))
        .authenticatorSelection(
            AuthenticatorSelectionCriteria.builder()
                .residentKey(ResidentKeyRequirement.PREFERRED)
                .userVerification(UserVerificationRequirement.REQUIRED)
                .build())
        .attestation(AttestationConveyancePreference.NONE)
        .build();
  }

  private PublicKeyCredentialRequestOptions restoreAssertion(String raw) {
    var o = json.readValue(raw, AssertionOptions.class);
    return PublicKeyCredentialRequestOptions.builder()
        .challenge(Bytes.fromBase64(o.challenge()))
        .rpId(o.rpId())
        .timeout(java.time.Duration.ofMillis(o.timeout()))
        .allowCredentials(descriptors(o.allowCredentials()))
        .userVerification(UserVerificationRequirement.REQUIRED)
        .build();
  }

  public Credentials list(String id, long generation) {
    var a = identities.active(id, generation, false);
    return new Credentials(
        jdbc.query(
            "select public_id,label,created_at,backup_eligible from webauthn_credential where account_id=? and revoked_at is null order by id",
            (r, n) ->
                new Credential(
                    r.getString(1),
                    r.getString(2),
                    r.getTimestamp(3).toInstant().toString(),
                    r.getBoolean(4)),
            a.id()));
  }

  @Transactional
  public void remove(String id, long generation, UUID credential) {
    var a = identities.active(id, generation, true);
    if (a.privileged() && list(id, generation).items().size() <= 2)
      throw new ApiFailure(
          409,
          "SECOND_KEY_REQUIRED",
          "Enroll a replacement before removing a privileged security key.");
    if (jdbc.update(
            "update webauthn_credential set revoked_at=now(),lock_version=lock_version+1,updated_at=now() where account_id=? and public_id=? and revoked_at is null",
            a.id(),
            credential)
        != 1) throw ApiFailure.missing();
    accounts.revoke(a.id());
    accounts.audit(a.id(), "WEBAUTHN_REVOKED");
  }
}
