package org.options.platform.identity.model;

import java.time.Instant;
import java.util.*;

/** Internal identity snapshot, never serialized as an API response. */
public record Identity(
    long id,
    UUID publicId,
    String email,
    String hash,
    String status,
    long generation,
    Instant created,
    String displayName,
    String theme,
    long version,
    List<String> roles) {
  public boolean privileged() {
    return roles.stream().anyMatch(x -> !x.equals("LEARNER"));
  }
}
