package org.options.platform.learning.service;

import java.util.UUID;
import org.options.platform.identity.AccountAccess;
import org.options.platform.learning.repository.NoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class Notes {
  private final AccountAccess accounts;
  private final NoteRepository notes;
  private final org.options.platform.ops.persistence.RecoveryJournal journal;

  public Notes(
      AccountAccess accounts,
      NoteRepository notes,
      org.options.platform.ops.persistence.RecoveryJournal journal) {
    this.accounts = accounts;
    this.notes = notes;
    this.journal = journal;
  }

  @Transactional
  public UUID create(long owner, long object, String kind, String text) {
    accounts.lockActive(owner);
    return notes.insert(owner, object, kind, text);
  }

  @Transactional
  public NoteRepository.Note replace(long owner, UUID noteId, long version, String text) {
    accounts.lockActive(owner);
    if (notes.findOwned(owner, noteId).isEmpty())
      throw new IllegalArgumentException("Note unavailable");
    if (!notes.replace(owner, noteId, version, text))
      throw new IllegalStateException("Note version conflict");
    return notes.findOwned(owner, noteId).orElseThrow();
  }

  @Transactional
  public void delete(long owner, UUID noteId, long version) {
    accounts.lockActive(owner);
    if (notes.findOwned(owner, noteId).isEmpty())
      throw new IllegalArgumentException("Note unavailable");
    journal.noteErased(owner, noteId);
    if (!notes.delete(owner, noteId, version))
      throw new IllegalStateException("Note version conflict");
  }
}
