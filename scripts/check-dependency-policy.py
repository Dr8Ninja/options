#!/usr/bin/env python3
"""Enforce exact frontend dependencies and reviewed Maven/image policy."""
import json,re,xml.etree.ElementTree as ET
from pathlib import Path
r=Path(__file__).resolve().parents[1]
p=json.loads((r/"frontend/package.json").read_text())
for group in ["dependencies","devDependencies"]:
    assert all(re.fullmatch(r"\d+\.\d+\.\d+",v) for v in p[group].values()), "Pin direct npm versions"
lock=json.loads((r/"frontend/package-lock.json").read_text())
assert lock['lockfileVersion']==3
for name,item in lock['packages'].items():
    if not name:continue
    assert item.get('integrity','').startswith('sha512-'), f"Missing SHA-512: {name}"
    assert item.get('resolved','').startswith('https://registry.npmjs.org/'),f"Unexpected registry: {name}"
ns={'m':'http://maven.apache.org/POM/4.0.0'}
pom=ET.parse(r/'backend/pom.xml')
assert pom.findtext('m:parent/m:version',namespaces=ns)=='4.1.1'
for dep in pom.findall('m:dependencies/m:dependency',ns):
    group=dep.findtext('m:groupId',namespaces=ns)
    if group.startswith(('org.springframework','org.hibernate','tools.jackson')) and group!='org.springdoc':
        assert dep.find('m:version',ns) is None, "Use Boot dependency management"
assert 'com.h2database' not in [d.findtext('m:groupId',namespaces=ns) for d in pom.findall('m:dependencies/m:dependency',ns)]
for file in [r/'backend/Dockerfile',r/'frontend/Dockerfile',r/'infrastructure/Dockerfile',r/'infrastructure/compose.yml']:
    for line in file.read_text().splitlines():
        if line.startswith('FROM ') or line.strip().startswith('image:'):
            assert re.search(r'@sha256:[a-f0-9]{64}',line), f"Unpinned image: {file}"
scanners=json.loads((r/'infrastructure/security-tools.json').read_text())
expected={
    'gitleaks_8.30.1_darwin_arm64.tar.gz': 'gitleaks/gitleaks/v8.30.1',
    'gitleaks_8.30.1_linux_x64.tar.gz': 'gitleaks/gitleaks/v8.30.1',
    'trivy_0.74.0_macOS-ARM64.tar.gz': 'aquasecurity/trivy/v0.74.0',
    'trivy_0.74.0_Linux-64bit.tar.gz': 'aquasecurity/trivy/v0.74.0',
}
assert set(scanners)==set(expected), "Missing reviewed scanner platform pins"
for name,release in expected.items():
    repo,version=release.rsplit('/',1)
    assert scanners[name]['url']==f'https://github.com/{repo}/releases/download/{version}/{name}'
    assert re.fullmatch(r'[a-f0-9]{64}',scanners[name]['sha256']), "Missing scanner SHA-256"
print('PASS: exact package, registry integrity, BOM, image and scanner policy')
