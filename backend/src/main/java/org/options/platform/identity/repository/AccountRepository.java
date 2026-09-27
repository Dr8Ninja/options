package org.options.platform.identity.repository;

import java.util.Optional;
import java.util.UUID;
import org.options.platform.identity.persistence.Account;
import org.springframework.data.repository.Repository;

public interface AccountRepository extends Repository<Account, Long> {
  Account save(Account account);

  Optional<Account> findByPublicId(UUID publicId);
}
