#!/usr/bin/env python3
"""Compare only implemented DTO operations, not pretend the entire P05 API exists."""

import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
contract = json.loads((root / "docs/engineering/openapi/openapi.json").read_text())
generated = json.loads((root / "backend/target/generated-openapi.json").read_text())
public = {
    p
    for p, v in contract["paths"].items()
    if v.get("get", {}).get("security") == [] and p != "/auth/session"
}
identity = {
    p
    for p in contract["paths"]
    if p.startswith("/auth/")
    or p in {"/me", "/me/password", "/me/email-change"}
    or p.startswith("/me/webauthn/")
}
assert set(generated["paths"]) == {"/api/v1" + p for p in public | identity} | {
    "/api/health"
}, "Unexpected or missing implemented route"
for path in identity:
    for method, operation in contract["paths"][path].items():
        if method not in {"get", "post", "put", "delete"}:
            continue
        actual = generated["paths"]["/api/v1" + path][method]
        assert actual["operationId"] == operation["operationId"], (path, method)
        for status, response in operation["responses"].items():
            if not status.startswith("2") or "content" not in response:
                continue
            ref = response["content"]["application/json"]["schema"]["$ref"].split("/")[
                -1
            ]
            a = generated["components"]["schemas"][ref]
            e = contract["components"]["schemas"][ref]
            assert set(a["properties"]) == set(e["properties"]), ref
            assert set(a.get("required", [])) == set(e.get("required", [])), ref
            assert a.get("additionalProperties") is False, ref
for p in public:
    assert (
        generated["paths"]["/api/v1" + p]["get"]["operationId"]
        == contract["paths"][p]["get"]["operationId"]
    ), p
    ref = contract["paths"][p]["get"]["responses"]["200"]["content"][
        "application/json"
    ]["schema"]["$ref"].split("/")[-1]
    a = generated["components"]["schemas"][ref]
    e = contract["components"]["schemas"][ref]
    assert set(a["properties"]) == set(e["properties"]), ref
    assert set(a.get("required", [])) == set(e.get("required", [])), ref
    assert a.get("additionalProperties") is False, ref
actual = generated["paths"]["/api/v1/auth/csrf"]["get"]
expected = contract["paths"]["/auth/csrf"]["get"]
assert actual["operationId"] == expected["operationId"]
a = generated["components"]["schemas"]["Csrf"]
e = contract["components"]["schemas"]["Csrf"]
assert set(a["required"]) == set(e["required"])
assert set(a["properties"]) == set(e["properties"])
assert a["additionalProperties"] is False
assert a["properties"]["headerName"]["enum"] == [e["properties"]["headerName"]["const"]]
for key in ["type", "minLength", "maxLength"]:
    assert a["properties"]["token"][key] == e["properties"]["token"][key], key
print(
    f"PASS: {len(public)} generated public/CSRF operations and closed response DTOs plus P13 identity routes match their contracts; only implemented routes exist"
)
