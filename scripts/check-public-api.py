#!/usr/bin/env python3
"""Validate captured real HTTP responses against the normative P05/P10 contract."""

import json
import re
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker
from referencing import Registry, Resource

root = Path(__file__).resolve().parents[1]
spec = json.loads((root / "docs/engineering/openapi/openapi.json").read_text())
uri = "https://contract.options.invalid/openapi.json"
registry = Registry().with_resource(
    uri,
    Resource.from_contents(
        spec,
        default_specification=__import__(
            "referencing.jsonschema", fromlist=["DRAFT202012"]
        ).DRAFT202012,
    ),
)
captures = json.loads((root / "backend/target/p10-evidence/examples.json").read_text())
assert captures, "No actual responses captured"
for capture in captures:
    path = capture["path"].split("?", 1)[0]
    if capture["status"] == 200:
        template = next(
            (
                p
                for p in spec["paths"]
                if re.fullmatch(re.sub(r"\{[^}]+\}", "[^/]+", p), path)
            ),
            None,
        )
        assert template, path
        schema = spec["paths"][template]["get"]["responses"]["200"]["content"][
            "application/json"
        ]["schema"]
    else:
        schema = {"$ref": "#/components/schemas/Problem"}
    validator = Draft202012Validator(
        {"$ref": uri + schema["$ref"]},
        registry=registry,
        format_checker=FormatChecker(),
    )
    errors = list(validator.iter_errors(capture["body"]))
    assert not errors, (path, [str(e) for e in errors[:3]])
    assert capture["headers"]["cache-control"] == ["no-store"]
    assert "set-cookie" not in capture["headers"]
print(
    f"PASS: {len(captures)} real PostgreSQL-backed HTTP responses match OpenAPI schemas and no-store policy"
)
