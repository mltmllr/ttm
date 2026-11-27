#!/usr/bin/env node
/**
 * Interner Linkcheck ohne Netz.
 * Prüft in allen HTML-Dateien eines Build-Ordners (Standard: dist) href/src auf
 * existierende Dateien und #Anker, außerdem url(...) in den CSS-Dateien.
 * Externe Links (http/https anderer Hosts, mailto:, tel:, data:) werden übersprungen.
 * Absolute URLs auf die eigene Domain werden wie interne Pfade geprüft.
 *
 * Aufruf: node scripts/check-links.mjs [ordner] [--site https://ttm.agentunit.com]
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const siteFlag = args.indexOf('--site');
const site = siteFlag >= 0 ? args.splice(siteFlag, 2)[1] : 'https://ttm.agentunit.com';
const root = path.resolve(args[0] ?? 'dist');
const siteOrigin = new URL(site).origin;

if (!existsSync(root)) {
  console.error(`Ordner nicht gefunden: ${root}`);
  process.exit(2);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(root);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const cssFiles = files.filter((file) => file.endsWith('.css'));
const idCache = new Map();
const problems = [];

function ids(file) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    const found = new Set();
    for (const match of html.matchAll(/\s(?:id|name)=["']([^"']+)["']/g)) found.add(match[1]);
    idCache.set(file, found);
  }
  return idCache.get(file);
}

function resolveTarget(pathname, fromFile) {
  const base = pathname.startsWith('/')
    ? path.join(root, pathname)
    : path.resolve(path.dirname(fromFile), pathname);
  const candidates = pathname.endsWith('/')
    ? [path.join(base, 'index.html')]
    : [base, path.join(base, 'index.html'), `${base}.html`];
  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
}

function check(rawUrl, fromFile, kind) {
  let url = rawUrl.trim();
  if (!url || /^(mailto:|tel:|data:|javascript:|blob:)/i.test(url)) return;
  if (url.startsWith('//')) return;
  if (/^https?:\/\//i.test(url)) {
    if (!url.startsWith(siteOrigin)) return;
    url = url.slice(siteOrigin.length) || '/';
  }
  const [withoutHash, hash = ''] = url.split('#');
  const pathname = decodeURI(withoutHash.split('?')[0]);

  let target;
  if (pathname === '') {
    target = fromFile; // nur #Anker auf der eigenen Seite
  } else {
    target = resolveTarget(pathname, fromFile);
    if (!target) {
      problems.push(`${path.relative(root, fromFile)}: ${kind} "${rawUrl}" zeigt auf keine Datei`);
      return;
    }
  }
  if (hash && target.endsWith('.html') && !ids(target).has(decodeURIComponent(hash))) {
    problems.push(`${path.relative(root, fromFile)}: ${kind} "${rawUrl}" – Anker #${hash} fehlt`);
  }
}

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/<(?:a|link|script|img|source|iframe)\b[^>]*?\s(href|src)=("([^"]*)"|'([^']*)')/gi)) {
    check(match[3] ?? match[4] ?? '', file, match[1]);
  }
}
for (const file of cssFiles) {
  const css = readFileSync(file, 'utf8');
  for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
    check(match[1], file, 'url()');
  }
}

console.log(`Linkcheck ${path.relative(process.cwd(), root) || '.'}: ${htmlFiles.length} HTML- und ${cssFiles.length} CSS-Dateien geprüft.`);
if (problems.length > 0) {
  console.error(`\n${problems.length} Problem(e):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log('Alle internen Links in Ordnung.');
