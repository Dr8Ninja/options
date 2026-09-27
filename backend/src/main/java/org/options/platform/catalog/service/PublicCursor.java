package org.options.platform.catalog.service;

import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.options.platform.ops.web.ApiFailure;
import tools.jackson.databind.json.JsonMapper;

/** Authenticated keyset position. No offsets and no client-provided SQL expressions. */
final class PublicCursor {
  private static final JsonMapper JSON = JsonMapper.builder().build();

  record Position(String schema, String binding, String generation, String last, long expires) {}

  private static String binding(PublicQuery q) {
    return JSON.writeValueAsString(java.util.List.of(q.entity(), q.sort(), q.limit(), q.filters()));
  }

  static String encode(PublicQuery q, String generation, String last, byte[] key) {
    byte[] payload =
        JSON.writeValueAsBytes(
            new Position(
                "1",
                binding(q),
                generation,
                last,
                Instant.now().plusSeconds(1800).getEpochSecond()));
    return Base64.getUrlEncoder().withoutPadding().encodeToString(payload)
        + "."
        + Base64.getUrlEncoder().withoutPadding().encodeToString(sign(payload, key));
  }

  static String decode(PublicQuery q, String generation, byte[] key) {
    if (q.cursor() == null) return null;
    Position p;
    try {
      String[] parts = q.cursor().split("\\.", -1);
      if (parts.length != 2) throw new IllegalArgumentException();
      byte[] payload = Base64.getUrlDecoder().decode(parts[0]);
      if (!MessageDigest.isEqual(sign(payload, key), Base64.getUrlDecoder().decode(parts[1])))
        throw new IllegalArgumentException();
      p = JSON.readValue(payload, Position.class);
      if (!"1".equals(p.schema()) || !binding(q).equals(p.binding()) || p.last() == null)
        throw new IllegalArgumentException();
    } catch (Exception e) {
      throw new ApiFailure(400, "INVALID_CURSOR", "Restart from the first page.");
    }
    if (!generation.equals(p.generation()))
      throw new ApiFailure(
          409, "CONTENT_VERSION_CHANGED", "Content changed; restart from the first page.");
    if (p.expires() <= Instant.now().getEpochSecond())
      throw new ApiFailure(
          409, "CURSOR_EXPIRED", "The page cursor expired; restart from the first page.");
    return p.last();
  }

  private static byte[] sign(byte[] payload, byte[] key) {
    try {
      Mac mac = Mac.getInstance("HmacSHA256");
      mac.init(new SecretKeySpec(key, "HmacSHA256"));
      return mac.doFinal(payload);
    } catch (java.security.GeneralSecurityException e) {
      throw new IllegalStateException("Cursor signing unavailable", e);
    }
  }
}
