import json,hashlib,tarfile,re
from pathlib import Path
repo=Path.cwd();tmp=Path('/private/tmp/ovn-local-audit.lzZlt2');p=repo/'output/playwright/final-local-audit-2026-10-27'
packed=json.loads((tmp/'pack.json').read_text());pack=packed[0] if isinstance(packed,list) else packed['a11y-overflow-nav']
expected={'package.json','README.md','CHANGELOG.md','LICENSE',*[f'dist/{f.name}' for f in Path('dist').iterdir() if f.is_file()]}
assert {f['path'] for f in pack['files']}==expected and len(expected)==12
with tarfile.open(tmp/pack['filename']) as tf:
 for f in pack['files']:assert tf.extractfile('package/'+f['path']).read()==(repo/f['path']).read_bytes()
for target in ['.','./docs']:
 for filename in json.loads(Path('package.json').read_text())['exports'][target].values():assert (repo/filename).is_file()
assert all((Path('docs/dist')/f.name).read_bytes()==f.read_bytes() for f in Path('dist').iterdir() if f.is_file())
assert Path('docs/demo.css').read_bytes()==Path('demo.css').read_bytes()
with tarfile.open('/private/tmp/ovn-release-audit-docs-backup.tar') as tf:
 mismatches=[m.name for m in tf.getmembers() if m.isfile() and (not Path(m.name).exists() or tf.extractfile(m).read()!=Path(m.name).read_bytes())]
assert not mismatches
for f,h in json.loads((p/'target-sha256.json').read_text()).items():assert hashlib.sha256(Path(f).read_bytes()).hexdigest()==h
(p/'pack.json').write_text(json.dumps(pack,indent=2)+'\n')
graph={};checked=set()
def module(path):
 path=path.resolve()
 if path in checked:return
 assert path.is_file(),path
 checked.add(path)
 for name in re.findall(r'(?:from\s*|import\s*)[\"\x27](\.[^\"\x27]+\.js)[\"\x27]',path.read_text()):module(path.parent/name)
for f in ['docs/index.html','docs/examples/basic/index.html','docs/examples/stress/index.html']:
 html=Path(f).read_text();match=re.search(r'<script type="importmap">(.*?)</script>',html,re.S)
 mapping=json.loads(match.group(1))['imports'];ref=mapping['a11y-menu-button/core']
 module(Path(f).parent/ref)
 for name in re.findall(r'from\s*[\"\x27](\.[^\"\x27]+\.js)[\"\x27]',html):module(Path(f).parent/name)
 for name in re.findall(r'<link[^>]+href=[\"\x27]([^\"\x27]+\.css)[\"\x27]',html):assert (Path(f).parent/name).is_file()
 graph[f]={'importMap':mapping,'localReferences':'pass'}
(p/'pages-module-graph.json').write_text(json.dumps({'pages':graph,'modules':[str(x.relative_to(repo)) for x in sorted(checked)]},indent=2)+'\n')
for name in ['smoke.mjs','smoke.ts']:(p/name).write_bytes((tmp/'consumer'/name).read_bytes())
print('Pack allowlist/bytes, export files, Pages parity and three-page local module graph: pass. Pages regeneration identical.')
