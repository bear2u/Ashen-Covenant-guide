import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const pages = JSON.parse(fs.readFileSync(new URL('./doc-pages.json', import.meta.url), 'utf8'));
const snapshot = path.join(root, 'content-source');
if (process.argv.length > 2) throw new Error('Only curated player guides may be published.');
const routes = new Map(pages.map(([filename, slug]) => [filename, slug === 'index' ? '/' : `/${slug}/`]));
for (const [index, [filename, slug, title, description]] of pages.entries()) {
  let body = fs.readFileSync(path.join(snapshot, filename), 'utf8').replace(/^# .+\r?\n+/, '');
  body = body.replace(/\]\(([^)]+\.md)(#[^)]*)?\)/g, (_match, target, anchor = '') => {
    const route = routes.get(path.basename(target));
    if (!route) throw new Error(`Unmapped document link in ${filename}: ${target}`);
    return `](${route}${anchor})`;
  });
  if (slug === 'index') {
    body = 'import GuideHero from "../../components/GuideHero.astro";\n\n<GuideHero />\n\n'
      + '**ASHEN COVENANT** · 한 명의 마검사 · 세 가지 기술 트리 · 여섯 구역의 던전\n\n' + body;
    body += '\n## 최근 문서 업데이트\n\n[2026년 10월 25일 · 가이드 공개](/updates/2026-10-25/)\n';
  }
  const frontmatter = `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\nsidebar:\n  order: ${index}\n---\n\n`;
  const output = path.join(root, 'src/content/docs', `${slug}.mdx`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, frontmatter + body);
}
console.log(`Synced ${pages.length} documents from content-source.`);
