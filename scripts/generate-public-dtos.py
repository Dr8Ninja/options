#!/usr/bin/env python3
"""Generate the closed public wire records from the normative contract, never ORM entities."""

import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
schemas = json.loads((root / "docs/engineering/openapi/openapi.json").read_text())[
    "components"
]["schemas"]
names = [
    "RuleNotice",
    "ContentVersion",
    "Hours",
    "Reference",
    "Prerequisite",
    "Assignment",
    "Freshness",
    "Card",
    "CatalogPage",
    "Program",
    "Phase",
    "Module",
    "Topic",
    "Subtopic",
    "Resource",
    "Path",
    "Project",
    "ProjectField",
    "Capstone",
    "Exercise",
    "Quiz",
    "SearchHit",
    "SearchPage",
    "Facet",
    "DiscoveryFacets",
    "RouteResolution",
]


def typ(s):
    if "$ref" in s:
        return s["$ref"].split("/")[-1]
    if "anyOf" in s:
        return typ(next(x for x in s["anyOf"] if x.get("type") != "null"))
    if "const" in s:
        return "String"
    t = s.get("type")
    if t == "array":
        return "List<" + typ(s["items"]) + ">"
    return {
        "string": "String",
        "number": "BigDecimal",
        "integer": "Integer",
        "boolean": "Boolean",
    }[t]


text = """package org.options.platform.catalog.api;

import java.math.BigDecimal;
import java.util.List;

/** Closed P05 public DTOs. Regenerate with scripts/generate-public-dtos.py, then format. */
public final class PublicDtos {
  private PublicDtos() {}
"""
for name in names:
    text += (
        "  @io.swagger.v3.oas.annotations.media.Schema(additionalProperties=io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)\n  public record "
        + name
        + "("
        + ", ".join(
            (
                "@io.swagger.v3.oas.annotations.media.Schema(requiredMode=io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED) "
                if k in schemas[name].get("required", [])
                else ""
            )
            + (
                "@com.fasterxml.jackson.annotation.JsonInclude(com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL) "
                if name == "Reference" and k == "ordinal"
                else ""
            )
            + typ(v)
            + " "
            + k
            for k, v in schemas[name]["properties"].items()
        )
        + ") {}\n"
    )
text += "}\n"
(
    root / "backend/src/main/java/org/options/platform/catalog/api/PublicDtos.java"
).write_text(text)
