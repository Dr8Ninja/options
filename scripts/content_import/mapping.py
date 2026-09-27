"""Explicit P04 mappings; no domain JSON/EAV storage or generated CRUD interface."""

from .package import digest, require

SECTIONS = {
    "programs": {"qualification": "qualification"},
    "modules": dict(
        why_it_matters="why_it_matters",
        objectives="objective",
        required_math="required_math",
        required_programming="required_programming",
        reading_assignments="reading_summary",
        practical_assignment="practical_assignment",
        common_mistakes="common_mistake",
        checkpoint_questions="checkpoint",
        mastery_criteria="mastery_criterion",
        remediation="remediation",
        lesson_authoring_owner="authoring_owner",
    ),
    "topics": dict(
        evidence_class_original="original_evidence_class",
        classification_code_original="original_classification",
    ),
    "subtopics": dict(granularity_note="granularity_note"),
    "competencies": dict(dependency_reason="dependency_reason"),
    "exercises": dict(critical_errors="critical_error"),
    "projects": dict(
        learning_objective="objective",
        data_plan="data_plan",
        steps="step",
        deliverables="deliverables",
        reference_behavior="reference",
        failure_cases="failure_case",
        limitations="limitations",
        noncoding_route="noncoding_route",
        critical_failure="critical_failure",
    ),
    "learning_paths": dict(
        audience="audience",
        entry_criteria="entry",
        exit_competencies="exit_statement",
        milestone_gates="milestone",
    ),
    "assessment_policies": dict(
        critical_errors="critical_error",
        states="state_label",
        evidence="evidence",
        retry="retry",
        calibration="calibration",
    ),
    "specializations": dict(
        original_module_scope="original_module_scope", depth="depth"
    ),
    "capstones": dict(original_brief="original_brief"),
}
LINKS = {
    "programs": dict(phase_ids="program_phase"),
    "phases": dict(module_ids="phase_module"),
    "modules": dict(
        domain_id="module_domain", competency_ids="outcome", topic_ids="module_topic"
    ),
    "competencies": dict(assessment_ids="assessment"),
    "topics": dict(subtopic_ids="topic_subtopic"),
    "subtopics": dict(competency_ids="outcome"),
    "resources": dict(
        topics_competencies="candidate_competency",
        free_alternative_ids="free_alternative",
        replacement_ids="replaces",
        supersedes_ids="supersedes_resource",
    ),
    "associations": dict(topic_ids="assignment_topic"),
    "exercises": dict(competency_ids="outcome"),
    "quiz_blueprints": dict(competency_ids="outcome"),
    "learning_paths": dict(
        module_sequence="path_module",
        target_modules="path_target",
        diagnostic_ids="path_diagnostic",
        exit_competency_ids="path_exit",
        assessment_gates="path_gate",
    ),
    "capstones": dict(
        project_ids="capability_project", assessment_policy="capstone_policy"
    ),
    "decision_cards": dict(required_in_capstones="decision_capstone"),
}
COMMON = dict(
    title="title",
    difficulty="difficulty",
    level="difficulty",
    priority="priority",
    readiness="readiness",
    scope_outline="scope_outline",
    scope="scope_outline",
    teaching_brief="teaching_brief",
    reviewed_lesson="lesson_markdown",
    teaching_brief_unknown_reason="unknown_brief_reason",
    estimate_basis="estimate_basis",
    time_basis="estimate_basis",
    status="source_status",
)
DETAILS = {
    "resources": (
        "resource_revision",
        dict(
            author_organization="author_organization",
            resource_type="resource_type",
            doi="doi",
            edition="edition",
            cost="cost",
            access_limitations="access_limitations",
            recommended_audience="recommended_audience",
            rationale="rationale",
            prerequisites="prerequisites_text",
            role="role",
            geography="geography",
            publication_date="publication_date_raw",
            updated_date="updated_date_raw",
            publication_status="publication_status",
            rights="rights",
            entitlement_status="entitlement_status",
            alternative_limit="alternative_limit",
            video_timestamp_reason="video_timestamp_reason",
        ),
    ),
    "associations": (
        "assignment_revision",
        dict(
            reading_scope="reading_scope",
            purpose="purpose",
            status="verification_state",
        ),
    ),
    "exercises": (
        "exercise_revision",
        dict(
            type="exercise_type",
            prompt="prompt",
            reference_behavior="reference_behavior",
            data="data_plan",
            deliverable="deliverable",
            pass_score="pass_score",
            tolerance="tolerance_text",
            fresh_variant="fresh_variant",
            noncoding_route="noncoding_route",
        ),
    ),
    "quiz_blueprints": (
        "blueprint_revision",
        dict(
            pass_score="pass_score",
            critical_error_policy="critical_error_policy",
            retries="retries",
        ),
    ),
    "projects": (
        "project_revision",
        dict(pass_score="pass_score", real_money_required="real_money_required"),
    ),
    "decision_cards": ("decision_revision", dict(question="question_text")),
    "assessment_policies": (
        "policy_revision",
        dict(version="policy_version", threshold="pass_score"),
    ),
    "market_rules": (
        "rule_revision",
        dict(
            value="value_text",
            unit="unit",
            effective_from="effective_from",
            effective_to="effective_to",
            unknown_date_reason="unknown_date_reason",
            scope="scope",
            uncertainty="uncertainty",
            review_status="review_status",
            review_owner="review_owner_label",
            review_interval_days="review_interval_days",
            publication_eligible="historical_eligible",
            publication_eligible_scope="historical_eligible_scope",
            current_operational_publication_eligible="imported_current_eligible",
        ),
    ),
    "archival_structures": (
        "archive_revision",
        dict(kind="archive_kind", markdown="markdown", disposition="disposition"),
    ),
}


def precision(value):
    if value is None:
        return "unknown"
    return {4: "year", 7: "month", 10: "day"}.get(len(value), "verbatim")


class Writer:
    def __init__(self, db, package, objects, actor, artifacts):
        self.db, self.p, self.objects, self.actor, self.artifacts = (
            db,
            package,
            objects,
            actor,
            artifacts,
        )
        self.notices = {}
        self.claims = {}

    def insert(self, table, values, returning=None):
        return self.db.insert(table, values, returning)

    def oid(self, key):
        return self.objects[key]["id"]

    def link(self, rid, kind, relation, targets):
        for i, target in enumerate(targets, 1):
            key, annotation = target if isinstance(target, tuple) else (target, None)
            self.insert(
                "catalog_link",
                dict(
                    owner_revision_id=rid,
                    owner_kind=kind,
                    relation=relation,
                    target_object_id=self.oid(key),
                    target_kind=self.objects[key]["kind"],
                    ordinal=i,
                    annotation=annotation,
                ),
            )

    def locator(self, url):
        require(url.startswith("https://") and len(url) <= 4000, "INVALID_SOURCE_URL")
        h = digest(url.encode())
        row = self.db.one(
            "select id,normalized_url from external_locator where url_hash=%s", (h,)
        )
        if row:
            require(row["normalized_url"] == url, "HASH_COLLISION")
            return row["id"]
        return self.insert(
            "external_locator",
            dict(
                original_url=url,
                normalized_url=url,
                normalization_version="exact-v1",
                url_hash=h,
            ),
            "id",
        )

    def anchor(self, path, pointer=None, line=None, label=None):
        require(path in self.artifacts, "UNKNOWN_SOURCE_PATH", path)
        h = self.db.scalar(
            "select encode(sha256(convert_to(jsonb_build_array(%s::text,%s::int,null::int,%s::text)::text,'UTF8')),'hex')",
            (pointer, line, label),
        )
        old = self.db.one(
            "select id from provenance_anchor where artifact_id=%s and locator_hash=%s",
            (self.artifacts[path], h),
        )
        return (
            old["id"]
            if old
            else self.insert(
                "provenance_anchor",
                dict(
                    artifact_id=self.artifacts[path],
                    json_pointer=pointer,
                    line_start=line,
                    locator_label=label,
                    locator_hash=h,
                ),
                "id",
            )
        )

    def provenance(self, r):
        v = r.get("original_provenance", r.get("provenance", {}))
        out = []
        if "source" in r:
            out.append(
                self.anchor(
                    r["source"],
                    line=r.get("line"),
                    label="source" if not r.get("line") else None,
                )
            )
        if v:
            if v.get("json_pointer"):
                out.append(
                    self.anchor(
                        v.get(
                            "source", "sources/roadmaps/options-curriculum-catalog.json"
                        ),
                        pointer=v["json_pointer"],
                    )
                )
            if v.get("master_line"):
                out.append(
                    self.anchor(
                        v.get(
                            "master_source",
                            "sources/roadmaps/options-master-knowledge-map.md",
                        ),
                        line=v["master_line"],
                    )
                )
            if v.get("line"):
                out.append(self.anchor(v["source"], line=v["line"]))
            if v.get("selector"):
                out.append(
                    self.anchor(
                        v.get(
                            "source", "sources/roadmaps/options-curriculum-catalog.json"
                        ),
                        label=v["selector"],
                    )
                )
            if not out:
                out.append(
                    self.anchor(
                        "data/v1/" + self.p.records[r["id"]][0] + ".json",
                        label=v.get("origin", "design origin"),
                    )
                )
        return list(dict.fromkeys(out))

    def edges(self, rid, kind, c, r):
        if c == "modules":
            groups = r["prerequisites"]
        elif c == "competencies":
            groups = dict(
                hard=r["hard_prerequisites"],
                recommended=r["recommended_preparation"],
                optional=r["optional_enrichment"],
            )
        elif c == "projects":
            groups = dict(hard=r["prerequisites"])
        else:
            return
        reasons = {x["requires"]: x for x in r.get("hard_edge_justifications", [])}
        for group, targets in groups.items():
            table = {
                "hard": "hard_prerequisite",
                "recommended": "recommended_preparation",
                "optional": "optional_enrichment",
            }[group]
            for i, target in enumerate(targets, 1):
                values = dict(
                    owner_revision_id=rid,
                    owner_kind=kind,
                    ordinal=i,
                    rationale=r.get(
                        "dependency_reason",
                        "Explicit canonical prerequisite; preserve source intent.",
                    ),
                )
                prefix = "target" if group == "optional" else "requires"
                values[prefix + "_object_id"] = self.oid(target)
                values[prefix + "_kind"] = self.objects[target]["kind"]
                if group == "hard" and target in reasons:
                    values.update(
                        supplied_skill=reasons[target]["supplied_skill"],
                        consumed_skill=reasons[target]["consumed_by"],
                    )
                self.insert(table, values)

    def notice(self, identifier, url=None, published=None):
        # Identity scopes unknown authority explicitly; never attributes a newer URL to an old notice.
        body = "source-declared; authority not independently verified"
        old = self.db.one(
            "select * from official_notice where issuing_body=%s and identifier=%s order by revision_no desc limit 1",
            (body, identifier),
        )
        loc = self.locator(url) if url else None
        if (
            old
            and old["locator_id"] == loc
            and (
                old["publication_date_raw"]
                or (str(old["publication_date"]) if old["publication_date"] else None)
            )
            == published
        ):
            return old["id"]
        return self.insert(
            "official_notice",
            dict(
                identifier=identifier,
                issuing_body=body,
                revision_no=(old["revision_no"] + 1 if old else 1),
                locator_id=loc,
                publication_date=published if precision(published) == "day" else None,
                publication_date_raw=published,
                publication_precision=precision(published),
                unknown_date_reason=None
                if precision(published) == "day"
                else "Exact publication day not established; retain source precision.",
                unknown_locator_reason=None
                if loc
                else "Only the exact notice identifier is known.",
            ),
            "id",
        )

    def details(self, c, r, rid, kind):
        if c in DETAILS:
            table, fields = DETAILS[c]
            v = {column: r[key] for key, column in fields.items() if key in r}
            v.update(revision_id=rid, kind=kind)
            if c in ["exercises", "quiz_blueprints"]:
                v["module_object_id"] = self.oid(r["module_id"])
            if c == "resources":
                v.update(
                    canonical_locator_id=self.locator(r["canonical_url"]),
                    publication_precision=precision(r["publication_date"]),
                    updated_precision=precision(r["updated_date"]),
                )
                self.insert(
                    "resource_locator",
                    dict(
                        resource_revision_id=rid,
                        locator_id=v["canonical_locator_id"],
                        role="canonical",
                        ordinal=1,
                    ),
                )
                for field, reason in r["unknowns"].items():
                    self.insert(
                        "resource_unknown",
                        dict(
                            resource_revision_id=rid,
                            field="DOI" if field == "doi" else field,
                            reason=reason,
                        ),
                    )
                if r["doi"]:
                    old = self.db.one(
                        "select resource_object_id from resource_identifier where scheme='DOI' and normalized_value=%s",
                        (r["doi"].lower(),),
                    )
                    require(
                        not old or old["resource_object_id"] == self.oid(r["id"]),
                        "RESOURCE_IDENTITY_CONFLICT",
                    )
                    if not old:
                        self.insert(
                            "resource_identifier",
                            dict(
                                resource_object_id=self.oid(r["id"]),
                                scheme="DOI",
                                normalized_value=r["doi"].lower(),
                            ),
                        )
                require(r["video_timestamps"] is None, "UNSUPPORTED_VIDEO_SCHEMA")
            if c == "associations":
                v.update(
                    resource_object_id=self.oid(r["resource_id"]),
                    competency_object_id=self.oid(r["competency_id"]),
                )
            if c == "market_rules":
                value = r["value"]
                if value is None:
                    v.update(
                        value_type="UNKNOWN",
                        value_text="Unknown; see recorded uncertainty.",
                    )
                elif isinstance(value, (int, float)):
                    v.update(
                        value_type="NUMBER", value_numeric=value, value_text=str(value)
                    )
                elif isinstance(value, dict):
                    require(
                        set(value) == {"sale_rate", "exercise_rate"},
                        "UNKNOWN_RULE_VALUE_SHAPE",
                    )
                    v.update(
                        value_type="RATE_PAIR",
                        sale_rate=value["sale_rate"],
                        exercise_rate=value["exercise_rate"],
                        value_text="Sale and exercise rates; see typed values and source units.",
                    )
                else:
                    v["value_type"] = "TEXT"
                subject = self.db.one(
                    "select id from rule_subject where jurisdiction=%s and instrument_key=%s and rule_type=%s and scope_hash=%s",
                    (
                        r["jurisdiction"],
                        digest(r["instrument"].encode()),
                        r["rule_type"],
                        digest(r["scope"].encode()),
                    ),
                )
                v["subject_id"] = (
                    subject["id"]
                    if subject
                    else self.insert(
                        "rule_subject",
                        dict(
                            jurisdiction=r["jurisdiction"],
                            instrument=r["instrument"],
                            instrument_key=digest(r["instrument"].encode()),
                            product_scope=r["scope"],
                            unknown_zone_reason="Canonical design does not establish an operational market timezone.",
                            rule_type=r["rule_type"],
                            scope_hash=digest(r["scope"].encode()),
                        ),
                        "id",
                    )
                )
                v.update(
                    notice_id=self.notice(
                        r["circular_identifier"], r["source_url"], r["publication_date"]
                    ),
                    date_precision="day" if r["effective_from"] else "unknown",
                )
                for key, direction in [("supersedes", True), ("superseded_by", False)]:
                    for name in r[key]:
                        other = self.notice(name)
                        a, b = (
                            (other, v["notice_id"])
                            if direction
                            else (v["notice_id"], other)
                        )
                        self.db.execute(
                            "insert into notice_supersession(older_notice_id,newer_notice_id,scope,recorded_on) values (%s,%s,%s,%s) on conflict do nothing",
                            (a, b, r["scope"], r["verification_date"]),
                        )
            if c == "archival_structures":
                v["artifact_id"] = (
                    self.artifacts["data/v1/archival_structures.json"]
                    if "original" in r
                    else self.artifacts[r["source"]]
                )
                if "original" in r:
                    v["original_pointer"] = (
                        "/records/" + str(self.p.records[r["id"]][2] - 1) + "/original"
                    )
            self.insert(table, v)
        if c == "competencies":
            self.insert(
                "competency_revision",
                dict(
                    revision_id=rid,
                    kind=kind,
                    module_object_id=self.oid(r["module_id"]),
                    outcome=r["outcome"],
                    diagnostic_prompt=r["diagnostic"]["prompt"],
                    diagnostic_bridge_id=self.oid(r["diagnostic"]["bridge"]),
                    diagnostic_pass=r["diagnostic"]["pass"],
                ),
            )
        if c == "learning_paths":
            self.insert(
                "path_revision",
                dict(revision_id=rid, kind=kind, path_type="persona_path"),
            )
        for i, (code, weight) in enumerate(r.get("rubric", {}).items(), 1):
            self.insert(
                "rubric_criterion",
                dict(
                    owner_revision_id=rid,
                    code=code,
                    ordinal=i,
                    weight=weight,
                    description=code,
                ),
            )
        if c == "quiz_blueprints":
            for i, item in enumerate(r["items"], 1):
                self.insert(
                    "blueprint_item",
                    dict(
                        blueprint_revision_id=rid,
                        ordinal=i,
                        item_kind=item["kind"],
                        question_text=item.get("question"),
                        exercise_object_id=self.oid(item["exercise_id"])
                        if "exercise_id" in item
                        else None,
                        weight=item["weight"],
                    ),
                )
        if c == "associations":
            for claim in r["evidence_claim_ids"]:
                self.insert(
                    "assignment_claim",
                    dict(assignment_revision_id=rid, claim_id=self.claims[claim]),
                )
        if c in ["resources", "market_rules"]:
            self.insert(
                "verification_event",
                dict(
                    subject_revision_id=rid,
                    checked_at=self.db.now,
                    checked_on=r[
                        "last_verification_date"
                        if c == "resources"
                        else "verification_date"
                    ],
                    reviewer_actor_id=self.actor,
                    scope=r["verification_scope" if c == "resources" else "scope"],
                    method="selected_sections"
                    if c == "resources" and r["status"] == "selected_sections_reviewed"
                    else ("bibliography" if c == "resources" else "rule_chain"),
                    outcome=r["status" if c == "resources" else "review_status"],
                    uncertainty=r[
                        "access_limitations" if c == "resources" else "uncertainty"
                    ],
                ),
            )

    def write(self, c, r, rid, kind):
        for key, section in SECTIONS.get(c, {}).items():
            if r[key] is None:
                continue
            values = r[key] if isinstance(r[key], list) else [r[key]]
            for i, body in enumerate(values, 1):
                self.insert(
                    "revision_section",
                    dict(
                        revision_id=rid,
                        owner_kind=kind,
                        section=section,
                        ordinal=i,
                        body=body,
                    ),
                )
        for key, relation in LINKS.get(c, {}).items():
            self.link(
                rid, kind, relation, r[key] if isinstance(r[key], list) else [r[key]]
            )
        if c == "modules":
            self.link(rid, kind, "assessment", r["exercise_ids"] + [r["quiz_id"]])
        if c == "learning_paths":
            self.link(
                rid,
                kind,
                "path_branch",
                [(v["module_id"], v["rule"]) for v in r["branches"]],
            )
        for slug in dict.fromkeys(r.get("tags", [])):
            tag = self.db.one("select id from tag where slug=%s", (slug,))
            tid = (
                tag["id"]
                if tag
                else self.insert("tag", dict(slug=slug, label=slug), "id")
            )
            self.insert("revision_tag", dict(revision_id=rid, tag_id=tid))
        for i, anchor in enumerate(self.provenance(r), 1):
            self.insert(
                "revision_provenance",
                dict(
                    revision_id=rid,
                    anchor_id=anchor,
                    role="canonical_source",
                    ordinal=i,
                ),
            )
        self.edges(rid, kind, c, r)
        self.details(c, r, rid, kind)
