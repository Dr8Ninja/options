"""Disposable PublicCatalogIT fixture: import the real canonical package through P09."""

import importlib.util
import tempfile
from pathlib import Path
from content_import.package import ROOT, Package
from content_import.store import connect, Database, apply

spec = importlib.util.spec_from_file_location(
    "import_cli", ROOT / "scripts/import-content.py"
)
cli = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cli)
with tempfile.TemporaryDirectory(prefix="p10-import-") as temporary:
    root = Path(temporary).resolve()
    cli.write_package(ROOT / "data/v1", root / "package", "public-api-test-only")
    with connect() as connection, connection.transaction():
        result = apply(
            Database(connection), Package(root / "package"), root / "archive"
        )
        assert result["status"] == "APPLIED"
print("PASS: P09 imported canonical content into disposable P10 PostgreSQL")
