"""Bounded, offline, duplicate-key rejecting package input."""

import hashlib
import json
import re
from datetime import date
from decimal import Decimal
from pathlib import Path
import jsonschema

ROOT = Path(__file__).resolve().parents[2]
MAPPING = json.loads(
    (ROOT / "docs/engineering/database/canonical-mapping.json").read_text()
)
COLLECTIONS = {Path(c["file"]).stem: c for c in MAPPING["collections"]}
MAX_BYTES = 100 * 1024 * 1024


class Invalid(ValueError):
    def __init__(self, code, pointer=""):
        super().__init__(code + (": " + pointer if pointer else ""))
        self.code, self.pointer = code, pointer


def require(ok, code, pointer=""):
    if not ok:
        raise Invalid(code, pointer)


def digest(value):
    if not isinstance(value, bytes):
        value = canonical(value)
    return hashlib.sha256(value).hexdigest()


def canonical(value):
    return json.dumps(
        value,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
        allow_nan=False,
    ).encode()


def pairs(values):
    out = {}
    for key, value in values:
        require(key not in out, "DUPLICATE_JSON_KEY")
        out[key] = value
    return out


def decode(raw):
    try:
        return json.loads(
            raw,
            object_pairs_hook=pairs,
            parse_constant=lambda _: (_ for _ in ()).throw(Invalid("NONFINITE_NUMBER")),
        )
    except (UnicodeError, json.JSONDecodeError, RecursionError):
        raise Invalid("MALFORMED_JSON") from None


def read(root, relative):
    p = Path(relative)
    require(
        not p.is_absolute()
        and ".." not in p.parts
        and "\\" not in relative
        and p.as_posix() == relative,
        "UNSAFE_PATH",
    )
    at = root
    for part in p.parts:
        at = at / part
        require(not at.is_symlink(), "SYMLINK_REJECTED")
    require(
        at.is_file() and at.stat().st_size <= MAX_BYTES,
        "MISSING_OR_OVERSIZED_FILE",
        relative,
    )
    return at.read_bytes()


def source_paths():
    return sorted(
        {
            str(p.relative_to(ROOT))
            for folder in ["sources/roadmaps", "research/inventory"]
            for p in (ROOT / folder).glob("*")
            if p.is_file()
        }
        | {"research/registers/claims.json"}
    )


class Package:
    def __init__(self, root):
        root = Path(root)
        require(not root.is_symlink() and root.is_dir(), "INVALID_PACKAGE_DIRECTORY")
        self.root = root.resolve()
        raw = read(self.root, "package.json")
        self.manifest = decode(raw)
        schema = json.loads(
            (ROOT / "data/schemas/import-package.schema.json").read_text()
        )
        try:
            jsonschema.Draft202012Validator(schema).validate(self.manifest)
        except jsonschema.ValidationError as e:
            raise Invalid(
                "PACKAGE_SCHEMA", "/" + "/".join(map(str, e.absolute_path))
            ) from None
        self.hash = digest(self.manifest)
        m = self.manifest
        self.files = {}
        self.data = {}
        total = len(raw)
        allowed = (
            {"data/v1/" + n + ".json" for n in COLLECTIONS}
            | {"data/v1/manifest.json"}
            | set(source_paths())
        )
        require(set(m["files"]) == allowed, "PACKAGE_FILE_SET")
        for name, sha in m["files"].items():
            content = read(self.root, name)
            total += len(content)
            require(total <= MAX_BYTES, "PACKAGE_TOO_LARGE")
            require(digest(content) == sha, "FILE_HASH_MISMATCH", name)
            self.files[name] = content
            if name.startswith("data/v1/"):
                value = decode(content)
                schema = json.loads(
                    (
                        ROOT
                        / "data/schemas"
                        / Path(name).name.replace(".json", ".schema.json")
                    ).read_text()
                )
                try:
                    jsonschema.Draft202012Validator(schema).validate(value)
                except jsonschema.ValidationError as e:
                    raise Invalid(
                        "CONTENT_SCHEMA",
                        name + "/" + "/".join(map(str, e.absolute_path)),
                    ) from None
                self.data[Path(name).stem] = value
        require(
            self.data["manifest"]["version"] == "1.0.0-design",
            "UNKNOWN_CONTENT_VERSION",
        )
        preserved = json.loads(
            (ROOT / "docs/engineering/evidence/p07/preserved-sha256.json").read_text()
        )
        for name in source_paths():
            if name.startswith("sources/roadmaps/"):
                require(
                    digest(self.files[name]) == preserved[name],
                    "ORIGINAL_SOURCE_CHANGED",
                    name,
                )
        for entry in self.data["manifest"]["source_hashes"]:
            require(
                entry["path"] in self.files
                and digest(self.files[entry["path"]]) == entry["sha256"],
                "SOURCE_HASH_MISMATCH",
            )
        self.records = {}
        for collection in COLLECTIONS:
            envelope = self.data[collection]
            require(
                envelope.get("version") == "1.0.0-design",
                "UNKNOWN_CONTENT_VERSION",
                collection,
            )
            for i, row in enumerate(envelope["records"]):
                pointer = f"{collection}/records/{i}"
                require(
                    re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_.:-]{0,159}", row["id"])
                    is not None,
                    "INVALID_ID",
                    pointer,
                )
                require(row["id"] not in self.records, "DUPLICATE_ID", pointer)
                require(len(canonical(row)) <= 1024 * 1024, "RECORD_TOO_LARGE", pointer)
                self.records[row["id"]] = (collection, row, i + 1)
                self.safe_text(row, pointer)
        require(set(m["retirements"]) <= set(self.records), "UNKNOWN_RETIREMENT")
        for collection, count in self.data["manifest"]["counts"].items():
            require(
                collection in self.data
                and len(self.data[collection]["records"]) == count,
                "COUNT_MISMATCH",
                collection,
            )
        self.validate_relations()

    def safe_text(self, value, pointer):
        if isinstance(value, dict):
            for k, v in value.items():
                self.safe_text(v, pointer + "/" + k)
        elif isinstance(value, list):
            for v in value:
                self.safe_text(v, pointer)
        elif isinstance(value, str):
            require(
                "\x00" not in value
                and not re.search(
                    r"<\s*(script|iframe|object|embed)\b|javascript\s*:|data\s*:\s*text/html",
                    value,
                    re.I,
                ),
                "UNSAFE_MARKUP",
                pointer,
            )

    def validate_relations(self):
        from .mapping import LINKS

        def refs(values, kind=None):
            require(len(values) == len(set(values)), "DUPLICATE_RELATION")
            for value in values:
                require(value in self.records, "MISSING_REFERENCE", str(value))
                if kind:
                    require(
                        self.records[value][0] == kind,
                        "WRONG_REFERENCE_KIND",
                        str(value),
                    )

        slugs = set()
        assignments = set()

        def day(value, partial=False):
            if value is None:
                return
            try:
                text = (
                    value + "-01-01"
                    if partial and len(value) == 4
                    else value + "-01"
                    if partial and len(value) == 7
                    else value
                )
                date.fromisoformat(text)
            except (ValueError, TypeError):
                raise Invalid("INVALID_DATE") from None

        for key, (collection, r, _) in self.records.items():
            for field, rel in LINKS.get(collection, {}).items():
                values = r[field]
                values = values if isinstance(values, list) else [values]
                refs(values)
            if collection == "modules":
                require(r["slug"] not in slugs, "DUPLICATE_SLUG", key)
                slugs.add(r["slug"])
                refs(r["exercise_ids"], "exercises")
                refs([r["quiz_id"]], "quiz_blueprints")
                refs([r["phase_id"]], "phases")
                refs([r["program_id"]], "programs")
                require(
                    key in self.records[r["phase_id"]][1]["module_ids"]
                    and r["phase_id"] in self.records[r["program_id"]][1]["phase_ids"],
                    "HIERARCHY_MISMATCH",
                    key,
                )
                require(
                    re.fullmatch("[a-z0-9]+(?:-[a-z0-9]+)*", r["slug"])
                    and len(r["slug"]) <= 160,
                    "INVALID_SLUG",
                    key,
                )
                for target in r["topic_ids"]:
                    require(
                        self.records[target][1]["module_id"] == key,
                        "HIERARCHY_MISMATCH",
                        key,
                    )
                for values in r["prerequisites"].values():
                    refs(values, "competencies")
            if collection == "topics":
                refs([r["module_id"]], "modules")
                require(
                    r["reviewed_lesson"] is None
                    and r["readiness"] != "reviewed_lesson",
                    "UNREVIEWED_PUBLICATION",
                    key,
                )
                for target in r["subtopic_ids"]:
                    require(
                        self.records[target][1]["topic_id"] == key,
                        "HIERARCHY_MISMATCH",
                        key,
                    )
            if collection == "subtopics":
                refs([r["topic_id"]], "topics")
            if collection == "competencies":
                refs([r["module_id"]], "modules")
                refs([r["diagnostic"]["bridge"]], "modules")
                for field in [
                    "hard_prerequisites",
                    "recommended_preparation",
                    "optional_enrichment",
                ]:
                    refs(r[field], "competencies")
                require(
                    [v["requires"] for v in r["hard_edge_justifications"]]
                    == r["hard_prerequisites"],
                    "EDGE_JUSTIFICATION_MISMATCH",
                    key,
                )
            if collection in ["exercises", "quiz_blueprints"]:
                refs([r["module_id"]], "modules")
            if collection in ["exercises", "projects"]:
                require(sum(r["rubric"].values()) == 100, "RUBRIC_TOTAL", key)
            if collection == "projects":
                refs(r["prerequisites"])
            if collection == "associations":
                semantic = (
                    r["resource_id"],
                    r["competency_id"],
                    r["reading_scope"].strip(),
                    r["purpose"].strip(),
                )
                require(semantic not in assignments, "DUPLICATE_ASSIGNMENT", key)
                assignments.add(semantic)
                refs([r["resource_id"]], "resources")
                refs([r["competency_id"]], "competencies")
                claims = {
                    c["id"]
                    for c in decode(self.files["research/registers/claims.json"])[
                        "records"
                    ]
                }
                require(set(r["evidence_claim_ids"]) <= claims, "MISSING_CLAIM", key)
            if collection == "quiz_blueprints":
                require(
                    sum(v["weight"] for v in r["items"]) == 100, "BLUEPRINT_TOTAL", key
                )
                for v in r["items"]:
                    if "exercise_id" in v:
                        refs([v["exercise_id"]], "exercises")
            if collection == "learning_paths":
                earlier = set()
                for mid in r["module_sequence"]:
                    require(
                        mid in self.records and self.records[mid][0] == "modules",
                        "WRONG_REFERENCE_KIND",
                        key,
                    )
                    needs = self.records[mid][1]["prerequisites"]["hard"]
                    require(
                        all(self.records[x][1]["module_id"] in earlier for x in needs),
                        "PATH_PREREQUISITE_ORDER",
                        key,
                    )
                    earlier.add(mid)
                refs([v["module_id"] for v in r["branches"]], "modules")
            if collection == "source_mappings":
                refs(r["canonical_ids"])
            if collection == "authoring_queue":
                refs([r["topic_id"]], "topics")
            if collection == "market_rules":
                require(
                    r["current_operational_publication_eligible"] is False,
                    "CURRENT_RULE_CERTIFICATION_FORBIDDEN",
                    key,
                )
                value = r["value"]
                numbers = (
                    list(value.values())
                    if isinstance(value, dict)
                    else [value]
                    if isinstance(value, (int, float))
                    else []
                )
                for number in numbers:
                    n = Decimal(str(number))
                    require(
                        n.is_finite()
                        and abs(n) < 10**12
                        and n == n.quantize(Decimal("0.000001")),
                        "RULE_NUMBER_PRECISION",
                        key,
                    )
                day(r["publication_date"], True)
                day(r["effective_from"])
                day(r["effective_to"])
                day(r["verification_date"])
            if collection == "resources":
                day(r["last_verification_date"])
        # Validate both prerequisite classes together; module/competency contraction is also checked by PostgreSQL.
        graph = {key: [] for key in self.records}
        for key, (c, r, _) in self.records.items():
            if c == "competencies":
                graph[key] = r["hard_prerequisites"] + r["recommended_preparation"]
            elif c == "modules":
                graph[key] = (
                    r["prerequisites"]["hard"] + r["prerequisites"]["recommended"]
                )
            elif c == "projects":
                graph[key] = r["prerequisites"]

        def node(key):
            collection, row, _ = self.records[key]
            return row["module_id"] if collection == "competencies" else key

        contracted = {node(key): set() for key in graph}
        for key, targets in graph.items():
            contracted[node(key)].update(node(target) for target in targets)
        graph = contracted
        active = set()
        done = set()

        def visit(n):
            require(n not in active, "PREREQUISITE_CYCLE", n)
            if n in done:
                return
            active.add(n)
            for target in graph[n]:
                visit(target)
            active.remove(n)
            done.add(n)

        for n in graph:
            visit(n)
