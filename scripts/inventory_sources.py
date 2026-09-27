#!/usr/bin/env python3
"""Reproduce the Phase 1 inventory; never modify the three supplied sources.

Standard library only. Run from any directory. --check validates the sources
and compares every generated artifact without writing files.
"""
import argparse
from collections import Counter, defaultdict
import hashlib
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'research' / 'inventory'
SOURCE_NAMES = (
    'sources/roadmaps/options-learning-roadmap.md',
    'sources/roadmaps/options-master-knowledge-map.md',
    'sources/roadmaps/options-curriculum-catalog.json',
)
DIFFICULTY = dict(B='Beginner', I='Intermediate', A='Advanced', Q='Professional/Quantitative')
IMPORTANCE = dict(E='Essential', V='Very Important', U='Useful', S='Specialized')
EVIDENCE = {
    'T': 'Established definition or conditional theory',
    'R': 'Rules and contract specifications; verify current version',
    'E': 'Empirical research; scope and replication matter',
    'H': 'Practitioner method; edge must be validated',
    'F': 'Unverified or overstated claim; study critically',
}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        require(key not in result, f'Duplicate JSON object key: {key}')
        result[key] = value
    return result


def clean(text):
    return '\n'.join(line.rstrip() for line in text.splitlines()).strip()


def section(text, start, end=None):
    a = text.index(start)
    b = text.index(end, a + len(start)) if end else len(text)
    return text[a:b].strip()


def line_at(text, needle):
    return text[:text.index(needle)].count('\n') + 1


def md_row(*values):
    return '| ' + ' | '.join(str(v).replace('|', '\\|').replace('\n', ' ') for v in values) + ' |'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    texts = {name: (ROOT / name).read_text(encoding='utf-8') for name in SOURCE_NAMES}
    catalog = json.loads(texts[SOURCE_NAMES[2]], object_pairs_hook=unique_object)
    master, roadmap = texts[SOURCE_NAMES[1]], texts[SOURCE_NAMES[0]]
    modules, resources = catalog['modules'], catalog['resources']
    topics = [t for m in modules for t in m['topics']]
    require(set(catalog) == {'title', 'version', 'research_date', 'scope_note', 'topic_count',
                            'modules', 'resources', 'assessments', 'stages'}, 'Root schema changed')
    require(catalog['topic_count'] == len(topics), 'Declared topic count differs')
    module_ids, topic_ids, resource_ids = ([x['id'] for x in items] for items in (modules, topics, resources))
    for label, ids in [('module', module_ids), ('topic', topic_ids), ('resource', resource_ids)]:
        require(len(ids) == len(set(ids)), f'Duplicate {label} IDs')
    by_id = {m['id']: m for m in modules}
    resource_by_id = {r['id']: r for r in resources}
    require(set(catalog['assessments']) == set(module_ids), 'Assessment coverage differs')
    require(all(set(v) == {'exercise', 'mastery'} for v in catalog['assessments'].values()),
            'Assessment schema changed')
    require(all(set(s) == {'stage', 'title', 'modules', 'gate', 'hours'} for s in catalog['stages']),
            'Stage schema changed')

    # This validates every topic sentence, not just a title/keyword sample.
    topic_rows, module_rows, inherited = [], [], Counter()
    md_topic_ids = re.findall(r'^- \*\*(M\d{2}\.\d{2}) ', master, re.M)
    require(md_topic_ids == topic_ids, 'Markdown and JSON topic order/membership differ')
    require(re.findall(r'^#### (M\d{2}) — ', master, re.M) == module_ids, 'Module order differs')
    for mi, m in enumerate(modules):
        require(set(m) == {'id', 'domain', 'title', 'category', 'prerequisites', 'sources',
                           'advanced_extension', 'topics', 'stage'}, f"Module schema: {m['id']}")
        require(set(m['prerequisites']) <= set(module_ids), f"Unknown prerequisite: {m['id']}")
        require(set(m['sources']) <= set(resource_ids), f"Unknown source: {m['id']}")
        start = f"#### {m['id']} — {m['title']}"
        block = section(master, start, f"<a id=\"{modules[mi+1]['id'].lower()}\"></a>"
                        if mi + 1 < len(modules) else '<a id="part-b"></a>')
        domain_before = re.findall(r'^### (D\d{2} · .+)$', master[:master.index(start)], re.M)[-1]
        require(domain_before == m['domain'], f"Domain mismatch: {m['id']}")
        expected_prereqs = ', '.join(f'[{p}](#{p.lower()})' for p in m['prerequisites']) or 'None'
        expected_header = (f"**Category:** {m['category']} · **Entry prerequisites:** {expected_prereqs}"
                           f" · **Roadmap stage:** {m['stage']}")
        require(expected_header in block, f"Module metadata mismatch: {m['id']}")
        expected_sources = '; '.join(f"[{rid}: {resource_by_id[rid]['title']}]({resource_by_id[rid]['url']})"
                                     for rid in m['sources'])
        require('**Resource anchors:** ' + expected_sources in block, f"Resource anchors: {m['id']}")
        require('**Advanced extension:** ' + m['advanced_extension'] + '.' in block,
                f"Advanced extension mismatch: {m['id']}")
        assessment = catalog['assessments'][m['id']]
        require(f"| [{m['id']}](#{m['id'].lower()}) | {assessment['exercise']} | {assessment['mastery']} |"
                in master, f"Assessment mismatch: {m['id']}")
        module_rows.append({**{k: v for k, v in m.items() if k != 'topics'},
                            'topic_count': len(m['topics']), 'assessment': assessment,
                            'provenance': {'json_pointer': f'/modules/{mi}',
                                           'master_line': line_at(master, start)}})
        for ti, t in enumerate(m['topics']):
            require(set(t) == {'id', 'difficulty', 'importance', 'evidence', 'tags', 'title',
                               'subtopics', 'category', 'prerequisites', 'sources', 'stage'},
                    f"Topic schema: {t['id']}")
            require(re.fullmatch(re.escape(m['id']) + r'\.\d{2}', t['id']) is not None,
                    f"Topic/module ID mismatch: {t['id']}")
            code = t['tags']
            require(len(code) == 3 and (DIFFICULTY[code[0]], IMPORTANCE[code[1]], EVIDENCE[code[2]]) ==
                    (t['difficulty'], t['importance'], t['evidence']), f"Classification: {t['id']}")
            expected = f"- **{t['id']} {t['title']}** [{' · '.join(code)}]\n  - {t['subtopics']}."
            require(expected in block, f"Topic content mismatch: {t['id']}")
            for field in ('category', 'prerequisites', 'sources', 'stage'):
                if t[field] == m[field]:
                    inherited[field] += 1
            topic_rows.append({**t, 'module_id': m['id'], 'domain': m['domain'],
                               'provenance': {'json_pointer': f'/modules/{mi}/topics/{ti}',
                                              'master_line': line_at(master, expected)}})

    # No unreviewed prose is allowed to hide between Part A's catalog records.
    part_a = section(master, '### D01', '<a id="part-b"></a>')
    residual = re.sub(r'- \*\*M\d{2}\.\d{2} [^\n]+\n  - [^\n]+', '', part_a)
    residual = re.sub(r'^#### M[^\n]+|^### D[^\n]+|^<a id="m[^\n]+|^\*\*Category:\*\*[^\n]+'
                      r'|^\*\*Resource anchors:\*\*[^\n]+|^\*\*Advanced extension:\*\*[^\n]+',
                      '', residual, flags=re.M)
    require(not residual.strip(), 'Unexpected Part A prose requires review')

    parity = []
    for part, next_part in [('b', 'c'), ('c', 'd'), ('d', 'e'), ('f', 'g'), ('g', 'h'), ('h', None)]:
        start = f'<a id="part-{part}"></a>'
        if part == 'd':
            a = section(master, start, '<a id="part-e"></a>')
            b = section(roadmap, start, '## Part E')
        else:
            end = f'<a id="part-{next_part}"></a>' if next_part else None
            a, b = section(master, start, end), section(roadmap, start, end)
        require(clean(a) == clean(b.replace('options-master-knowledge-map.md#', '#')),
                f'Roadmap/master Part {part.upper()} differs')
        parity.append(part.upper())

    require(re.findall(r'^#### (R\d{2}) — ', master, re.M) == resource_ids, 'Resource membership/order differs')
    resource_rows = []
    for ri, r in enumerate(resources):
        require(set(r) == {'id', 'title', 'url', 'level', 'kind', 'why', 'access'}, f"Resource schema: {r['id']}")
        start = f"#### {r['id']} — [{r['title']}]({r['url']})"
        block = section(master, start, f"#### {resources[ri+1]['id']} — " if ri + 1 < len(resources)
                        else '### Currency and verification protocol')
        used = [m['id'] for m in modules if r['id'] in m['sources']]
        used_md = ', '.join(f'[{m}](#{m.lower()})' for m in used)
        expected = (f"{start}\n\n**Level:** {r['level']} · **Type:** {r['kind']} · **Used in:** {used_md}"
                    f"\n\n{r['why']}\n\n*Research access note:* {r['access']}")
        require(clean(expected) == clean(block), f"Resource record mismatch: {r['id']}")
        resource_rows.append({**r, 'used_in_modules': used, 'verification_status': 'inherited_claim_not_reverified',
                              'provenance': {'json_pointer': f'/resources/{ri}',
                                             'master_line': line_at(master, start)}})

    stages = catalog['stages']
    flat = [mid for s in stages for mid in s['modules']]
    require(Counter(flat) == Counter(module_ids), 'Stage membership does not partition modules')
    position = {mid: i for i, mid in enumerate(flat)}
    for s in stages:
        require(all(by_id[mid]['stage'] == s['stage'] for mid in s['modules']), 'Stage metadata differs')
        links = ', '.join(f'[{mid}](#{mid.lower()})' for mid in s['modules'])
        require(f"| {s['stage']} | **{s['title']}** — {links} | {s['gate']} | {s['hours']} |" in master,
                f"Stage text mismatch: {s['stage']}")
    visiting, visited, topological = [], set(), []

    def visit(mid):
        require(mid not in visiting, 'Prerequisite cycle: ' + ' -> '.join(visiting + [mid]))
        if mid in visited:
            return
        visiting.append(mid)
        for prior in by_id[mid]['prerequisites']:
            visit(prior)
        visiting.pop()
        visited.add(mid)
        topological.append(mid)

    for mid in module_ids:
        visit(mid)
    later_stage = [{'module': m['id'], 'prerequisite': p} for m in modules for p in m['prerequisites']
                   if by_id[p]['stage'] > m['stage']]
    later_in_stage_order = [{'module': m['id'], 'prerequisite': p} for m in modules for p in m['prerequisites']
                            if position[p] > position[m['id']]]

    # Preserve all non-catalog learning-design prose, including the omitted structures.
    names = {
        'high_impact_path': ('### The high-impact path', '### Specialization branches'),
        'specialization_branches': ('### Specialization branches', '<a id="part-d">'),
        'assessment_standards': ('### Common mastery standard', '### Module exercises'),
        'capstones': ('### Integrated capstones', "### The trader's decision card"),
        'decision_card': ("### The trader's decision card", '### Lesson delivery'),
        'lesson_delivery': ('### Lesson delivery', '<a id="part-g">'),
        'existing_gap_audits': ('## Part G', '<a id="part-h">'),
        'mastery_levels': ('## Part H', None),
        'evidence_policy': ('### Evidence policy', '## Part E'),
    }
    supplemental = {}
    for name, (start, end) in names.items():
        supplemental[name] = {'source': SOURCE_NAMES[0], 'line': line_at(roadmap, start),
                              'markdown': section(roadmap, start, end)}
    supplemental['resource_domain_map'] = {'source': SOURCE_NAMES[1],
        'line': line_at(master, '## Part E'),
        'markdown': section(master, '## Part E', '### Annotated reference library')}
    supplemental['currency_protocol'] = {'source': SOURCE_NAMES[1],
        'line': line_at(master, '### Currency and verification protocol'),
        'markdown': section(master, '### Currency and verification protocol', '<a id="part-f">')}

    counts = lambda xs, key: dict(sorted(Counter(x[key] for x in xs).items()))
    groups = defaultdict(list)
    for t in topics:
        groups[t['title'].casefold()].append(t['id'])
    duplicate_titles = {k: v for k, v in groups.items() if len(v) > 1}
    domain_counts = Counter(m['domain'] for m in modules for t in m['topics'])
    manifest = []
    for name, content in texts.items():
        raw = (ROOT / name).read_bytes()
        manifest.append({'path': name, 'sha256': hashlib.sha256(raw).hexdigest(), 'bytes': len(raw),
                         'lines': len(content.splitlines()), 'whitespace_words': len(content.split()),
                         'source_declared_research_date': catalog['research_date']})
    metadata_targets = ['author_organization', 'cost', 'estimated_study_minutes', 'topic_ids',
                        'prerequisites', 'priority', 'publication_date', 'foundational',
                        'geographic_relevance', 'last_verified_at', 'verification_evidence', 'license']
    summary = {
        'schema_version': 1, 'scope': 'supplied source inventory; not a canonical curriculum or publication certification',
        'source_manifest': manifest,
        'counts': {'domains': len(domain_counts), 'modules': len(modules), 'topics': len(topics),
                   'subtopic_scope_strings': len(topics), 'resources': len(resources),
                   'module_resource_links': sum(len(m['sources']) for m in modules),
                   'topic_resource_links_inherited': sum(len(t['sources']) for t in topics),
                   'module_prerequisite_edges': sum(len(m['prerequisites']) for m in modules),
                   'stages': len(stages), 'module_assessments': len(catalog['assessments']),
                   'capstone_briefs': len(re.findall(r'^\d+\. ', supplemental['capstones']['markdown'], re.M)),
                   'specialization_branch_rows': sum(line.startswith('|') for line in
                       supplemental['specialization_branches']['markdown'].splitlines()) - 2,
                   'decision_card_questions': len(re.findall(r'^\d+\. ', supplemental['decision_card']['markdown'], re.M))},
        'domain_topics': dict(domain_counts), 'difficulty': counts(topics, 'difficulty'),
        'importance': counts(topics, 'importance'), 'evidence': counts(topics, 'evidence'),
        'resource_types': counts(resources, 'kind'), 'resource_levels': counts(resources, 'level'),
        'category_topic_counts': counts(topics, 'category'),
        'topic_fields_identical_to_parent': dict(inherited),
        'parity': {'topics': 'exact title, classification and subtopic text', 'resources': 'all fields and reverse module links',
                   'modules': 'all fields', 'assessments': 'all exercise/mastery text', 'stages': 'all fields',
                   'shared_markdown_parts_equal_after_link_normalization': parity, 'unexplained_part_a_prose': 0},
        'graph': {'acyclic': True, 'topological_order': topological,
                   'later_stage_prerequisites': later_stage, 'prerequisites_later_in_declared_stage_order': later_in_stage_order},
        'duplicate_topic_titles': duplicate_titles,
        'duplicate_resource_urls': [u for u, n in Counter(r['url'] for r in resources).items() if n > 1],
        'unreferenced_resources': [r['id'] for r in resources if not any(r['id'] in m['sources'] for m in modules)],
        'unused_resource_id_numbers': [f'R{i:02}' for i in range(1, max(int(r[1:]) for r in resource_ids) + 1)
                                        if f'R{i:02}' not in resource_ids],
        'resource_metadata_missing_as_explicit_fields': {field: len(resources) for field in metadata_targets
                                                         if all(field not in r for r in resources)},
        'fresh_external_verification_performed_by_this_script': False,
    }

    index = ['# Supplied module inventory', '', 'Generated by `python3 scripts/inventory_sources.py`.', '',
             'Source descriptions and priorities are preserved, not endorsed or independently verified. '
             'Each subtopic field is an unsplit scope string; counts are not counts of lessons.', '',
             '| ID | Module | Topics | Stage | Prerequisites | Resource anchors | Source |',
             '|---|---|---:|---:|---|---|---|']
    for m in module_rows:
        index.append(md_row(m['id'], m['title'], m['topic_count'], m['stage'],
                            ', '.join(m['prerequisites']) or 'None', ', '.join(m['sources']),
                            f"[map](../../sources/roadmaps/options-master-knowledge-map.md#{m['id'].lower()})"))
    index += ['', '## Domain totals', '', '| Domain | Topics |', '|---|---:|']
    index += [md_row(k, v) for k, v in domain_counts.items()]
    artifacts = {'summary.json': summary, 'modules.json': module_rows, 'topics.json': topic_rows,
                 'resources.json': resource_rows, 'stages.json': stages, 'supplemental.json': supplemental}
    rendered = {name: json.dumps(data, ensure_ascii=False, indent=2) + '\n' for name, data in artifacts.items()}
    rendered['MODULES.md'] = '\n'.join(index) + '\n'
    failures = []
    for name, content in rendered.items():
        path = OUT / name
        if args.check:
            if not path.exists() or path.read_text(encoding='utf-8') != content:
                failures.append(str(path.relative_to(ROOT)))
        else:
            OUT.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding='utf-8')
    if failures:
        print('Inventory artifacts differ: ' + ', '.join(failures), file=sys.stderr)
        return 1
    print(json.dumps({'result': 'verified' if args.check else 'generated',
                      'counts': summary['counts'], 'artifacts': len(rendered),
                      'later_prerequisites': later_in_stage_order}, indent=2))
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (ValueError, KeyError, IndexError) as exc:
        print(f'Inventory validation failed: {exc}', file=sys.stderr)
        sys.exit(1)
