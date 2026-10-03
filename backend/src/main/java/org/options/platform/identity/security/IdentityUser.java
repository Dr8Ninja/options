package org.options.platform.identity.security;

import org.options.platform.identity.model.Identity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

public final class IdentityUser extends User {
  private final long generation;

  public IdentityUser(Identity a) {
    super(
        a.publicId().toString(),
        a.hash(),
        a.roles().stream().map(x -> new SimpleGrantedAuthority("ROLE_" + x)).toList());
    generation = a.generation();
  }

  public long generation() {
    return generation;
  }
}
