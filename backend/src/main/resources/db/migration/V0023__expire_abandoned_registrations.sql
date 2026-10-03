-- Narrow scheduled cleanup; the runtime role still cannot erase arbitrary accounts.
-- Fix the trusted schema ahead of pg_temp for SECURITY DEFINER name resolution.
DO $migration$
DECLARE s text=current_schema();
BEGIN
 EXECUTE format($definition$
 CREATE FUNCTION %I.expire_unverified_accounts() RETURNS integer
 LANGUAGE plpgsql SECURITY DEFINER SET search_path=%I,pg_temp AS $body$
 DECLARE candidate record; removed integer=0;
 BEGIN
  FOR candidate IN SELECT id,public_id FROM account
    WHERE status='UNVERIFIED' AND created_at<transaction_timestamp()-interval '7 days'
    ORDER BY id LIMIT 100 FOR UPDATE SKIP LOCKED
  LOOP
   INSERT INTO recovery_journal(sequence_no,event_type,subject_public_id,digest,expires_at)
    VALUES(nextval('recovery_journal_sequence'),'ACCOUNT_ERASE',candidate.public_id,
      encode(sha256(convert_to(candidate.public_id::text,'UTF8')),'hex'),transaction_timestamp()+interval '90 days');
   DELETE FROM account WHERE id=candidate.id AND status='UNVERIFIED';
   removed=removed+1;
  END LOOP;
  RETURN removed;
 END $body$;
 $definition$,s,s);
 EXECUTE format('REVOKE ALL ON FUNCTION %I.expire_unverified_accounts() FROM PUBLIC',s);
 EXECUTE format('GRANT EXECUTE ON FUNCTION %I.expire_unverified_accounts() TO otr_runtime,otr_privacy',s);
END $migration$;
CREATE INDEX account_unverified_expiry_idx ON account(created_at,id) WHERE status='UNVERIFIED';
