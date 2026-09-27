#!/usr/bin/env python3
"""Operator-only canonical import. Credentials come only from CONTENT_IMPORT_DSN."""

import argparse
import json
import os
import sys
from pathlib import Path
from content_import.package import (
    ROOT,
    COLLECTIONS,
    Package,
    Invalid,
    require,
    digest,
    source_paths,
)


def write_package(source, output, package_id, bases=None, generation=0):
    output = Path(output)
    require(not output.exists() and not output.is_symlink(), "OUTPUT_EXISTS")
    for p in [output.parent, *output.parents]:
        require(not p.is_symlink(), "UNSAFE_OUTPUT_PATH")
    output.mkdir(parents=True, mode=0o700)
    files = {}
    for name in (
        ["data/v1/" + c + ".json" for c in COLLECTIONS]
        + ["data/v1/manifest.json"]
        + source_paths()
    ):
        src = (
            Path(source) / Path(name).name
            if name.startswith("data/v1/")
            else ROOT / name
        )
        require(not src.is_symlink() and src.is_file(), "UNSAFE_SOURCE_FILE")
        raw = src.read_bytes()
        target = output / name
        target.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        target.write_bytes(raw)
        files[name] = digest(raw)
    manifest = dict(
        schema_version="otr-import-v1",
        package_id=package_id,
        base_publication_generation=generation,
        bases=bases or {},
        retirements=[],
        files=files,
    )
    (output / "package.json").write_text(json.dumps(manifest, indent=2) + "\n")
    return {"status": "PREPARED", "package_id": package_id, "files": len(files)}


def main():
    os.umask(0o077)
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "command",
        choices=["prepare", "validate", "dry-run", "apply", "export", "recover"],
    )
    parser.add_argument("--package")
    parser.add_argument("--source", default=str(ROOT / "data/v1"))
    parser.add_argument("--output")
    parser.add_argument("--package-id")
    parser.add_argument("--report")
    parser.add_argument("--archive", default=str(ROOT / ".local/content-archive"))
    parser.add_argument("--batch", type=int)
    parser.add_argument("--confirm-recovery", action="store_true")
    args = parser.parse_args()
    if args.report:
        target = Path(args.report)
        require(not target.exists() and not target.is_symlink(), "REPORT_EXISTS")
        for parent in target.parents:
            require(not parent.is_symlink(), "UNSAFE_REPORT_PATH")
    package = (
        Package(args.package)
        if args.command in ["validate", "dry-run", "apply"]
        else None
    )
    if args.command == "prepare":
        require(args.output and args.package_id, "MISSING_PREPARE_ARGUMENTS")
        result = write_package(args.source, args.output, args.package_id)
    elif args.command == "validate":
        p = package
        result = dict(
            status="VALID",
            package_id=p.manifest["package_id"],
            records=len(p.records),
            manifest_sha256=p.hash,
        )
    else:
        from content_import.store import connect, Database, plan, apply

        with connect() as connection:
            with connection.transaction():
                db = Database(connection)
                db.execute("set local statement_timeout='30s'")
                db.execute("set local lock_timeout='1s'")
                if args.command in ["dry-run", "apply"]:
                    p = package
                    if args.command == "dry-run":
                        db.execute("set transaction read only")
                        result = plan(db, p)[0]
                    else:
                        result = apply(db, p, args.archive)
                else:
                    from content_import.export import export, recover

                    if args.command == "export":
                        result = export(db, args.output, args.package_id, args.archive)
                    else:
                        result = recover(db, args.batch, args.confirm_recovery)
    text = json.dumps(result, indent=2, default=str) + "\n"
    require(len(text.encode()) <= 2 * 1024 * 1024, "REPORT_TOO_LARGE")
    if args.report:
        target = Path(args.report)
        require(not target.exists() and not target.is_symlink(), "REPORT_EXISTS")
        target.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        with target.open("x") as f:
            f.write(text)
    print(text)
    return 2 if result.get("status") == "CONFLICTED" else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Invalid as e:
        print(
            json.dumps({"status": "REJECTED", "code": e.code, "pointer": e.pointer}),
            file=sys.stderr,
        )
        sys.exit(2)
    except Exception as e:
        import psycopg

        if isinstance(e, psycopg.Error):
            print(
                json.dumps(
                    {
                        "status": "REJECTED",
                        "code": "DATABASE_REJECTED",
                        "sqlstate": e.sqlstate,
                        "constraint": e.diag.constraint_name,
                    }
                ),
                file=sys.stderr,
            )
        else:
            print(
                json.dumps(
                    {
                        "status": "REJECTED",
                        "code": "OPERATOR_IO_OR_CONFIGURATION",
                        "type": type(e).__name__,
                    }
                ),
                file=sys.stderr,
            )
        sys.exit(2)
