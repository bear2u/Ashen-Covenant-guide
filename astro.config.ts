import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import nimbus, { defineConfig as defineNimbusConfig } from '@cloudflare/nimbus-docs';
import { tableScroll } from '@cloudflare/nimbus-docs/markdown';
import { deployment } from './scripts/deployment';

const { site, base } = deployment(process.env);
const config = defineNimbusConfig({
  site,
  title: '재의 성약 · 가이드',
  description: 'Ashen Covenant의 첫 출정부터 세 가지 빌드, 장비와 룬워드, 전투 공식까지. 재의 성약 한국어 가이드.',
  locale: 'ko',
  homeLabel: '가이드 첫 장',
  sidebar: { defaultCollapsed: true, items: [
    { label: '가이드 첫 장', link: '/' },
    { label: '시작하기', autogenerate: { directory: 'start' }, collapsed: false },
    { label: '캐릭터와 전투', autogenerate: { directory: 'growth' }, collapsed: false },
    { label: '아이템 도감', autogenerate: { directory: 'items' } },
    { label: '거점과 던전', autogenerate: { directory: 'world' } },
    { label: '빌드 가이드', link: '/builds/guide/' },
    { label: '도움말', autogenerate: { directory: 'help' } },
    { label: '업데이트 내역', autogenerate: { directory: 'updates' } },
  ] },
  github: null,
  editPattern: null,
  socialImageAlt: '재의 성약 Ashen Covenant 한국어 가이드',
});

export default defineConfig({
  site, base, output: 'static', trailingSlash: 'always',
  vite: { plugins: [tailwindcss()] },
  integrations: [nimbus(config, {
    rules: { 'nimbus/frontmatter-shape': 'error', 'nimbus/internal-link': 'error' },
    markdown: { hastPlugins: [tableScroll()] },
  })],
});
