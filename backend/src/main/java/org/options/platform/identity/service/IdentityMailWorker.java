package org.options.platform.identity.service;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.*;

@Configuration
@EnableScheduling
public class IdentityMailWorker {
  private final IdentityMail mail;

  public IdentityMailWorker(IdentityMail mail) {
    this.mail = mail;
  }

  @Scheduled(fixedDelayString = "${identity.mail.poll-ms:5000}", initialDelay = 5000)
  public void tick() {
    if (!mail.enabled()) return;
    try {
      mail.deliver();
    } catch (IdentityMail.DeliveryFailed ex) {
      mail.retry(ex.id, ex.notice);
    } catch (org.springframework.mail.MailException ex) {
      /* Delivery rolled back. Retry creates a replacement token; never log recipient or token. */
    }
  }

  @Scheduled(fixedDelay = 3600000, initialDelay = 3600000)
  public void purge() {
    mail.purge();
  }
}
