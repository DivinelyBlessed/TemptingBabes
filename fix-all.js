/**
 * fix-all.js — Handles Issues 1-7
 * Run: node fix-all.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function read(rel)        { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
function write(rel, data) { fs.writeFileSync(path.join(ROOT, rel), data, 'utf8'); console.log('  wrote:', rel); }
function exists(rel)      { return fs.existsSync(path.join(ROOT, rel)); }
function mkdirp(rel)      { fs.mkdirSync(path.join(ROOT, rel), { recursive: true }); }

function copyDirSync(src, dest) {
  mkdirp(dest);
  fs.readdirSync(path.join(ROOT, src)).forEach(f => {
    const s = path.join(ROOT, src, f);
    const d = path.join(ROOT, dest, f);
    if (fs.statSync(s).isDirectory()) { copyDirSync(path.join(src, f), path.join(dest, f)); }
    else { fs.copyFileSync(s, d); }
  });
}
function deleteDirSync(rel) {
  fs.rmSync(path.join(ROOT, rel), { recursive: true, force: true });
}

function getAllHtml(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (['.git', 'node_modules'].includes(f)) return;
    if (fs.statSync(full).isDirectory()) out.push(...getAllHtml(full));
    else if (f.endsWith('.html')) out.push(full);
  });
  return out;
}

// ─────────────────────────────────────────────────────────────
// ISSUE 1 — Add Blog to main nav in _partials/nav.html
// ─────────────────────────────────────────────────────────────
console.log('\n[1] Adding Blog to nav...');
{
  let nav = read('_partials/nav.html');
  if (!nav.includes('href="/Blog/"')) {
    nav = nav.replace(
      '<a href="/Trending/" class="tab">Trending</a>',
      '<a href="/Blog/" class="tab">Blog</a>\n    <a href="/Trending/" class="tab">Trending</a>'
    );
    nav = nav.replace(
      '<a href="/Trending/" class="mobile-tab">Trending</a>',
      '<a href="/Blog/" class="mobile-tab">Blog</a>\n  <a href="/Trending/" class="mobile-tab">Trending</a>'
    );
    write('_partials/nav.html', nav);
    console.log('  Blog tab added to nav partial.');
  } else {
    console.log('  Blog already in nav — skipped.');
  }
}

// ─────────────────────────────────────────────────────────────
// ISSUE 2 — Move articles to correct category folders
// ─────────────────────────────────────────────────────────────
console.log('\n[2] Moving articles to correct category folders...');
const articleMoves = [
  { slug: 'talking-to-ai-companion',                    from: 'Blog/dating-advice', to: 'Blog/ai-dating',         newCanonical: '/Blog/ai-dating/talking-to-ai-companion/' },
  { slug: 'ai-chat-men-over-30',                        from: 'Blog/dating-advice', to: 'Blog/ai-dating',         newCanonical: '/Blog/ai-dating/ai-chat-men-over-30/' },
  { slug: 'ai-girlfriend-apps-ranked-2026',             from: 'Blog/dating-advice', to: 'Blog/ai-dating',         newCanonical: '/Blog/ai-dating/ai-girlfriend-apps-ranked-2026/' },
  { slug: 'dating-apps-designed-to-keep-you-single',   from: 'Blog/dating-advice', to: 'Blog/dating-apps',       newCanonical: '/Blog/dating-apps/dating-apps-designed-to-keep-you-single/' },
  { slug: 'average-man-dating-app-stats',              from: 'Blog/dating-advice', to: 'Blog/dating-apps',       newCanonical: '/Blog/dating-apps/average-man-dating-app-stats/' },
  { slug: 'doom-scrolling-vs-connecting',               from: 'Blog/dating-advice', to: 'Blog/dating-psychology', newCanonical: '/Blog/dating-psychology/doom-scrolling-vs-connecting/' },
  { slug: 'midnight-ache-scrolling-loneliness',         from: 'Blog/dating-advice', to: 'Blog/dating-psychology', newCanonical: '/Blog/dating-psychology/midnight-ache-scrolling-loneliness/' },
  { slug: '3am-loneliness-brain',                       from: 'Blog/dating-advice', to: 'Blog/dating-psychology', newCanonical: '/Blog/dating-psychology/3am-loneliness-brain/' },
  { slug: 'lonely-weekends',                            from: 'Blog/dating-advice', to: 'Blog/dating-psychology', newCanonical: '/Blog/dating-psychology/lonely-weekends/' },
  { slug: 'what-women-want-first-message',              from: 'Blog/dating-advice', to: 'Blog/messaging',         newCanonical: '/Blog/messaging/what-women-want-first-message/' },
  { slug: 'start-conversation-online-without-being-ignored', from: 'Blog/dating-advice', to: 'Blog/messaging',  newCanonical: '/Blog/messaging/start-conversation-online-without-being-ignored/' },
];

const redirectsToAdd = [];

articleMoves.forEach(m => {
  const srcRel  = `${m.from}/${m.slug}`;
  const destRel = `${m.to}/${m.slug}`;
  if (!exists(srcRel)) { console.log(`  SKIP (not found): ${srcRel}`); return; }
  if (exists(destRel)) { console.log(`  SKIP (exists):    ${destRel}`); return; }

  copyDirSync(srcRel, destRel);
  deleteDirSync(srcRel);
  console.log(`  moved: ${srcRel} → ${destRel}`);

  // Update canonical in moved article
  const artHtml = path.join(ROOT, destRel, 'index.html');
  if (fs.existsSync(artHtml)) {
    let html = fs.readFileSync(artHtml, 'utf8');
    html = html.replace(
      /<link rel="canonical" href="[^"]*"\/>/,
      `<link rel="canonical" href="https://www.temptingbabes.com${m.newCanonical}"/>`
    );
    fs.writeFileSync(artHtml, html, 'utf8');
  }

  // Queue redirect
  redirectsToAdd.push({ from: `/${m.from}/${m.slug}/`, to: m.newCanonical });
});

// Update Blog/index.html with new article paths
console.log('  Updating Blog/index.html article links...');
{
  let html = read('Blog/index.html');
  articleMoves.forEach(m => {
    const oldHref = `${m.from}/${m.slug}/`.replace('Blog/', '');
    const newHref = `${m.to}/${m.slug}/`.replace('Blog/', '');
    html = html.split(`href="${oldHref}"`).join(`href="${newHref}"`);
  });
  write('Blog/index.html', html);
}

// Update category page indexes with correct paths
console.log('  Updating category index pages...');
['ai-dating','dating-apps','dating-psychology','messaging'].forEach(cat => {
  const f = `Blog/${cat}/index.html`;
  if (!exists(f)) return;
  let html = read(f);
  articleMoves.filter(m => m.to === `Blog/${cat}`).forEach(m => {
    // fix old ../dating-advice/slug links to correct /Blog/cat/slug/
    html = html.split(`href="/Blog/../dating-advice/${m.slug}/"`).join(`href="/Blog/${cat}/${m.slug}/"`);
    html = html.split(`href="/Blog/dating-advice/${m.slug}/"`).join(`href="/Blog/${cat}/${m.slug}/"`);
  });
  write(f, html);
});

// ─────────────────────────────────────────────────────────────
// ISSUE 5 — Fix sex-messanger typo → sex-messenger
// ─────────────────────────────────────────────────────────────
console.log('\n[5] Fixing sex-messanger typo...');
if (exists('sex-messanger') && !exists('sex-messenger')) {
  copyDirSync('sex-messanger', 'sex-messenger');
  deleteDirSync('sex-messanger');
  console.log('  Renamed: sex-messanger → sex-messenger');
  redirectsToAdd.push({ from: '/sex-messanger/', to: '/sex-messenger/' });
  redirectsToAdd.push({ from: '/sex-messanger/*', to: '/sex-messenger/:splat' });
} else {
  console.log('  sex-messenger already exists or sex-messanger not found — skipped.');
}

// ─────────────────────────────────────────────────────────────
// ISSUE 7 — Lowercase: update all HTML hrefs + sitemap + netlify
// ─────────────────────────────────────────────────────────────
console.log('\n[7] Lowercasing all internal URL references in HTML files...');

const caseMap = [
  ['/AI-chat/',   '/ai-chat/'],
  ['/About/',     '/about/'],
  ['/Cams/',      '/cams/'],
  ['/Contact/',   '/contact/'],
  ['/Dating/',    '/dating/'],
  ['/Instabang/', '/instabang/'],
  ['/New/',       '/new/'],
  ['/Offers/',    '/offers/'],
  ['/Popular/',   '/popular/'],
  ['/Trending/',  '/trending/'],
  ['/World-Cup/', '/world-cup/'],
];

// Also add lowercase redirects
caseMap.forEach(([old]) => {
  const lc = old.toLowerCase();
  if (old !== lc) {
    redirectsToAdd.push({ from: old,      to: lc });
    redirectsToAdd.push({ from: old + '*', to: lc + ':splat' });
  }
});

const allHtml = getAllHtml(ROOT);
let htmlUpdated = 0;
allHtml.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;
  caseMap.forEach(([old, lc]) => {
    if (html.includes(old)) {
      html = html.split(old).join(lc);
      changed = true;
    }
  });
  if (changed) { fs.writeFileSync(file, html, 'utf8'); htmlUpdated++; }
});
console.log(`  Updated ${htmlUpdated} HTML files.`);

// ─────────────────────────────────────────────────────────────
// ISSUE 3 — Update sitemap.xml
// ─────────────────────────────────────────────────────────────
console.log('\n[3] Regenerating sitemap.xml...');
const today = '2026-05-12';
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- ── Core pages ───────────────────────────────────────── -->
  <url><loc>https://www.temptingbabes.com/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.temptingbabes.com/new/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/trending/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/popular/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.temptingbabes.com/offers/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/cams/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.temptingbabes.com/ai-chat/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.temptingbabes.com/about/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://www.temptingbabes.com/contact/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>

  <!-- ── Dating profiles ─────────────────────────────────── -->
  <url><loc>https://www.temptingbabes.com/dating/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/dating/abigail/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.temptingbabes.com/dating/angel/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.temptingbabes.com/dating/anita/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.temptingbabes.com/dating/cassandra/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.temptingbabes.com/dating/charlie/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.temptingbabes.com/dating/chloe/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.temptingbabes.com/dating/corina/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.temptingbabes.com/dating/emily/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.temptingbabes.com/dating/kate/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.temptingbabes.com/dating/monica/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.temptingbabes.com/dating/nicole/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.temptingbabes.com/dating/rose/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.temptingbabes.com/dating/sophie/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.temptingbabes.com/dating/tracy/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>

  <!-- ── World Cup ────────────────────────────────────────── -->
  <url><loc>https://www.temptingbabes.com/world-cup/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/world-cup/fifa-world-cup-2026-schedule/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>

  <!-- ── Blog index + categories ─────────────────────────── -->
  <url><loc>https://www.temptingbabes.com/Blog/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/dating-advice/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/dating-apps/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/profiles/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/messaging/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/ai-dating/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/confidence/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/hookups/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/first-dates/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/dating-psychology/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>

  <!-- ── Dating Advice articles ──────────────────────────── -->
  <url><loc>https://www.temptingbabes.com/Blog/dating-advice/find-active-women-online-near-you/</loc><lastmod>2026-04-16</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/dating-advice/matching-vs-connecting/</loc><lastmod>2026-04-18</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/dating-advice/low-social-circle-meet-women/</loc><lastmod>2026-04-14</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/dating-advice/no-matches-tinder-real-reason/</loc><lastmod>2026-03-21</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/dating-advice/why-women-dont-reply-dating-apps/</loc><lastmod>2026-03-25</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/dating-advice/no-social-circle-get-matched/</loc><lastmod>2026-04-30</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>

  <!-- ── Dating Apps articles ────────────────────────────── -->
  <url><loc>https://www.temptingbabes.com/Blog/dating-apps/dating-apps-designed-to-keep-you-single/</loc><lastmod>2026-03-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/dating-apps/average-man-dating-app-stats/</loc><lastmod>2026-03-29</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>

  <!-- ── Messaging articles ──────────────────────────────── -->
  <url><loc>https://www.temptingbabes.com/Blog/messaging/what-women-want-first-message/</loc><lastmod>2026-04-12</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/messaging/start-conversation-online-without-being-ignored/</loc><lastmod>2026-04-10</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>

  <!-- ── AI Dating articles ──────────────────────────────── -->
  <url><loc>https://www.temptingbabes.com/Blog/ai-dating/talking-to-ai-companion/</loc><lastmod>2026-04-05</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/ai-dating/ai-chat-men-over-30/</loc><lastmod>2026-04-08</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/ai-dating/ai-girlfriend-apps-ranked-2026/</loc><lastmod>2026-04-02</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>

  <!-- ── Dating Psychology articles ──────────────────────── -->
  <url><loc>https://www.temptingbabes.com/Blog/dating-psychology/doom-scrolling-vs-connecting/</loc><lastmod>2026-03-13</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/dating-psychology/midnight-ache-scrolling-loneliness/</loc><lastmod>2026-04-30</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/dating-psychology/3am-loneliness-brain/</loc><lastmod>2026-03-09</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.temptingbabes.com/Blog/dating-psychology/lonely-weekends/</loc><lastmod>2026-04-30</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>

  <!-- ── Legal ────────────────────────────────────────────── -->
  <url><loc>https://www.temptingbabes.com/privacy-policy/</loc><lastmod>${today}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://www.temptingbabes.com/terms/</loc><lastmod>${today}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://www.temptingbabes.com/dmca/</loc><lastmod>${today}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>

</urlset>`;
write('sitemap.xml', sitemap);

// ─────────────────────────────────────────────────────────────
// ISSUE 4 — Link orphaned pages in footer across all HTML files
// ─────────────────────────────────────────────────────────────
console.log('\n[4] Linking orphaned pages in footer...');
{
  const oldFooterExplore = `<h4 class="footer-col-title">Explore</h4>
      <ul class="footer-links">
        <li><a href="/Blog/">Blog</a></li>
        <li><a href="/World-Cup/">FIFA World Cup 2026</a></li>
        <li><a href="/Freebies/">Freebies</a></li>
      </ul>`;
  const newFooterExplore = `<h4 class="footer-col-title">Explore</h4>
      <ul class="footer-links">
        <li><a href="/Blog/">Blog</a></li>
        <li><a href="/world-cup/">FIFA World Cup 2026</a></li>
        <li><a href="/ways-to-meet/">Ways to Meet</a></li>
        <li><a href="/popular/">Popular Girls</a></li>
      </ul>`;

  // Also the variant without Freebies
  const oldFooterExplore2 = `<h4 class="footer-col-title">Explore</h4>
      <ul class="footer-links">
        <li><a href="/Blog/">Blog</a></li>
        <li><a href="/World-Cup/">FIFA World Cup 2026</a></li>
      </ul>`;
  const newFooterExplore2 = `<h4 class="footer-col-title">Explore</h4>
      <ul class="footer-links">
        <li><a href="/Blog/">Blog</a></li>
        <li><a href="/world-cup/">FIFA World Cup 2026</a></li>
        <li><a href="/ways-to-meet/">Ways to Meet</a></li>
        <li><a href="/popular/">Popular Girls</a></li>
      </ul>`;

  let footerUpdated = 0;
  getAllHtml(ROOT).forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    let changed = false;
    if (html.includes(oldFooterExplore))  { html = html.replace(oldFooterExplore, newFooterExplore); changed = true; }
    if (html.includes(oldFooterExplore2)) { html = html.replace(oldFooterExplore2, newFooterExplore2); changed = true; }
    if (changed) { fs.writeFileSync(file, html, 'utf8'); footerUpdated++; }
  });
  console.log(`  Updated footer in ${footerUpdated} files.`);
}

// ─────────────────────────────────────────────────────────────
// ISSUE 6 — Add related articles section to each blog article
// ─────────────────────────────────────────────────────────────
console.log('\n[6] Adding related articles to blog posts...');

const relatedMap = {
  // dating-advice
  'find-active-women-online-near-you':    { cat: 'dating-advice', related: [{ slug: 'no-matches-tinder-real-reason', title: 'No Matches on Tinder? The Real Reason', cat: 'dating-advice' }, { slug: 'why-women-dont-reply-dating-apps', title: "Why Women Don't Reply on Dating Apps", cat: 'dating-advice' }, { slug: 'dating-apps-designed-to-keep-you-single', title: 'Are Dating Apps Designed to Keep You Single?', cat: 'dating-apps' }] },
  'matching-vs-connecting':               { cat: 'dating-advice', related: [{ slug: 'find-active-women-online-near-you', title: 'How to Find Active Women Online Near You', cat: 'dating-advice' }, { slug: 'doom-scrolling-vs-connecting', title: 'Doom Scrolling vs. Actually Connecting', cat: 'dating-psychology' }, { slug: 'what-women-want-first-message', title: 'What Women Actually Want in a First Message', cat: 'messaging' }] },
  'low-social-circle-meet-women':         { cat: 'dating-advice', related: [{ slug: 'find-active-women-online-near-you', title: 'How to Find Active Women Online Near You', cat: 'dating-advice' }, { slug: 'dating-apps-designed-to-keep-you-single', title: 'Are Dating Apps Designed to Keep You Single?', cat: 'dating-apps' }, { slug: 'start-conversation-online-without-being-ignored', title: 'How to Start a Conversation Online Without Being Ignored', cat: 'messaging' }] },
  'no-matches-tinder-real-reason':        { cat: 'dating-advice', related: [{ slug: 'why-women-dont-reply-dating-apps', title: "Why Women Don't Reply on Dating Apps", cat: 'dating-advice' }, { slug: 'average-man-dating-app-stats', title: "The Average Man's Dating App Stats", cat: 'dating-apps' }, { slug: 'dating-apps-designed-to-keep-you-single', title: 'Are Dating Apps Designed to Keep You Single?', cat: 'dating-apps' }] },
  'why-women-dont-reply-dating-apps':     { cat: 'dating-advice', related: [{ slug: 'no-matches-tinder-real-reason', title: 'No Matches on Tinder? The Real Reason', cat: 'dating-advice' }, { slug: 'what-women-want-first-message', title: 'What Women Actually Want in a First Message', cat: 'messaging' }, { slug: 'doom-scrolling-vs-connecting', title: 'Doom Scrolling vs. Actually Connecting', cat: 'dating-psychology' }] },
  'no-social-circle-get-matched':         { cat: 'dating-advice', related: [{ slug: 'low-social-circle-meet-women', title: 'Low Social Circle? How to Meet Women Anyway', cat: 'dating-advice' }, { slug: 'find-active-women-online-near-you', title: 'How to Find Active Women Online Near You', cat: 'dating-advice' }, { slug: 'dating-apps-designed-to-keep-you-single', title: 'Are Dating Apps Designed to Keep You Single?', cat: 'dating-apps' }] },
  // dating-apps
  'dating-apps-designed-to-keep-you-single': { cat: 'dating-apps', related: [{ slug: 'average-man-dating-app-stats', title: "The Average Man's Dating App Stats", cat: 'dating-apps' }, { slug: 'no-matches-tinder-real-reason', title: 'No Matches on Tinder? The Real Reason', cat: 'dating-advice' }, { slug: 'ai-girlfriend-apps-ranked-2026', title: 'AI Girlfriend Apps Ranked 2026', cat: 'ai-dating' }] },
  'average-man-dating-app-stats':         { cat: 'dating-apps', related: [{ slug: 'dating-apps-designed-to-keep-you-single', title: 'Are Dating Apps Designed to Keep You Single?', cat: 'dating-apps' }, { slug: 'no-matches-tinder-real-reason', title: 'No Matches on Tinder? The Real Reason', cat: 'dating-advice' }, { slug: 'what-women-want-first-message', title: 'What Women Actually Want in a First Message', cat: 'messaging' }] },
  // messaging
  'what-women-want-first-message':        { cat: 'messaging', related: [{ slug: 'start-conversation-online-without-being-ignored', title: 'How to Start a Conversation Online Without Being Ignored', cat: 'messaging' }, { slug: 'why-women-dont-reply-dating-apps', title: "Why Women Don't Reply on Dating Apps", cat: 'dating-advice' }, { slug: 'matching-vs-connecting', title: 'Matching vs. Actually Connecting', cat: 'dating-advice' }] },
  'start-conversation-online-without-being-ignored': { cat: 'messaging', related: [{ slug: 'what-women-want-first-message', title: 'What Women Actually Want in a First Message', cat: 'messaging' }, { slug: 'no-matches-tinder-real-reason', title: 'No Matches on Tinder? The Real Reason', cat: 'dating-advice' }, { slug: 'doom-scrolling-vs-connecting', title: 'Doom Scrolling vs. Actually Connecting', cat: 'dating-psychology' }] },
  // ai-dating
  'talking-to-ai-companion':              { cat: 'ai-dating', related: [{ slug: 'ai-chat-men-over-30', title: 'AI Chat for Men Over 30 — Is It Worth Your Time?', cat: 'ai-dating' }, { slug: 'ai-girlfriend-apps-ranked-2026', title: 'AI Girlfriend Apps Ranked 2026', cat: 'ai-dating' }, { slug: 'doom-scrolling-vs-connecting', title: 'Doom Scrolling vs. Actually Connecting', cat: 'dating-psychology' }] },
  'ai-chat-men-over-30':                  { cat: 'ai-dating', related: [{ slug: 'talking-to-ai-companion', title: 'What Talking to an AI Companion Actually Feels Like', cat: 'ai-dating' }, { slug: 'ai-girlfriend-apps-ranked-2026', title: 'AI Girlfriend Apps Ranked 2026', cat: 'ai-dating' }, { slug: 'midnight-ache-scrolling-loneliness', title: 'The Midnight Ache: Why You Scroll Instead of Connect', cat: 'dating-psychology' }] },
  'ai-girlfriend-apps-ranked-2026':       { cat: 'ai-dating', related: [{ slug: 'talking-to-ai-companion', title: 'What Talking to an AI Companion Actually Feels Like', cat: 'ai-dating' }, { slug: 'ai-chat-men-over-30', title: 'AI Chat for Men Over 30 — Is It Worth Your Time?', cat: 'ai-dating' }, { slug: 'dating-apps-designed-to-keep-you-single', title: 'Are Dating Apps Designed to Keep You Single?', cat: 'dating-apps' }] },
  // dating-psychology
  'doom-scrolling-vs-connecting':         { cat: 'dating-psychology', related: [{ slug: 'midnight-ache-scrolling-loneliness', title: 'The Midnight Ache: Why You Scroll Instead of Connect', cat: 'dating-psychology' }, { slug: '3am-loneliness-brain', title: 'What Your 3AM Brain Is Really Telling You', cat: 'dating-psychology' }, { slug: 'matching-vs-connecting', title: 'Matching vs. Actually Connecting', cat: 'dating-advice' }] },
  'midnight-ache-scrolling-loneliness':   { cat: 'dating-psychology', related: [{ slug: 'doom-scrolling-vs-connecting', title: 'Doom Scrolling vs. Actually Connecting', cat: 'dating-psychology' }, { slug: '3am-loneliness-brain', title: 'What Your 3AM Brain Is Really Telling You', cat: 'dating-psychology' }, { slug: 'lonely-weekends', title: 'Lonely Weekends', cat: 'dating-psychology' }] },
  '3am-loneliness-brain':                 { cat: 'dating-psychology', related: [{ slug: 'midnight-ache-scrolling-loneliness', title: 'The Midnight Ache: Why You Scroll Instead of Connect', cat: 'dating-psychology' }, { slug: 'doom-scrolling-vs-connecting', title: 'Doom Scrolling vs. Actually Connecting', cat: 'dating-psychology' }, { slug: 'talking-to-ai-companion', title: 'What Talking to an AI Companion Actually Feels Like', cat: 'ai-dating' }] },
  'lonely-weekends':                      { cat: 'dating-psychology', related: [{ slug: 'midnight-ache-scrolling-loneliness', title: 'The Midnight Ache: Why You Scroll Instead of Connect', cat: 'dating-psychology' }, { slug: '3am-loneliness-brain', title: 'What Your 3AM Brain Is Really Telling You', cat: 'dating-psychology' }, { slug: 'find-active-women-online-near-you', title: 'How to Find Active Women Online Near You', cat: 'dating-advice' }] },
};

const relatedCSS = `
    .related-section{margin:48px 0 0;padding:32px 0 0;border-top:1px solid rgba(255,255,255,0.07);}
    .related-section h3{font-family:'Bebas Neue',sans-serif;font-size:1.5rem;color:#fff;letter-spacing:1px;margin:0 0 20px;}
    .related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
    @media(max-width:700px){.related-grid{grid-template-columns:1fr;}}
    .related-card{background:#111;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px 18px;text-decoration:none;display:block;transition:border-color .2s,transform .2s;}
    .related-card:hover{border-color:rgba(255,140,0,.4);transform:translateY(-2px);}
    .related-card .rc-cat{font-family:'DM Sans',sans-serif;font-size:0.65rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#ff8c00;margin-bottom:6px;}
    .related-card .rc-title{font-family:'DM Sans',sans-serif;font-size:0.88rem;font-weight:700;color:#fff;line-height:1.4;}`;

let relatedUpdated = 0;
Object.entries(relatedMap).forEach(([slug, {cat, related}]) => {
  const artPath = path.join(ROOT, 'Blog', cat, slug, 'index.html');
  if (!fs.existsSync(artPath)) return;
  let html = fs.readFileSync(artPath, 'utf8');
  if (html.includes('related-section')) return; // already added

  // Build related cards HTML
  const cards = related.map(r =>
    `<a href="/Blog/${r.cat}/${r.slug}/" class="related-card"><p class="rc-cat">${r.cat.replace(/-/g,' ')}</p><p class="rc-title">${r.title}</p></a>`
  ).join('\n        ');

  const relatedBlock = `
    <div class="related-section">
      <h3>Related Guides</h3>
      <div class="related-grid">
        ${cards}
      </div>
    </div>`;

  // Inject CSS before </style>
  html = html.replace('</style>', relatedCSS + '\n  </style>');
  // Inject block before </footer>
  html = html.replace('<footer class="site-footer">', relatedBlock + '\n\n<footer class="site-footer">');
  fs.writeFileSync(artPath, html, 'utf8');
  relatedUpdated++;
});
console.log(`  Added related articles to ${relatedUpdated} posts.`);

// ─────────────────────────────────────────────────────────────
// Write all accumulated redirects to netlify.toml
// ─────────────────────────────────────────────────────────────
console.log('\n[redirects] Writing to netlify.toml...');
{
  let toml = read('netlify.toml');
  // Remove old sex-messanger redirect blocks to avoid duplicates
  toml = toml.replace(/\[\[redirects\]\]\n  from   = "\/Sex Messanger[^"]*"[\s\S]*?force  = true\n\n/g, '');

  const newBlocks = redirectsToAdd.map(r => {
    const hasSplat = r.from.endsWith('*');
    return `[[redirects]]\n  from   = "${r.from}"\n  to     = "${hasSplat ? r.to : r.to}"\n  status = 301\n  force  = true`;
  }).join('\n\n');

  // Append before security headers section
  toml = toml.replace('# ── Security headers on every page', newBlocks + '\n\n# ── Security headers on every page');
  write('netlify.toml', toml);
}

console.log('\n✓ fix-all.js complete.\n');
console.log('Next: run build.js to propagate nav to tracked pages, then run git mv commands below:\n');
caseMap.forEach(([old, lc]) => {
  const f = old.replace(/\//g,'');
  console.log(`  git mv "${f}" "_${f}_tmp" && git mv "_${f}_tmp" "${lc.replace(/\//g,'')}"`);
});
