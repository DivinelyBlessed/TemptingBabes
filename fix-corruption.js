/**
 * fix-corruption.js
 * - Extracts the deepest clean copy from each corrupted article (strips all $inner = nesting)
 * - Fixes canonical/og:url for articles that were moved to a new category
 * - Fixes cookie banner display:none vs display:flex conflict in footer partial
 * Run: node fix-corruption.js  →  then node build.js
 */

const fs   = require('fs');
const path = require('path');
const ROOT = __dirname;

// ─────────────────────────────────────────────────────────────
// 1. Fix cookie banner in footer partial (display:none conflict)
// ─────────────────────────────────────────────────────────────
console.log('[1] Fixing cookie banner display conflict in footer partial...');
{
  const fp = path.join(ROOT, '_partials/footer.html');
  let footer = fs.readFileSync(fp, 'utf8');
  // Remove the duplicate display:flex that overrides display:none
  // Current: style="display:none;...;display:flex;align-items:..."
  // Fix:     style="display:none;...;align-items:..."  (JS sets display:flex when needed)
  const fixed = footer.replace(
    /(<div id="cookieBanner" style=")display:none;(.*?);display:flex;(align-items)/,
    '$1display:none;$2;$3'
  );
  if (fixed !== footer) {
    fs.writeFileSync(fp, fixed, 'utf8');
    console.log('  Cookie banner display conflict fixed.');
  } else {
    console.log('  Already fixed or pattern not matched — skipping.');
  }
}

// ─────────────────────────────────────────────────────────────
// 2. Strip $inner corruption from all 17 article pages
// ─────────────────────────────────────────────────────────────
console.log('\n[2] Extracting clean content from corrupted articles...');

// Correct canonical base URLs for each article
const canonicalMap = {
  'talking-to-ai-companion':                         '/Blog/ai-dating/talking-to-ai-companion/',
  'ai-chat-men-over-30':                             '/Blog/ai-dating/ai-chat-men-over-30/',
  'ai-girlfriend-apps-ranked-2026':                  '/Blog/ai-dating/ai-girlfriend-apps-ranked-2026/',
  'dating-apps-designed-to-keep-you-single':        '/Blog/dating-apps/dating-apps-designed-to-keep-you-single/',
  'average-man-dating-app-stats':                   '/Blog/dating-apps/average-man-dating-app-stats/',
  'doom-scrolling-vs-connecting':                    '/Blog/dating-psychology/doom-scrolling-vs-connecting/',
  'midnight-ache-scrolling-loneliness':              '/Blog/dating-psychology/midnight-ache-scrolling-loneliness/',
  '3am-loneliness-brain':                            '/Blog/dating-psychology/3am-loneliness-brain/',
  'lonely-weekends':                                 '/Blog/dating-psychology/lonely-weekends/',
  'what-women-want-first-message':                   '/Blog/messaging/what-women-want-first-message/',
  'start-conversation-online-without-being-ignored': '/Blog/messaging/start-conversation-online-without-being-ignored/',
  'find-active-women-online-near-you':               '/Blog/dating-advice/find-active-women-online-near-you/',
  'no-matches-tinder-real-reason':                   '/Blog/dating-advice/no-matches-tinder-real-reason/',
  'why-women-dont-reply-dating-apps':                '/Blog/dating-advice/why-women-dont-reply-dating-apps/',
  'low-social-circle-meet-women':                    '/Blog/dating-advice/low-social-circle-meet-women/',
  'matching-vs-connecting':                          '/Blog/dating-advice/matching-vs-connecting/',
  'no-social-circle-get-matched':                    '/Blog/dating-advice/no-social-circle-get-matched/',
};

const corruptedFiles = [
  'Blog/messaging/what-women-want-first-message/index.html',
  'Blog/messaging/start-conversation-online-without-being-ignored/index.html',
  'Blog/dating-psychology/midnight-ache-scrolling-loneliness/index.html',
  'Blog/dating-psychology/lonely-weekends/index.html',
  'Blog/dating-psychology/doom-scrolling-vs-connecting/index.html',
  'Blog/dating-psychology/3am-loneliness-brain/index.html',
  'Blog/dating-apps/dating-apps-designed-to-keep-you-single/index.html',
  'Blog/dating-apps/average-man-dating-app-stats/index.html',
  'Blog/dating-advice/why-women-dont-reply-dating-apps/index.html',
  'Blog/dating-advice/no-social-circle-get-matched/index.html',
  'Blog/dating-advice/no-matches-tinder-real-reason/index.html',
  'Blog/dating-advice/matching-vs-connecting/index.html',
  'Blog/dating-advice/low-social-circle-meet-women/index.html',
  'Blog/dating-advice/find-active-women-online-near-you/index.html',
  'Blog/ai-dating/talking-to-ai-companion/index.html',
  'Blog/ai-dating/ai-girlfriend-apps-ranked-2026/index.html',
  'Blog/ai-dating/ai-chat-men-over-30/index.html',
];

const MARKER = '$inner = <!DOCTYPE html>';

corruptedFiles.forEach(rel => {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) { console.log('  SKIP (not found):', rel); return; }

  let html = fs.readFileSync(fp, 'utf8');

  // Find the LAST occurrence of the corruption marker — that's the deepest (cleanest) copy
  const lastIdx = html.lastIndexOf(MARKER);
  if (lastIdx === -1) { console.log('  SKIP (no corruption):', rel); return; }

  // Extract from '<!DOCTYPE html>' right after the last marker
  let clean = '<!DOCTYPE html>' + html.slice(lastIdx + MARKER.length);

  // Truncate at the last </html> to remove any CSS tail content
  const lastHtmlTag = clean.lastIndexOf('</html>');
  if (lastHtmlTag !== -1) {
    clean = clean.slice(0, lastHtmlTag + 7);
  }

  // Fix canonical URL and og:url based on current file path
  const slug = rel.split('/').slice(-2)[0]; // e.g. 'average-man-dating-app-stats'
  const correctPath = canonicalMap[slug];
  if (correctPath) {
    const base = 'https://www.temptingbabes.com';
    clean = clean.replace(
      /<link rel="canonical" href="[^"]*"\/>/,
      `<link rel="canonical" href="${base}${correctPath}"/>`
    );
    clean = clean.replace(
      /<meta property="og:url" content="[^"]*"\/>/,
      `<meta property="og:url" content="${base}${correctPath}"/>`
    );
  }

  fs.writeFileSync(fp, clean, 'utf8');
  console.log('  Fixed:', rel);
});

// ─────────────────────────────────────────────────────────────
// 3. Re-add related articles section to all 17 articles
//    (the deepest clean copy won't have it — it predates fix-all.js)
// ─────────────────────────────────────────────────────────────
console.log('\n[3] Re-adding related articles section...');

const relatedMap = {
  'find-active-women-online-near-you':    { cat: 'dating-advice', related: [{ slug: 'no-matches-tinder-real-reason', title: 'No Matches on Tinder? The Real Reason', cat: 'dating-advice' }, { slug: 'why-women-dont-reply-dating-apps', title: "Why Women Don't Reply on Dating Apps", cat: 'dating-advice' }, { slug: 'dating-apps-designed-to-keep-you-single', title: 'Are Dating Apps Designed to Keep You Single?', cat: 'dating-apps' }] },
  'matching-vs-connecting':               { cat: 'dating-advice', related: [{ slug: 'find-active-women-online-near-you', title: 'How to Find Active Women Online Near You', cat: 'dating-advice' }, { slug: 'doom-scrolling-vs-connecting', title: 'Doom Scrolling vs. Actually Connecting', cat: 'dating-psychology' }, { slug: 'what-women-want-first-message', title: 'What Women Actually Want in a First Message', cat: 'messaging' }] },
  'low-social-circle-meet-women':         { cat: 'dating-advice', related: [{ slug: 'find-active-women-online-near-you', title: 'How to Find Active Women Online Near You', cat: 'dating-advice' }, { slug: 'dating-apps-designed-to-keep-you-single', title: 'Are Dating Apps Designed to Keep You Single?', cat: 'dating-apps' }, { slug: 'start-conversation-online-without-being-ignored', title: 'How to Start a Conversation Online Without Being Ignored', cat: 'messaging' }] },
  'no-matches-tinder-real-reason':        { cat: 'dating-advice', related: [{ slug: 'why-women-dont-reply-dating-apps', title: "Why Women Don't Reply on Dating Apps", cat: 'dating-advice' }, { slug: 'average-man-dating-app-stats', title: "The Average Man's Dating App Stats", cat: 'dating-apps' }, { slug: 'dating-apps-designed-to-keep-you-single', title: 'Are Dating Apps Designed to Keep You Single?', cat: 'dating-apps' }] },
  'why-women-dont-reply-dating-apps':     { cat: 'dating-advice', related: [{ slug: 'no-matches-tinder-real-reason', title: 'No Matches on Tinder? The Real Reason', cat: 'dating-advice' }, { slug: 'what-women-want-first-message', title: 'What Women Actually Want in a First Message', cat: 'messaging' }, { slug: 'doom-scrolling-vs-connecting', title: 'Doom Scrolling vs. Actually Connecting', cat: 'dating-psychology' }] },
  'no-social-circle-get-matched':         { cat: 'dating-advice', related: [{ slug: 'low-social-circle-meet-women', title: 'Low Social Circle? How to Meet Women Anyway', cat: 'dating-advice' }, { slug: 'find-active-women-online-near-you', title: 'How to Find Active Women Online Near You', cat: 'dating-advice' }, { slug: 'dating-apps-designed-to-keep-you-single', title: 'Are Dating Apps Designed to Keep You Single?', cat: 'dating-apps' }] },
  'dating-apps-designed-to-keep-you-single': { cat: 'dating-apps', related: [{ slug: 'average-man-dating-app-stats', title: "The Average Man's Dating App Stats", cat: 'dating-apps' }, { slug: 'no-matches-tinder-real-reason', title: 'No Matches on Tinder? The Real Reason', cat: 'dating-advice' }, { slug: 'ai-girlfriend-apps-ranked-2026', title: 'AI Girlfriend Apps Ranked 2026', cat: 'ai-dating' }] },
  'average-man-dating-app-stats':         { cat: 'dating-apps', related: [{ slug: 'dating-apps-designed-to-keep-you-single', title: 'Are Dating Apps Designed to Keep You Single?', cat: 'dating-apps' }, { slug: 'no-matches-tinder-real-reason', title: 'No Matches on Tinder? The Real Reason', cat: 'dating-advice' }, { slug: 'what-women-want-first-message', title: 'What Women Actually Want in a First Message', cat: 'messaging' }] },
  'what-women-want-first-message':        { cat: 'messaging', related: [{ slug: 'start-conversation-online-without-being-ignored', title: 'How to Start a Conversation Online Without Being Ignored', cat: 'messaging' }, { slug: 'why-women-dont-reply-dating-apps', title: "Why Women Don't Reply on Dating Apps", cat: 'dating-advice' }, { slug: 'matching-vs-connecting', title: 'Matching vs. Actually Connecting', cat: 'dating-advice' }] },
  'start-conversation-online-without-being-ignored': { cat: 'messaging', related: [{ slug: 'what-women-want-first-message', title: 'What Women Actually Want in a First Message', cat: 'messaging' }, { slug: 'no-matches-tinder-real-reason', title: 'No Matches on Tinder? The Real Reason', cat: 'dating-advice' }, { slug: 'doom-scrolling-vs-connecting', title: 'Doom Scrolling vs. Actually Connecting', cat: 'dating-psychology' }] },
  'talking-to-ai-companion':              { cat: 'ai-dating', related: [{ slug: 'ai-chat-men-over-30', title: 'AI Chat for Men Over 30 — Is It Worth Your Time?', cat: 'ai-dating' }, { slug: 'ai-girlfriend-apps-ranked-2026', title: 'AI Girlfriend Apps Ranked 2026', cat: 'ai-dating' }, { slug: 'doom-scrolling-vs-connecting', title: 'Doom Scrolling vs. Actually Connecting', cat: 'dating-psychology' }] },
  'ai-chat-men-over-30':                  { cat: 'ai-dating', related: [{ slug: 'talking-to-ai-companion', title: 'What Talking to an AI Companion Actually Feels Like', cat: 'ai-dating' }, { slug: 'ai-girlfriend-apps-ranked-2026', title: 'AI Girlfriend Apps Ranked 2026', cat: 'ai-dating' }, { slug: 'midnight-ache-scrolling-loneliness', title: 'The Midnight Ache: Why You Scroll Instead of Connect', cat: 'dating-psychology' }] },
  'ai-girlfriend-apps-ranked-2026':       { cat: 'ai-dating', related: [{ slug: 'talking-to-ai-companion', title: 'What Talking to an AI Companion Actually Feels Like', cat: 'ai-dating' }, { slug: 'ai-chat-men-over-30', title: 'AI Chat for Men Over 30 — Is It Worth Your Time?', cat: 'ai-dating' }, { slug: 'dating-apps-designed-to-keep-you-single', title: 'Are Dating Apps Designed to Keep You Single?', cat: 'dating-apps' }] },
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

let relatedAdded = 0;
corruptedFiles.forEach(rel => {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('related-section')) return;

  const slug = rel.split('/').slice(-2)[0];
  const entry = relatedMap[slug];
  if (!entry) return;

  const cards = entry.related.map(r =>
    `<a href="/Blog/${r.cat}/${r.slug}/" class="related-card"><p class="rc-cat">${r.cat.replace(/-/g,' ')}</p><p class="rc-title">${r.title}</p></a>`
  ).join('\n        ');

  const relatedBlock = `
    <div class="related-section">
      <h3>Related Guides</h3>
      <div class="related-grid">
        ${cards}
      </div>
    </div>`;

  html = html.replace('</style>', relatedCSS + '\n  </style>');
  html = html.replace('<footer class="site-footer">', relatedBlock + '\n\n<footer class="site-footer">');
  fs.writeFileSync(fp, html, 'utf8');
  relatedAdded++;
});
console.log(`  Related articles added to ${relatedAdded} posts.`);

console.log('\n✓ Done. Now run: node build.js\n');
