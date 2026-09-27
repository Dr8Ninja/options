"""Real operator CLI and relational invariants; only CanonicalImportIT supplies credentials."""

import importlib.util
import json
import os
import sys
import shutil
import tempfile
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import psycopg
from psycopg.rows import dict_row
from content_import.package import Package, ROOT, Invalid, digest
from content_import.store import connect, Database, apply, plan
from content_import.export import export, recover

spec = importlib.util.spec_from_file_location(
    "import_cli", ROOT / "scripts/import-content.py"
)
cli = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cli)


def changed(root, source, name, edit=None):
    dest = root / name
    shutil.copytree(source, dest)
    m = json.loads((dest / "package.json").read_text())
    m["package_id"] = name
    if edit:
        edit(dest, m)
    for path in json.loads((source / "package.json").read_text())["files"]:
        if path in m["files"]:
            m["files"][path] = digest((dest / path).read_bytes())
    (dest / "package.json").write_text(json.dumps(m))
    return dest


def modify(path, collection, fn):
    file = path / "data/v1" / f"{collection}.json"
    value = json.loads(file.read_text())
    fn(value["records"])
    file.write_text(json.dumps(value, ensure_ascii=False))


def main():
    results = []
    start = time.monotonic()

    def passed(name):
        results.append(name)
        print("PASS:", name, flush=True)

    with tempfile.TemporaryDirectory(prefix="p09-test-") as temporary:
        root = Path(temporary).resolve()
        source = root / "bootstrap"
        archive = root / "archive"
        cli.write_package(ROOT / "data/v1", source, "canonical-design-bootstrap")
        package = Package(source)
        with (
            connect() as c,
            psycopg.connect(
                os.environ["CONTENT_TEST_ADMIN_DSN"],
                row_factory=dict_row,
                autocommit=True,
            ) as admin,
        ):

            def run(p):
                with c.transaction():
                    return apply(Database(c), Package(p), archive)

            db = Database(c)
            adb = Database(admin)

            def counts():
                return {
                    t: adb.scalar(f"select count(*) from {t}")
                    for t in [
                        "catalog_object",
                        "catalog_revision",
                        "catalog_link",
                        "source_mapping",
                        "mapping_target",
                        "source_record",
                        "import_batch",
                        "draft_head",
                        "private_note",
                        "learning_progress",
                        "quiz_attempt",
                    ]
                }

            before = counts()
            with c.transaction():
                db.execute("set transaction read only")
                preview = plan(db, package)[0]
            assert preview["status"] == "VALID" and counts() == before
            passed("dry run is read only")

            def simultaneous():
                with connect() as other:
                    with other.transaction():
                        return apply(Database(other), Package(source), archive)

            with ThreadPoolExecutor(max_workers=2) as pool:
                one = pool.submit(simultaneous)
                two = pool.submit(simultaneous)
                pair = [one.result(timeout=120), two.result(timeout=120)]
            assert sorted(x["status"] for x in pair) == ["APPLIED", "REPLAY"]
            assert pair[0]["batch_id"] == pair[1]["batch_id"]
            first = next(x for x in pair if x["status"] == "APPLIED")
            passed(
                "simultaneous same-manifest imports commit once and replay the same batch"
            )
            assert first["status"] == "APPLIED"
            baseline = counts()
            assert (
                baseline["catalog_object"] == 2851
                and baseline["source_mapping"] == 6402
            )
            assert adb.scalar("select count(*) from active_publication") == 0
            assert adb.scalar("select count(*) from review_decision") == 0
            assert adb.scalar("select count(*) from rule_certification") == 0
            passed(
                "empty PostgreSQL imports 11452 canonical records without publication"
            )
            again = run(source)
            assert (
                again["status"] == "REPLAY"
                and again["batch_id"] == first["batch_id"]
                and counts() == baseline
            )
            passed("identical manifest replay changes no rows or relationships")
            out = root / "export"
            with c.transaction():
                export(Database(c), out, "export-roundtrip", archive)
            exported = Package(out)
            for collection in package.data:
                a, b = package.data[collection], exported.data[collection]
                if a != b:
                    if "records" in a:
                        aa = {r["id"]: r for r in a["records"]}
                        bb = {r["id"]: r for r in b["records"]}
                        mismatch = [
                            (
                                key,
                                [
                                    field
                                    for field in aa[key]
                                    if aa[key].get(field) != bb.get(key, {}).get(field)
                                ],
                            )
                            for key in aa
                            if aa[key] != bb.get(key)
                        ]
                        raise AssertionError(("roundtrip", collection, mismatch[:10]))
                    raise AssertionError(("roundtrip envelope", collection))
            passed(
                "every canonical record and relationship round-trips through typed projections"
            )
            restore = changed(
                root, out, "restore-export", lambda p, m: m.update(bases={})
            )
            original_dsn = os.environ["CONTENT_IMPORT_DSN"]
            os.environ["CONTENT_IMPORT_DSN"] = os.environ[
                "CONTENT_IMPORT_ROUNDTRIP_DSN"
            ]
            try:
                with connect() as restored:
                    with restored.transaction():
                        apply(Database(restored), Package(restore), archive)
                    second = root / "second-export"
                    with restored.transaction():
                        export(Database(restored), second, "restored-export", archive)
                    assert Package(second).data == package.data
            finally:
                os.environ["CONTENT_IMPORT_DSN"] = original_dsn
            passed(
                "export restores into an independently empty schema with identical content"
            )

            cases = [
                (
                    "bad-reference",
                    lambda p, m: modify(
                        p,
                        "modules",
                        lambda r: r[0]["topic_ids"].append("NO-SUCH-TOPIC"),
                    ),
                    "MISSING_REFERENCE",
                ),
                (
                    "duplicate-id",
                    lambda p, m: modify(p, "topics", lambda r: r.append(r[0])),
                    "DUPLICATE_ID",
                ),
                (
                    "duplicate-edge",
                    lambda p, m: modify(
                        p,
                        "modules",
                        lambda r: r[0]["topic_ids"].append(r[0]["topic_ids"][0]),
                    ),
                    "DUPLICATE_RELATION",
                ),
                (
                    "module-cycle",
                    lambda p, m: modify(
                        p,
                        "modules",
                        lambda r: r[0]["prerequisites"]["hard"].append("C-M01"),
                    ),
                    "PATH_PREREQUISITE_ORDER",
                ),
                (
                    "project-cycle",
                    lambda p, m: modify(
                        p,
                        "projects",
                        lambda r: r[0]["prerequisites"].append(r[0]["id"]),
                    ),
                    "PREREQUISITE_CYCLE",
                ),
                (
                    "unknown-version",
                    lambda p, m: m.update(schema_version="future-v999"),
                    "PACKAGE_SCHEMA",
                ),
                (
                    "traversal",
                    lambda p, m: m["files"].update({"../escape": "0" * 64}),
                    "PACKAGE_FILE_SET",
                ),
                (
                    "unreviewed",
                    lambda p, m: modify(
                        p,
                        "topics",
                        lambda r: r[0].update(
                            readiness="reviewed_lesson", reviewed_lesson="Not reviewed"
                        ),
                    ),
                    "CONTENT_SCHEMA",
                ),
            ]
            for name, edit, code in cases:
                candidate = changed(root, out, name, edit)
                before = counts()
                try:
                    run(candidate)
                except Invalid as e:
                    assert e.code == code, (name, e.code)
                else:
                    raise AssertionError(("accepted corruption", name))
                assert counts() == before
            passed(
                "malformed references duplicates cycles versions paths and readiness reject atomically"
            )
            duplicate = changed(root, out, "duplicate-json-key")
            f = duplicate / "package.json"
            text = f.read_text()
            f.write_text(
                text.replace(
                    '"schema_version":',
                    '"schema_version":"otr-import-v1", "schema_version":',
                    1,
                )
            )
            try:
                Package(duplicate)
            except Invalid as e:
                assert e.code == "DUPLICATE_JSON_KEY"
            else:
                raise AssertionError("duplicate JSON key accepted")
            passed("duplicate JSON keys rejected")
            sqlbad = changed(
                root,
                out,
                "database-constraint",
                lambda p, m: modify(
                    p, "exercises", lambda r: r[0].update(pass_score=101)
                ),
            )
            before = counts()
            try:
                run(sqlbad)
            except psycopg.errors.CheckViolation as e:
                assert e.sqlstate == "23514"
            else:
                raise AssertionError("invalid score reached commit")
            assert counts() == before
            passed("database constraint failure rolls back every proposed mutation")

            print("SEED_PRIVATE_ATTEMPT", flush=True)
            assert sys.stdin.readline().strip() == "PRIVATE_ATTEMPT_READY"
            retained_tables = [
                "quiz_attempt",
                "attempt_answer",
                "answer_choice",
                "attempt_result",
                "form_exposure",
                "enrollment",
                "enrollment_requirement",
            ]
            retained = {
                table: adb.all(f"select * from {table} order by 1,2")
                for table in retained_tables
            }
            assert (
                len(retained["quiz_attempt"]) == 1
                and len(retained["attempt_answer"]) == 10
            )
            revisions_before_update = counts()["catalog_revision"]
            # Synthetic learner data exists only in this disposable database.
            account = adb.insert(
                "account",
                dict(
                    public_id=uuid.uuid4(),
                    email="fixture@example.invalid",
                    email_key="fixture@example.invalid",
                    password_hash=os.environ["CONTENT_TEST_HASH"],
                    status="ACTIVE",
                    verified_at=adb.now,
                    auth_generation=0,
                    eligibility_attested_at=adb.now,
                    theme="system",
                ),
                "id",
            )
            target = adb.one(
                "select o.id,h.revision_id from catalog_object o join draft_head h on h.object_id=o.id where external_id='M01.01'"
            )
            adb.insert(
                "private_note",
                dict(
                    public_id=uuid.uuid4(),
                    account_id=account,
                    object_id=target["id"],
                    kind="TOPIC",
                    text="Synthetic owner note retained across content revisions.",
                ),
            )
            adb.insert(
                "learning_progress",
                dict(
                    account_id=account,
                    topic_object_id=target["id"],
                    topic_revision_id=target["revision_id"],
                    state="SELF_COMPLETED",
                    first_started_at=adb.now,
                    self_completed_at=adb.now,
                    last_confirmed_at=adb.now,
                ),
            )
            learner = adb.all("select * from private_note") + adb.all(
                "select * from learning_progress"
            )
            update = changed(
                root,
                out,
                "topic-update",
                lambda p, m: modify(
                    p,
                    "topics",
                    lambda r: r[0].update(title=r[0]["title"] + " — revised proposal"),
                ),
            )
            updated = run(update)
            assert updated["status"] == "APPLIED"
            assert counts()["catalog_revision"] == revisions_before_update + 1
            conflict = changed(
                root,
                out,
                "conflicting-topic",
                lambda p, m: modify(
                    p,
                    "topics",
                    lambda r: r[0].update(title="Conflicting concurrent proposal"),
                ),
            )
            before = counts()
            with c.transaction():
                assert plan(db, Package(conflict))[0]["status"] == "CONFLICTED"
            try:
                run(conflict)
            except Invalid as e:
                assert e.code == "CONTENT_VERSION_CONFLICT"
            else:
                raise AssertionError("conflict overwritten")
            assert counts() == before
            nochange = changed(root, out, "preserve-editor-update")
            run(nochange)
            assert adb.scalar(
                "select title from catalog_revision r join draft_head h on h.revision_id=r.id where h.object_id=%s",
                (target["id"],),
            ).endswith("revised proposal")
            passed(
                "safe update conflict and unchanged-base proposal preserve current edits"
            )
            fresh = root / "fresh"
            with c.transaction():
                export(Database(c), fresh, "fresh-bases", archive)
            retire = changed(
                root,
                fresh,
                "retire-topic",
                lambda p, m: m["retirements"].append("M01.01"),
            )
            retired = run(retire)
            assert (
                adb.scalar(
                    "select retired_at from catalog_object where id=%s", (target["id"],)
                )
                is not None
            )
            assert learner == adb.all("select * from private_note") + adb.all(
                "select * from learning_progress"
            )
            with c.transaction():
                recover(db, retired["batch_id"], True)
            assert (
                adb.scalar(
                    "select retired_at from catalog_object where id=%s", (target["id"],)
                )
                is None
            )
            with c.transaction():
                recover(db, updated["batch_id"], True)
            assert (
                adb.scalar(
                    "select revision_id from draft_head where object_id=%s",
                    (target["id"],),
                )
                == target["revision_id"]
            )
            assert learner == adb.all("select * from private_note") + adb.all(
                "select * from learning_progress"
            )
            passed(
                "retirement and content-version recovery preserve learner rows and old revisions"
            )
            latest = root / "latest"
            with c.transaction():
                export(Database(c), latest, "latest-export", archive)
            addition = changed(
                root,
                latest,
                "new-domain",
                lambda p, m: modify(
                    p,
                    "domains",
                    lambda r: r.append(
                        dict(id="D-IMPORT-TEST", title="Synthetic added domain")
                    ),
                ),
            )
            added = run(addition)
            assert (
                adb.scalar(
                    "select count(*) from catalog_object where external_id='D-IMPORT-TEST'"
                )
                == 1
            )
            absent = root / "with-added"
            with c.transaction():
                export(Database(c), absent, "with-added", archive)
            omission = changed(
                root,
                absent,
                "absent-is-preserved",
                lambda p, m: modify(p, "domains", lambda r: r.pop()),
            )
            with c.transaction():
                assert (
                    "D-IMPORT-TEST"
                    in plan(db, Package(omission))[0]["absent_preserved"]
                )
            run(omission)
            assert (
                adb.scalar(
                    "select retired_at from catalog_object where external_id='D-IMPORT-TEST'"
                )
                is None
            )
            with c.transaction():
                recover(db, added["batch_id"], True)
            assert (
                adb.scalar(
                    "select retired_at from catalog_object where external_id='D-IMPORT-TEST'"
                )
                is not None
            )
            assert learner == adb.all("select * from private_note") + adb.all(
                "select * from learning_progress"
            )
            passed(
                "addition absent-record preservation and new-object recovery retain identity"
            )

            try:
                c.execute("select text from private_note")
            except psycopg.errors.InsufficientPrivilege:
                pass
            else:
                raise AssertionError("importer can read learner data")
            assert retained == {
                table: adb.all(f"select * from {table} order by 1,2")
                for table in retained_tables
            }
            passed(
                "submitted attempt answers results exposure and enrollment unchanged across imports and recovery"
            )
            passed("import login cannot read learner records")
            report = dict(
                status="PASS",
                checks=results,
                seconds=round(time.monotonic() - start, 3),
                canonical_records=len(package.records),
                baseline_counts=baseline,
                postgres=adb.scalar("show server_version"),
                published=0,
            )
            dest = ROOT / "backend/target/p09-evidence"
            dest.mkdir(parents=True, exist_ok=True)
            (dest / "integration.json").write_text(json.dumps(report, indent=2) + "\n")


if __name__ == "__main__":
    main()
