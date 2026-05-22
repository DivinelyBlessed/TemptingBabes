/**
 * build.js — inject nav and footer partials into all main-site HTML files.
 *
 * Usage:
 *   node build.js          — inject into all eligible HTML files
 *
 * To change the nav or footer:
 *   1. Edit  _partials/nav.html   or  _partials/footer.html
 *   2. Run   node build.js
 *   3. Commit everything and push — done.
 *
 * Netlify runs this automatically on every deploy (see netlify.toml).
 */

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ── Load partials ──────────────────────────────────────────────
const NAV    = fs.readFileSync('_partials/nav.html',    'utf8').trim();
const FOOTER = fs.readFileSync('_partials/footer.html', 'utf8').trim();

// ── Get all tracked HTML files ─────────────────────────────────
const allFiles = execSync('git ls-files "*.html"')
  .toString()
  .trim()
  .split('\n')
  .map(f => f.trim())
  .filter(Boolean);

// ── Skip profile pages (Dating/name/index.html) ───────────────
const SKIP = /^Dating\/[^/]+\/index\.html$/;

let updated = 0;

allFiles.forEach(file => {
  if (SKIP.test(file)) return;

  const absPath = path.resolve(file);
  if (!fs.existsSync(absPath)) return;

  let html = fs.readFileSync(absPath, 'utf8');
  let changed = false;

  // Replace nav block (from <nav> through closing </div> of mobile-menu)
  const navRE = /<nav>[\s\S]*?<\/nav>\s*<div class="mobile-menu"[\s\S]*?<\/div>/;
  if (navRE.test(html)) {
    html = html.replace(navRE, NAV);
    changed = true;
  }

  // Replace main site footer
  const footerRE = /<footer class="site-footer">[\s\S]*?<\/footer>/;
  if (footerRE.test(html)) {
    html = html.replace(footerRE, FOOTER);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(absPath, html);
    console.log('✓', file);
    updated++;
  }
});

console.log(`\nDone — ${updated} file(s) updated.`);
