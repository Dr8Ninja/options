#!/usr/bin/env python3
"""Validate actual P13 HTTP responses, never a mocked identity gate."""

import json
import re
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker
from referencing import Registry, Resource
from referencing.jsonschema import DRAFT202012

root = Path(__file__).resolve().parents[1]
spec = json.loads((root / "docs/engineering/openapi/openapi.json").read_text())
uri = "https://contract.options.invalid/openapi.json"
registry = Registry().with_resource(
    uri, Resource.from_contents(spec, default_specification=DRAFT202012)
)
captures = json.loads((root / "backend/target/p13-evidence/examples.json").read_text())
assert len(captures) > 30, "Missing actual identity responses"
browser = root / ".local/p13-runtime/responses.json"
if browser.is_file():
    captures += json.loads(browser.read_text())
for capture in captures:
    if capture["status"] >= 400:
        schema = {"$ref": "#/components/schemas/Problem"}
    else:
        template = next(
            p
            for p in spec["paths"]
            if re.fullmatch(re.sub(r"\{[^}]+\}", "[^/]+", p), capture["path"])
        )
        schema = spec["paths"][template][capture["method"]]["responses"][
            str(capture["status"])
        ]["content"]["application/json"]["schema"]
    Draft202012Validator(
        {"$ref": uri + schema["$ref"]},
        registry=registry,
        format_checker=FormatChecker(),
    ).validate(capture["body"])
    assert capture["cacheControl"] == "no-store"
print(
    f"PASS: {len(captures)} actual identity responses conform to OpenAPI and no-store policy"
)
