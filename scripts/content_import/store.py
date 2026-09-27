"""Parameter-bound PostgreSQL interchange and append-only import recovery records."""

import os
import json
import uuid
from pathlib import Path
from datetime import datetime, timezone
import psycopg
from psycopg import sql
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb
from .package import COLLECTIONS, require, digest, decode, Invalid
from .mapping import Writer, COMMON


class Database:
    def __init__(self, connection):
        self.c = connection
        self.now = datetime.now(timezone.utc)

    def execute(self, query, args=()):
        return self.c.execute(query, args)

    def one(self, query, args=()):
        return self.execute(query, args).fetchone()

    def all(self, query, args=()):
        return self.execute(query, args).fetchall()

    def scalar(self, query, args=()):
        row = self.one(query, args)
        return next(iter(row.values())) if row else None

    def insert(self, table, values, returning=None):
        statement = sql.SQL("insert into {} ({}) values ({})").format(
            sql.Identifier(table),
            sql.SQL(",").join(map(sql.Identifier, values)),
            sql.SQL(",").join(sql.Placeholder() for _ in values),
        )
        if returning:
            statement += sql.SQL(" returning {}").format(sql.Identifier(returning))
        row = self.execute(statement, list(values.values()))
        return row.fetchone()[returning] if returning else None


def connect():
    require(bool(os.environ.get("CONTENT_IMPORT_DSN")), "MISSING_IMPORT_DSN")
    c = psycopg.connect(
        os.environ["CONTENT_IMPORT_DSN"], row_factory=dict_row, autocommit=True
    )
    # The CLI is an operator boundary; never accepts DB connection parameters from package files.
    row = c.execute(
        "select rolsuper or rolcreatedb or rolcreaterole or rolreplication or has_schema_privilege(current_user,current_schema(),'CREATE') or has_table_privilege(current_user,'private_note','SELECT') as unsafe,pg_has_role(current_user,'otr_import','MEMBER') importer from pg_roles where rolname=current_user"
    ).fetchone()
    require(not row["unsafe"] and row["importer"], "RESTRICTED_IMPORT_ROLE_REQUIRED")
    return c


def objects(db):
    return {
        v["external_id"]: v
        for v in db.all(
            "select o.id,o.external_id,o.kind,o.retired_at,h.revision_id,h.workflow,r.content_hash,s.source_hash from catalog_object o left join draft_head h on h.object_id=o.id left join catalog_revision r on r.id=h.revision_id left join canonical_revision_source s on s.revision_id=h.revision_id"
        )
    }


def plan(db, p):
    current = objects(db)
    changes = []
    conflicts = []
    generation = (
        db.scalar("select generation from active_publication where singleton=1") or 0
    )
    require(
        generation == p.manifest["base_publication_generation"],
        "PUBLICATION_BASE_CONFLICT",
    )
    reused = db.one(
        "select id,manifest_sha256,state from import_batch where package_id=%s order by run_no desc limit 1",
        (p.manifest["package_id"],),
    )
    require(not reused or reused["manifest_sha256"] == p.hash, "PACKAGE_ID_REUSED")
    if reused and reused["state"] == "APPLIED":
        return dict(
            status="REPLAY", batch_id=reused["id"], changes=[], conflicts=[]
        ), current
    for key, (collection, r, ordinal) in p.records.items():
        kind = COLLECTIONS[collection]["kind"]
        if not kind:
            continue
        old = current.get(key)
        action = "NEW"
        base = p.manifest["bases"].get(key)
        h = digest(r)
        if old:
            require(old["kind"] == kind, "IDENTITY_KIND_CHANGE", key)
            require(base is not None, "MISSING_BASE", key)
            b = db.one(
                "select r.id,r.content_hash,s.source_hash,sr.original_payload from catalog_revision r left join canonical_revision_source s on s.revision_id=r.id left join source_record sr on sr.id=s.source_record_id where r.id=%s and r.object_id=%s",
                (base["revision"], old["id"]),
            )
            require(b and b["content_hash"] == base["hash"], "INVALID_BASE", key)
            if h == b["source_hash"]:
                action = "KEEP_CURRENT"
            elif h == old["source_hash"]:
                action = "UNCHANGED"
            elif old["revision_id"] == b["id"]:
                action = "UPDATE"
            else:
                action = "CONFLICT"
            if key in p.manifest["retirements"]:
                require(h == b["source_hash"], "RETIREMENT_BODY_CHANGE", key)
                action = (
                    "UNCHANGED"
                    if old["retired_at"]
                    else ("RETIRE" if old["revision_id"] == b["id"] else "CONFLICT")
                )
            if action == "CONFLICT":
                conflicts.append(
                    dict(
                        id=key,
                        code="DRAFT_CHANGED",
                        base_revision=b["id"],
                        current_revision=old["revision_id"],
                        fields=sorted(
                            k for k in r if r[k] != (b["original_payload"] or {}).get(k)
                        ),
                        current_hash=old["content_hash"],
                        proposed_source_hash=h,
                    )
                )
        elif base:
            raise Invalid("BASE_FOR_NEW_OBJECT", key)
        require(
            not (key in p.manifest["retirements"] and not old),
            "CANNOT_RETIRE_NEW_OBJECT",
            key,
        )
        changes.append(
            dict(
                id=key,
                collection=collection,
                action=action,
                base=base["revision"] if base else None,
                source_hash=h,
            )
        )
    absent = sorted(set(current) - set(p.records))
    report = dict(
        report_version="otr-report-v1",
        status="CONFLICTED" if conflicts else "VALID",
        package_id=p.manifest["package_id"],
        manifest_sha256=p.hash,
        changes=changes,
        conflicts=conflicts,
        absent_preserved=absent,
        counts={c: len(p.data[c]["records"]) for c in COLLECTIONS},
        publication_changed=False,
    )
    require(
        len(json.dumps(report, indent=2).encode()) < 2 * 1024 * 1024 - 1024,
        "REPORT_TOO_LARGE",
    )
    return report, current


def archive(db, p, storage):
    storage = Path(storage)
    storage.mkdir(parents=True, exist_ok=True, mode=0o700)
    require(not storage.is_symlink(), "UNSAFE_ARCHIVE_DIRECTORY")
    artifacts = {}
    for name, raw in p.files.items():
        sha = digest(raw)
        target = storage / sha
        if target.exists():
            require(
                not target.is_symlink() and digest(target.read_bytes()) == sha,
                "ARCHIVE_HASH_MISMATCH",
            )
        else:
            fd = os.open(target, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
            with os.fdopen(fd, "wb") as f:
                f.write(raw)
                f.flush()
                os.fsync(f.fileno())
        old = db.one(
            "select id from source_artifact where path_hash=%s and sha256=%s",
            (digest(name.encode()), sha),
        )
        artifacts[name] = (
            old["id"]
            if old
            else db.insert(
                "source_artifact",
                dict(
                    repository_path=name,
                    path_hash=digest(name.encode()),
                    sha256=sha,
                    byte_count=len(raw),
                    media_type="application/json"
                    if name.endswith(".json")
                    else "text/markdown",
                    rights_state="RESTRICTED",
                    restricted_storage_key=sha,
                    source_version="1.0.0-design",
                ),
                "id",
            )
        )
    return artifacts


def apply(db, p, storage):
    db.execute("select pg_advisory_xact_lock(hashtextextended(%s,809))", (p.hash,))
    db.execute("select pg_advisory_xact_lock(8042026)")
    # Lock all existing draft rows after the graph lock; compare again inside the committing transaction.
    db.execute("select object_id from draft_head order by object_id for update")
    report, current = plan(db, p)
    if report["status"] == "REPLAY":
        return report
    require(not report["conflicts"], "CONTENT_VERSION_CONFLICT")
    artifacts = archive(db, p, storage)
    actor = db.one(
        "select id from editorial_actor where actor_ref='2be731cc-d80a-4d6b-9c5c-4fbd90377660'"
    )
    actor = (
        actor["id"]
        if actor
        else db.insert(
            "editorial_actor",
            dict(
                actor_ref=uuid.UUID("2be731cc-d80a-4d6b-9c5c-4fbd90377660"),
                label="Canonical import operator",
            ),
            "id",
        )
    )
    batch = db.insert(
        "import_batch",
        dict(
            package_id=p.manifest["package_id"],
            schema_version="otr-import-v1",
            manifest_sha256=p.hash,
            source_as_of=p.data["manifest"]["as_of"],
            run_no=1,
            base_publication_id=db.scalar(
                "select publication_id from active_publication where singleton=1"
            ),
            actor_id=actor,
            artifact_id=artifacts["data/v1/manifest.json"],
            state="VALIDATING",
            report=Jsonb(report),
            report_version="otr-report-v1",
        ),
        "id",
    )
    for ch in report["changes"]:
        if ch["action"] == "NEW":
            key = ch["id"]
            kind = COLLECTIONS[ch["collection"]]["kind"]
            current[key] = dict(
                id=db.insert("catalog_object", dict(external_id=key, kind=kind), "id"),
                kind=kind,
                revision_id=None,
                retired_at=None,
            )
    w = Writer(db, p, current, actor, artifacts)
    claims = decode(p.files["research/registers/claims.json"])["records"]
    for i, r in enumerate(claims):
        old = db.one(
            "select id from evidence_claim where external_id=%s and artifact_id=%s",
            (r["id"], artifacts["research/registers/claims.json"]),
        )
        w.claims[r["id"]] = (
            old["id"]
            if old
            else db.insert(
                "evidence_claim",
                dict(
                    external_id=r["id"],
                    artifact_id=artifacts["research/registers/claims.json"],
                    pointer="/records/" + str(i),
                    statement=r["claim"],
                    claim_class=r["class"],
                    status=r["status"],
                    limitations=r["limitations"],
                    verified_on=r["verified_on"],
                ),
                "id",
            )
        )
    source_records = {}
    for key, (c, r, ordinal) in p.records.items():
        aid = artifacts["data/v1/" + c + ".json"]
        old = db.one(
            "select id from source_record where external_id=%s and artifact_id=%s",
            (key, aid),
        )
        source_records[key] = (
            old["id"]
            if old
            else db.insert(
                "source_record",
                dict(
                    external_id=key,
                    artifact_id=aid,
                    pointer="/records/" + str(ordinal - 1),
                    source_kind=c,
                    original_id=key,
                    disposition="Immutable canonical interchange source; operational fields use typed relations.",
                    original_payload=Jsonb(r),
                ),
                "id",
            )
        )
    # Preserve original inventory records at their actual artifact/pointer as well
    # as the canonical wrapper used to retain envelope/disposition metadata.
    for r in p.data["source_items"]["records"]:
        require(r["source"] in artifacts, "UNKNOWN_SOURCE_PATH", r["source"])
        aid = artifacts[r["source"]]
        if not db.one(
            "select id from source_record where external_id=%s and artifact_id=%s",
            (r["id"], aid),
        ):
            db.insert(
                "source_record",
                dict(
                    external_id=r["id"],
                    artifact_id=aid,
                    pointer=r["pointer"],
                    source_kind=r["kind"],
                    original_id=r["original_record"].get("id"),
                    disposition=r["disposition"],
                    original_payload=Jsonb(r["original_record"]),
                ),
            )
    for ch in report["changes"]:
        key = ch["id"]
        c, r, ordinal = p.records[key]
        old = current[key]
        rid = old["revision_id"]
        kind = old["kind"]
        if ch["action"] in ["NEW", "UPDATE"]:
            common = {
                column: r[field]
                for field, column in COMMON.items()
                if field in r and not (field == "scope" and c != "subtopics")
            }
            common.setdefault("title", r.get("outcome", r.get("question", key))[:500])
            common.setdefault("readiness", "learning_design")
            if "study_hours" in r:
                common.update(
                    hours_min=r["study_hours"][0], hours_max=r["study_hours"][1]
                )
            common.update(
                object_id=old["id"],
                kind=kind,
                revision_no=(
                    db.scalar(
                        "select max(revision_no) from catalog_revision where object_id=%s",
                        (old["id"],),
                    )
                    or 0
                )
                + 1,
                author_actor_id=actor,
                format_version="canonical-v1",
                content_hash="0" * 64,
            )
            rid = db.insert("catalog_revision", common, "id")
            w.write(c, r, rid, kind)
            db.insert(
                "canonical_revision_source",
                dict(
                    revision_id=rid,
                    source_record_id=source_records[key],
                    collection=c,
                    ordinal=ordinal,
                    source_hash=ch["source_hash"],
                ),
            )
            db.execute(
                "update catalog_revision set sealed_at=transaction_timestamp() where id=%s",
                (rid,),
            )
        db.insert(
            "import_proposal",
            dict(
                batch_id=batch,
                object_id=old["id"],
                base_revision_id=ch["base"],
                proposed_revision_id=rid,
                outcome=ch["action"] if ch["action"] != "KEEP_CURRENT" else "UNCHANGED",
            ),
        )
        db.insert(
            "import_member",
            dict(
                batch_id=batch,
                collection=c,
                external_id=key,
                ordinal=ordinal,
                source_record_id=source_records[key],
                revision_id=rid,
            ),
        )
        if ch["action"] in ["NEW", "UPDATE", "RETIRE"]:
            retirement = db.now if ch["action"] == "RETIRE" else old["retired_at"]
            db.insert(
                "import_head_change",
                dict(
                    batch_id=batch,
                    object_id=old["id"],
                    before_revision_id=old["revision_id"],
                    after_revision_id=rid,
                    before_retired_at=old["retired_at"],
                    after_retired_at=retirement,
                ),
            )
            db.execute(
                "insert into draft_head(object_id,revision_id,workflow) values (%s,%s,'DRAFT') on conflict(object_id) do update set revision_id=excluded.revision_id,workflow='DRAFT'",
                (old["id"], rid),
            )
            if ch["action"] == "RETIRE":
                db.execute(
                    "update catalog_object set retired_at=%s where id=%s",
                    (retirement, old["id"]),
                )
            if "slug" in r:
                route = "/modules/" + r["slug"]
                reserved = db.one(
                    "select object_id from catalog_route where path_key=%s", (route,)
                )
                require(
                    not reserved or reserved["object_id"] == old["id"],
                    "SLUG_RESERVED",
                    key,
                )
                if not reserved:
                    db.execute(
                        "update catalog_route set canonical=false where object_id=%s",
                        (old["id"],),
                    )
                    db.insert(
                        "catalog_route",
                        dict(path_key=route, object_id=old["id"], canonical=True),
                    )
    for key, (c, r, ordinal) in p.records.items():
        if COLLECTIONS[c]["kind"]:
            continue
        v = dict(
            batch_id=batch,
            collection=c,
            external_id=key,
            ordinal=ordinal,
            source_record_id=source_records[key],
        )
        if c == "source_mappings":
            mid = db.insert(
                "source_mapping",
                dict(
                    external_id=key,
                    original_id=r["original_id"],
                    source_kind=r["kind"],
                    disposition=r["disposition"],
                    note=r["note"],
                    import_batch_id=batch,
                ),
                "id",
            )
            v["mapping_id"] = mid
            for i, target in enumerate(r["canonical_ids"], 1):
                db.insert(
                    "mapping_target",
                    dict(mapping_id=mid, target_object_id=w.oid(target), ordinal=i),
                )
            for i, aid in enumerate(w.provenance(r), 1):
                db.insert(
                    "mapping_anchor", dict(mapping_id=mid, anchor_id=aid, ordinal=i)
                )
        elif c == "authoring_queue":
            task = db.one("select * from authoring_task where external_id=%s", (key,))
            vals = dict(
                external_id=key,
                topic_object_id=w.oid(r["topic_id"]),
                owner_stage=r["owner_stage"],
                status=r["status"],
                hours_min=r["author_review_hours"][0],
                hours_max=r["author_review_hours"][1],
                estimate_basis=r["estimate_basis"],
            )
            if task:
                require(
                    all(task[k] == value for k, value in vals.items()),
                    "AUTHORING_TASK_CONFLICT",
                    key,
                )
                steps = db.all(
                    "select description from authoring_step where task_id=%s order by ordinal",
                    (task["id"],),
                )
                require(
                    [s["description"] for s in steps] == r["remaining_work"],
                    "AUTHORING_TASK_CONFLICT",
                    key,
                )
                v["task_id"] = task["id"]
            else:
                v["task_id"] = db.insert("authoring_task", vals, "id")
                for i, description in enumerate(r["remaining_work"], 1):
                    db.insert(
                        "authoring_step",
                        dict(task_id=v["task_id"], ordinal=i, description=description),
                    )
        db.insert("import_member", v)
    db.execute("update import_batch set state='STAGED' where id=%s", (batch,))
    db.execute("set constraints all immediate")
    db.execute(
        "update import_batch set state='APPLIED',applied_at=transaction_timestamp() where id=%s",
        (batch,),
    )
    db.insert(
        "editorial_event",
        dict(
            actor_id=actor,
            event_type="IMPORT_APPLIED",
            import_batch_id=batch,
            request_id=str(uuid.uuid4()),
            reason_code="VALIDATED_CANONICAL_PROPOSAL",
            occurred_at=db.now,
            actor_role="IMPORT_OPERATOR",
        ),
    )
    db.insert(
        "job",
        dict(
            kind="IMPORT_EXPORT",
            dedupe_key="import-export:" + str(batch),
            import_batch_id=batch,
            state="READY",
            due_at=db.now,
            attempts=0,
        ),
    )
    return dict(report, status="APPLIED", batch_id=batch)
