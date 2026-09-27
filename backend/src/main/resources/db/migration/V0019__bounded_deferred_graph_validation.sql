-- An importer can change thousands of heads. Validate their final graph once per
-- transaction, without a caller-controlled setting that could suppress checks.
CREATE TABLE catalog_graph_validation (
 transaction_id xid8 PRIMARY KEY
);
REVOKE ALL ON catalog_graph_validation FROM PUBLIC,otr_runtime,otr_import,otr_privacy;
CREATE OR REPLACE FUNCTION catalog_graph_lock() RETURNS trigger LANGUAGE plpgsql
 SECURITY DEFINER SET search_path=pg_catalog AS $$
BEGIN
 PERFORM pg_advisory_xact_lock(8042026);
 EXECUTE format('INSERT INTO %I.catalog_graph_validation(transaction_id) VALUES(pg_current_xact_id()) ON CONFLICT DO NOTHING',TG_TABLE_SCHEMA);
 IF TG_OP='DELETE' THEN RETURN OLD; END IF;
 RETURN NEW;
END $$;
CREATE OR REPLACE FUNCTION check_draft_graph() RETURNS trigger LANGUAGE plpgsql
 SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE pending integer;
BEGIN
 EXECUTE format('DELETE FROM %I.catalog_graph_validation WHERE transaction_id=pg_current_xact_id()',TG_TABLE_SCHEMA);
 GET DIAGNOSTICS pending=ROW_COUNT;
 IF pending>0 THEN
  PERFORM set_config('search_path',format('pg_catalog,%I,pg_temp',TG_TABLE_SCHEMA),true);
  EXECUTE format('SELECT %I.validate_dependency_graph(NULL)',TG_TABLE_SCHEMA);
 END IF;
 RETURN NULL;
END $$;
