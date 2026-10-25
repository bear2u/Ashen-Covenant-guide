import fs from 'node:fs';
import path from 'node:path';

const roots = ['content-source', 'src/content/docs'];
if (process.argv.includes('--built')) roots.push('dist');
const forbidden = /src\/(?:data|rules|game|ui)\/|tests\/|artifacts\/|d2data|localStorage\[['"]ashen|ashen-covenant-save|validateProfile|freshProfile|npm (?:run|install)|ipconfig|127\.0\.0\.1|개발자 가이드|개발 참고|자동 플레이|reference\/(?:developer|d2data-mapping|runway-assets)/i;
const errors = [];
let checked = 0;
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) { walk(file); continue; }
    if (!/\.(?:md|mdx|html|txt|json)$/.test(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    if (forbidden.test(content)) errors.push(`${file}: internal game material found`);
    checked++;
  }
}
for (const root of roots) walk(root);
if (process.argv.includes('--built')) {
  for (const route of ['reference', 'llms.txt', 'llms-full.txt', 'nimbus-api', 'index.md', 'index.mdx']) {
    if (fs.existsSync(path.join('dist', route))) errors.push(`Unexpected public route: ${route}`);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Public player-guide check passed (${checked} files).`);
