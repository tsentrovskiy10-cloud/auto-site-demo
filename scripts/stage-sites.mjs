import { cpSync, mkdirSync, readdirSync } from 'node:fs';
// Sites expects browser assets under dist/client; retain the root files for GitHub Pages.
const entries = readdirSync('dist', { withFileTypes: true });
mkdirSync('dist/client', { recursive: true });
for (const entry of entries) {
  if (['client', 'server', '.openai'].includes(entry.name)) continue;
  cpSync(`dist/${entry.name}`, `dist/client/${entry.name}`, { recursive: true });
}
