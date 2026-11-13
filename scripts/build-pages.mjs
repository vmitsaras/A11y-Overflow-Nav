import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'docs');
const packageDist = join(root, 'dist');
const menuDist = join(root, 'node_modules/a11y-menu-button/dist');

for (const required of [
  join(packageDist, 'index.js'),
  join(menuDist, 'core.js'),
]) {
  if (!existsSync(required)) {
    throw new Error(`Missing ${required}. Run npm run pages:build after installing dependencies.`);
  }
}

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

const pages = [
  { source: 'index.html', target: 'index.html', menuPath: './vendor/a11y-menu-button/core.js' },
  { source: 'examples/basic/index.html', target: 'examples/basic/index.html', menuPath: '../../vendor/a11y-menu-button/core.js' },
  { source: 'examples/stress/index.html', target: 'examples/stress/index.html', menuPath: '../../vendor/a11y-menu-button/core.js' },
];

for (const { source, target, menuPath } of pages) {
  const html = readFileSync(join(root, source), 'utf8');
  const rewritten = html.replace(
    /(?:\.\/|\.\.\/){1,2}node_modules\/a11y-menu-button\/dist\/core\.js/g,
    menuPath,
  );
  if (rewritten === html) {
    throw new Error(`Expected Menu Button import map was not found in ${source}`);
  }
  const destination = join(output, target);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, rewritten);
}

cpSync(join(root, 'demo.css'), join(output, 'demo.css'));
cpSync(join(root, 'examples/basic/styles.css'), join(output, 'examples/basic/styles.css'));
cpSync(packageDist, join(output, 'dist'), { recursive: true });

const vendor = join(output, 'vendor/a11y-menu-button');
mkdirSync(vendor, { recursive: true });
const pending = ['core.js'];
const copied = new Set();
while (pending.length > 0) {
  const file = pending.pop();
  if (copied.has(file)) continue;
  const source = readFileSync(join(menuDist, file), 'utf8');
  for (const match of source.matchAll(/\bfrom\s+["']\.\/([^"']+\.js)["']/g)) {
    pending.push(match[1]);
  }
  writeFileSync(join(vendor, file), source);
  copied.add(file);
}
cpSync(join(root, 'node_modules/a11y-menu-button/LICENSE'), join(vendor, 'LICENSE'));
writeFileSync(join(output, '.nojekyll'), '');

if (!existsSync(join(output, 'index.html'))) {
  throw new Error('Pages output is missing docs/index.html');
}
