/**
 * build.js -- sync nav and footer partials into all site HTML files.
 *
 * Usage:
 *   node build.js             -- update all eligible HTML files in-place
 *   node build.js --dry-run   -- preview what would change, no writes
 *
 * To update nav or footer sitewide:
 *   1. Edit  _partials/nav.html   or  _partials/footer.html
 *   2. Run   node build.js
 *   3. Commit all changed files and push -- done.
 *
 * Netlify also runs this automatically on every deploy (netlify.toml).
 */

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DRY = process.argv.includes('--dry-run');

// Load partials
const NAV    = fs.readFileSync('_partials/nav.html',    'utf8').trim();
const FOOTER = fs.readFileSync('_partials/footer.html', 'utf8').trim();

// Nav regex: matches from <nav> through the closing </div> of the mobile-menu,
// including any <script> that may sit between </nav> and <div id="mobileMenu">.
const NAV_RE = /<nav[\s\S]*?<div[^>]+id="mobileMenu"[^>]*>[\s\S]*?<\/div>/;

// Footer regex
const FOOTER_RE = /<footer[\s\S]*?<\/footer>/;

// Files / directories to skip
const SKIP_PATTERNS = [
  /^_partials\//i,          // the partials themselves
  /^_template/i,            // template files
  /^dating\/[^/]+\/index\.html$/i,  // individual dating profiles
];

function shouldSkip(file) {
  return SKIP_PATTERNS.some(re => re.test(file));
}

// Get all tracked HTML files
const allFiles = execSync('git ls-files "*.html"')
  .toString().trim().split('\n')
  .map(f => f.trim()).filter(Boolean);

let updated = 0;
let skipped = 0;

allFiles.forEach(file => {
  if (shouldSkip(file)) { skipped++; return; }

  const absPath = path.resolve(file);
  if (!fs.existsSync(absPath)) return;

  let html = fs.readFileSync(absPath, 'utf8');
  let changed = false;

  if (NAV_RE.test(html)) {
    html = html.replace(NAV_RE, NAV);
    changed = true;
  }

  if (FOOTER_RE.test(html)) {
    html = html.replace(FOOTER_RE, FOOTER);
    changed = true;
  }

  if (changed) {
    if (!DRY) fs.writeFileSync(absPath, html, 'utf8');
    console.log((DRY ? '[dry] ' : 'ok ') + file);
    updated++;
  }
});

console.log('\n' + (DRY ? '[dry-run] ' : '') + 'Done -- ' + updated + ' file(s) ' + (DRY ? 'would be ' : '') + 'updated, ' + skipped + ' skipped.');