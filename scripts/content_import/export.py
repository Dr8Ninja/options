"""Typed editorial projections and guarded head recovery; no learner tables are read."""

import copy
import json
import os
import shutil
import uuid
from pathlib import Path
from decimal import Decimal
from datetime import date, datetime
from .package import COLLECTIONS, decode, digest, require, source_paths
from .mapping import COMMON, SECTIONS, LINKS, DETAILS


def scalar(value):
    if isinstance(value, Decimal):
        return int(value) if value == int(value) else float(value)
    if isinstance(value, (date, datetime)):
        return value.isoformat()
    return value


class Reader:
    def __init__(self, db):
        self.db = db

    def external(self, oid):
        return self.db.scalar(
            "select external_id from catalog_object where id=%s", (oid,)
        )

    def record(self, c, rid):
        db = self.db
        row = db.one(
            "select r.*,s.original_payload from catalog_revision r join canonical_revision_source cs on cs.revision_id=r.id join source_record s on s.id=cs.source_record_id where r.id=%s",
            (rid,),
        )
        require(row is not None, "UNSUPPORTED_REVISION_CODEC")
        r = copy.deepcopy(row["original_payload"])
        for key, col in COMMON.items():
            if key in r and not (key == "scope" and c != "subtopics"):
                r[key] = scalar(row[col])
        if "study_hours" in r:
            r["study_hours"] = [scalar(row["hours_min"]), scalar(row["hours_max"])]
        for key, section in SECTIONS.get(c, {}).items():
            values = [
                x["body"]
                for x in db.all(
                    "select body from revision_section where revision_id=%s and section=%s order by ordinal",
                    (rid, section),
                )
            ]
            r[key] = (
                values
                if isinstance(r[key], list)
                else (values[0] if values else (None if r[key] is None else ""))
            )

        def links(relation):
            return db.all(
                "select o.external_id,l.annotation,o.kind from catalog_link l join catalog_object o on o.id=l.target_object_id where l.owner_revision_id=%s and l.relation=%s order by ordinal",
                (rid, relation),
            )

        for key, rel in LINKS.get(c, {}).items():
            values = [x["external_id"] for x in links(rel)]
            r[key] = values if isinstance(r[key], list) else values[0]
        if c == "modules":
            r["exercise_ids"] = [
                x["external_id"] for x in links("assessment") if x["kind"] == "EXERCISE"
            ]
            r["quiz_id"] = next(
                x["external_id"]
                for x in links("assessment")
                if x["kind"] == "BLUEPRINT"
            )
            r["slug"] = db.scalar(
                "select path_key from catalog_route where object_id=%s and canonical",
                (row["object_id"],),
            ).split("/")[-1]
            r["phase_id"] = db.scalar(
                "select o.external_id from catalog_link l join draft_head h on h.revision_id=l.owner_revision_id join catalog_object o on o.id=h.object_id where l.relation='phase_module' and l.target_object_id=%s",
                (row["object_id"],),
            )
            r["program_id"] = db.scalar(
                "select o.external_id from catalog_link l join draft_head h on h.revision_id=l.owner_revision_id join catalog_object o on o.id=h.object_id join catalog_object phase on phase.id=l.target_object_id where l.relation='program_phase' and phase.external_id=%s",
                (r["phase_id"],),
            )
        if c in ["topics", "subtopics"]:
            relation = "module_topic" if c == "topics" else "topic_subtopic"
            field = "module_id" if c == "topics" else "topic_id"
            r[field] = db.scalar(
                "select o.external_id from catalog_link l join draft_head h on h.revision_id=l.owner_revision_id join catalog_object o on o.id=h.object_id where l.relation=%s and l.target_object_id=%s",
                (relation, row["object_id"]),
            )
        if "tags" in r:
            tags = [
                x["slug"]
                for x in db.all(
                    "select t.slug from revision_tag rt join tag t on t.id=rt.tag_id where rt.revision_id=%s order by t.slug",
                    (rid,),
                )
            ]
            r["tags"] = [t for t in r["tags"] if t in tags] + [
                t for t in tags if t not in r["tags"]
            ]
        if c in ["modules", "competencies", "projects"]:
            groups = {}
            for group, table in [
                ("hard", "hard_prerequisite"),
                ("recommended", "recommended_preparation"),
                ("optional", "optional_enrichment"),
            ]:
                field = (
                    "target_object_id" if group == "optional" else "requires_object_id"
                )
                rows = db.all(
                    f"select e.*,o.external_id from {table} e join catalog_object o on o.id=e.{field} where owner_revision_id=%s order by ordinal",
                    (rid,),
                )
                groups[group] = [v["external_id"] for v in rows]
                if c == "competencies" and group == "hard":
                    r["hard_edge_justifications"] = [
                        dict(
                            requires=v["external_id"],
                            supplied_skill=v["supplied_skill"],
                            consumed_by=v["consumed_skill"],
                        )
                        for v in rows
                    ]
            if c == "modules":
                r["prerequisites"] = groups
            elif c == "projects":
                r["prerequisites"] = groups["hard"]
            else:
                for group, field in [
                    ("hard", "hard_prerequisites"),
                    ("recommended", "recommended_preparation"),
                    ("optional", "optional_enrichment"),
                ]:
                    r[field] = groups[group]
        if c in DETAILS:
            table, fields = DETAILS[c]
            d = db.one(f"select * from {table} where revision_id=%s", (rid,))
            for key, col in fields.items():
                if key in r:
                    r[key] = scalar(d[col])
            if c in ["exercises", "quiz_blueprints"]:
                r["module_id"] = self.external(d["module_object_id"])
            if c == "resources":
                r["canonical_url"] = db.scalar(
                    "select original_url from external_locator where id=%s",
                    (d["canonical_locator_id"],),
                )
                r["unknowns"] = {
                    ("doi" if v["field"] == "DOI" else v["field"]): v["reason"]
                    for v in db.all(
                        "select field,reason from resource_unknown where resource_revision_id=%s",
                        (rid,),
                    )
                }
            if c == "associations":
                r["resource_id"] = self.external(d["resource_object_id"])
                r["competency_id"] = self.external(d["competency_object_id"])
                r["evidence_claim_ids"] = [
                    v["external_id"]
                    for v in db.all(
                        "select c.external_id from assignment_claim a join evidence_claim c on c.id=a.claim_id where assignment_revision_id=%s order by c.id",
                        (rid,),
                    )
                ]
            if c == "market_rules":
                if d["value_type"] == "UNKNOWN":
                    r["value"] = None
                elif d["value_type"] == "NUMBER":
                    r["value"] = scalar(d["value_numeric"])
                elif d["value_type"] == "RATE_PAIR":
                    r["value"] = dict(
                        sale_rate=scalar(d["sale_rate"]),
                        exercise_rate=scalar(d["exercise_rate"]),
                    )
                subject = db.one(
                    "select * from rule_subject where id=%s", (d["subject_id"],)
                )
                notice = db.one(
                    "select * from official_notice where id=%s", (d["notice_id"],)
                )
                for key in ["instrument", "jurisdiction", "rule_type"]:
                    r[key] = subject[key]
                r["circular_identifier"] = notice["identifier"]
                r["publication_date"] = notice["publication_date_raw"] or scalar(
                    notice["publication_date"]
                )
                r["source_url"] = db.scalar(
                    "select original_url from external_locator where id=%s",
                    (notice["locator_id"],),
                )
                for field, left, right in [
                    ("supersedes", "newer_notice_id", "older_notice_id"),
                    ("superseded_by", "older_notice_id", "newer_notice_id"),
                ]:
                    values = [
                        v["identifier"]
                        for v in db.all(
                            f"select n.identifier from notice_supersession s join official_notice n on n.id=s.{right} where s.{left}=%s order by n.id",
                            (notice["id"],),
                        )
                    ]
                    r[field] = [x for x in r[field] if x in values] + [
                        x for x in values if x not in r[field]
                    ]
        if c == "competencies":
            d = db.one("select * from competency_revision where revision_id=%s", (rid,))
            r.update(
                module_id=self.external(d["module_object_id"]),
                outcome=d["outcome"],
                diagnostic=dict(
                    prompt=d["diagnostic_prompt"],
                    bridge=self.external(d["diagnostic_bridge_id"]),
                    **{"pass": d["diagnostic_pass"]},
                ),
            )
        if c == "learning_paths":
            r["branches"] = [
                dict(module_id=v["external_id"], rule=v["annotation"])
                for v in links("path_branch")
            ]
        if "rubric" in r:
            r["rubric"] = {
                v["code"]: scalar(v["weight"])
                for v in db.all(
                    "select code,weight from rubric_criterion where owner_revision_id=%s order by ordinal",
                    (rid,),
                )
            }
        if c == "quiz_blueprints":
            r["items"] = [
                dict(
                    kind=v["item_kind"],
                    weight=scalar(v["weight"]),
                    **(
                        {"exercise_id": self.external(v["exercise_object_id"])}
                        if v["exercise_object_id"]
                        else {"question": v["question_text"]}
                    ),
                )
                for v in db.all(
                    "select * from blueprint_item where blueprint_revision_id=%s order by ordinal",
                    (rid,),
                )
            ]
        if c in ["resources", "market_rules"]:
            v = db.one(
                "select * from verification_event where subject_revision_id=%s order by id desc limit 1",
                (rid,),
            )
            r["last_verification_date" if c == "resources" else "verification_date"] = (
                scalar(v["checked_on"])
            )
            if c == "resources":
                r["verification_scope"] = v["scope"]
        return r


def export(db, output, package_id, storage):
    require(output and package_id, "MISSING_EXPORT_ARGUMENTS")
    output = Path(output)
    require(not output.exists() and not output.is_symlink(), "OUTPUT_EXISTS")
    for parent in output.parents:
        require(not parent.is_symlink(), "UNSAFE_OUTPUT_PATH")
    db.execute("set transaction isolation level repeatable read, read only")
    batch = db.one(
        "select * from import_batch where state='APPLIED' order by id desc limit 1"
    )
    require(batch is not None, "NO_APPLIED_IMPORT")
    reader = Reader(db)
    files = {}
    bases = {}
    data = {}
    members = db.all(
        "select distinct on(m.collection,m.external_id) m.*,s.original_payload from import_member m join source_record s on s.id=m.source_record_id join import_batch b on b.id=m.batch_id where b.state='APPLIED' order by m.collection,m.external_id,m.batch_id desc",
        (),
    )
    for c in COLLECTIONS:
        data[c] = dict(
            version="1.0.0-design", as_of=batch["source_as_of"].isoformat(), records=[]
        )
    # Export all known canonical heads, including objects absent in the last proposal.
    heads = db.all(
        "select h.revision_id,r.content_hash,o.external_id,cs.collection,cs.ordinal from draft_head h join catalog_object o on o.id=h.object_id join catalog_revision r on r.id=h.revision_id join canonical_revision_source cs on cs.revision_id=r.id order by cs.collection,cs.ordinal,o.external_id"
    )
    for h in heads:
        data[h["collection"]]["records"].append(
            reader.record(h["collection"], h["revision_id"])
        )
        bases[h["external_id"]] = dict(
            revision=h["revision_id"], hash=h["content_hash"]
        )
    for m in sorted(
        members, key=lambda x: (x["collection"], x["ordinal"], x["external_id"])
    ):
        c = m["collection"]
        if COLLECTIONS[c]["kind"]:
            continue
        r = copy.deepcopy(m["original_payload"])
        if c == "source_mappings":
            record = db.one(
                "select * from source_mapping where id=%s", (m["mapping_id"],)
            )
            r.update(
                original_id=record["original_id"],
                kind=record["source_kind"],
                disposition=record["disposition"],
                note=record["note"],
            )
            r["canonical_ids"] = [
                x["external_id"]
                for x in db.all(
                    "select o.external_id from mapping_target t join catalog_object o on o.id=t.target_object_id where mapping_id=%s order by ordinal",
                    (m["mapping_id"],),
                )
            ]
        if c == "authoring_queue":
            task = db.one("select * from authoring_task where id=%s", (m["task_id"],))
            r.update(
                topic_id=reader.external(task["topic_object_id"]),
                owner_stage=task["owner_stage"],
                status=task["status"],
                author_review_hours=[
                    scalar(task["hours_min"]),
                    scalar(task["hours_max"]),
                ],
                estimate_basis=task["estimate_basis"],
                remaining_work=[
                    v["description"]
                    for v in db.all(
                        "select description from authoring_step where task_id=%s order by ordinal",
                        (task["id"],),
                    )
                ],
            )
        data[c]["records"].append(r)

    def artifact(name, aid=None):
        a = (
            db.one("select * from source_artifact where id=%s", (aid,))
            if aid
            else db.one(
                "select * from source_artifact where repository_path=%s order by id desc limit 1",
                (name,),
            )
        )
        require(a is not None, "MISSING_ARCHIVE", name)
        p = Path(storage) / a["sha256"]
        require(not p.is_symlink() and p.is_file(), "MISSING_ARCHIVE", name)
        raw = p.read_bytes()
        require(digest(raw) == a["sha256"], "ARCHIVE_HASH_MISMATCH")
        return raw

    manifest = decode(artifact("data/v1/manifest.json", batch["artifact_id"]))
    manifest["counts"] = {k: len(data[k]["records"]) for k in manifest["counts"]}
    data["manifest"] = manifest
    for c, value in data.items():
        files["data/v1/" + c + ".json"] = (
            json.dumps(value, ensure_ascii=False, indent=2).encode() + b"\n"
        )
    for name in source_paths():
        files[name] = artifact(name)
    package = dict(
        schema_version="otr-import-v1",
        package_id=package_id,
        base_publication_generation=db.scalar(
            "select generation from active_publication where singleton=1"
        )
        or 0,
        bases=bases,
        retirements=[],
        files={n: digest(v) for n, v in files.items()},
    )
    output.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    staging = output.parent / (".import-export-" + str(uuid.uuid4()))
    staging.mkdir(mode=0o700)
    try:
        for name, raw in files.items():
            target = staging / name
            target.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
            with target.open("xb") as stream:
                stream.write(raw)
                stream.flush()
                os.fsync(stream.fileno())
        (staging / "package.json").write_text(json.dumps(package, indent=2) + "\n")
        from .package import Package

        Package(staging)
        require(not output.exists(), "OUTPUT_EXISTS")
        staging.rename(output)
    finally:
        if staging.exists():
            shutil.rmtree(staging)
    return dict(
        status="EXPORTED",
        package_id=package_id,
        records=sum(len(d["records"]) for c, d in data.items() if c != "manifest"),
        scope="restricted_editorial",
        learner_tables_read=False,
    )


def recover(db, batch, confirm):
    require(batch is not None, "MISSING_RECOVERY_BATCH")
    db.execute("select pg_advisory_xact_lock(8042026)")
    changes = db.all(
        "select c.*,h.revision_id current_revision,o.retired_at current_retired from import_head_change c join draft_head h on h.object_id=c.object_id join catalog_object o on o.id=c.object_id where batch_id=%s order by c.object_id for update of h,o",
        (batch,),
    )
    require(bool(changes), "NO_RECOVERY_CHECKPOINT")
    for c in changes:
        require(
            c["current_revision"] == c["after_revision_id"]
            and c["current_retired"] == c["after_retired_at"],
            "RECOVERY_CONFLICT",
        )
    # New identities are retained; recovery retires them, never deletes source/learner references.
    if confirm:
        for c in changes:
            if c["before_revision_id"]:
                db.execute(
                    "update draft_head set revision_id=%s,workflow='DRAFT' where object_id=%s",
                    (c["before_revision_id"], c["object_id"]),
                )
                db.execute(
                    "update catalog_object set retired_at=%s where id=%s",
                    (c["before_retired_at"], c["object_id"]),
                )
            else:
                db.execute(
                    "update catalog_object set retired_at=transaction_timestamp() where id=%s",
                    (c["object_id"],),
                )
        actor = db.scalar("select actor_id from import_batch where id=%s", (batch,))
        import uuid

        db.insert(
            "editorial_event",
            dict(
                actor_id=actor,
                event_type="IMPORT_RECOVERED",
                import_batch_id=batch,
                request_id=str(uuid.uuid4()),
                reason_code="RESTORE_PREVIOUS_DRAFT_HEADS",
                occurred_at=db.now,
                actor_role="IMPORT_OPERATOR",
            ),
        )
    return dict(
        status="RECOVERED" if confirm else "RECOVERY_PREVIEW",
        batch_id=batch,
        objects=len(changes),
        learner_transactions_reverted=False,
        publication_changed=False,
    )
