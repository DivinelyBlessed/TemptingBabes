#!/usr/bin/env node
'use strict';
const fs = require('fs');

const catNames = {
  'ai-dating':         'AI Dating',
  'confidence':        'Confidence',
  'dating-advice':     'Dating Advice',
  'dating-apps':       'Dating Apps',
  'dating-psychology': 'Dating Psychology',
  'first-dates':       'First Dates',
  'hookups':           'Hookups',
  'messaging':         'Messaging',
  'profiles':          'Profiles',
  'world-cup':         'World Cup',
};

// ─── 1. SEARCH BAR — Blog/index.html ────────────────────────────────────────

const blogPath = 'Blog/index.html';
let blog = fs.readFileSync(blogPath, 'utf8');

if (blog.includes('id="blogSearch"')) {
  console.log('Search bar already present — skipping Blog/index.html');
} else {
  // CSS — append inside </style>
  const searchCSS = `
    .search-wrap{margin:28px auto 0;max-width:560px;position:relative;}
    .search-wrap input{width:100%;padding:13px 48px 13px 20px;border-radius:50px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:#fff;font-family:'DM Sans',sans-serif;font-size:0.95rem;outline:none;transition:border-color .2s,background .2s;box-sizing:border-box;}
    .search-wrap input::placeholder{color:rgba(240,240,248,0.3);}
    .search-wrap input:focus{border-color:rgba(255,140,0,0.5);background:rgba(255,255,255,0.08);}
    .search-icon{position:absolute;right:18px;top:50%;transform:translateY(-50%);color:rgba(240,240,248,0.3);font-size:1rem;pointer-events:none;}
    .no-results{display:none;text-align:center;padding:60px 24px;color:rgba(240,240,248,0.35);font-family:'DM Sans',sans-serif;font-size:1rem;}
  `;
  blog = blog.replace('  </style>', searchCSS + '  </style>');

  // HTML — after the hero <p>, before </section>
  const searchHTML = `  <div class="search-wrap">
    <input type="search" id="blogSearch" placeholder="Search guides..." autocomplete="off" aria-label="Search articles"/>
    <span class="search-icon">&#9906;</span>
  </div>
</section>
<p class="no-results" id="noResults">No guides found. Try a different search.</p>`;

  blog = blog.replace(
    `<p>Dating guides for men who want results, not relationship counselling.</p>\n</section>`,
    `<p>Dating guides for men who want results, not relationship counselling.</p>\n` + searchHTML
  );

  // JS — before </body>
  const searchJS = `
<script>
(function(){
  var input = document.getElementById('blogSearch');
  var noRes = document.getElementById('noResults');
  if(!input) return;
  input.addEventListener('input', function(){
    var q = input.value.trim().toLowerCase();
    var sections = document.querySelectorAll('.cat-section');
    var anyVisible = false;
    sections.forEach(function(sec){
      var cards = sec.querySelectorAll('.article-card:not(.is-placeholder)');
      var secVisible = false;
      cards.forEach(function(card){
        var text = (card.querySelector('.article-title')||card).textContent.toLowerCase()
                 + ' ' + (card.querySelector('.article-cat-label')||{textContent:''}).textContent.toLowerCase();
        var match = !q || text.includes(q);
        card.style.display = match ? '' : 'none';
        if(match) secVisible = true;
      });
      sec.style.display = secVisible ? '' : 'none';
      if(secVisible) anyVisible = true;
    });
    noRes.style.display = (!q || anyVisible) ? 'none' : 'block';
  });
})();
</script>`;

  blog = blog.replace('</body>', searchJS + '\n</body>');
  fs.writeFileSync(blogPath, blog, 'utf8');
  console.log('✓ Blog/index.html — search bar added');
}

// ─── 2. BREADCRUMBS — all article pages ─────────────────────────────────────

const breadcrumbCSS = `
  .breadcrumb{padding:10px 40px;position:relative;z-index:1;}
  .breadcrumb-inner{max-width:1020px;margin:0 auto;display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
  .breadcrumb a{font-size:0.76rem;color:rgba(240,240,248,0.38);text-decoration:none;transition:color .15s;}
  .breadcrumb a:hover{color:var(--accent);}
  .bc-sep{font-size:0.76rem;color:rgba(240,240,248,0.18);}
  .bc-cur{font-size:0.76rem;color:rgba(240,240,248,0.55);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px;}
  @media(max-width:760px){.breadcrumb{padding:8px 16px;}.bc-cur{max-width:160px;}}
`;

const { execSync } = require('child_process');
const articleFiles = execSync('git ls-files "Blog/*/*/index.html"', { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean);

let fixed = 0;
for (const f of articleFiles) {
  let html = fs.readFileSync(f, 'utf8');

  if (html.includes('class="breadcrumb"')) {
    console.log('  breadcrumb already present —', f);
    continue;
  }

  // Parse path: Blog/{category}/{slug}/index.html
  const parts = f.split('/'); // ['Blog', 'dating-apps', 'average-man...', 'index.html']
  const catSlug   = parts[1];
  const catName   = catNames[catSlug] || catSlug;

  // Extract article title from <title> — strip " | Tempting Babes"
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  let articleTitle = titleMatch ? titleMatch[1].replace(/\s*[|—]\s*Tempting Babes.*$/i, '').trim() : catName;
  if (articleTitle.length > 52) articleTitle = articleTitle.slice(0, 50) + '…';

  // Add CSS inside </style> (first occurrence — the article's own style block)
  html = html.replace('</style>', breadcrumbCSS + '</style>');

  // Build breadcrumb HTML
  const bc = `\n<nav class="breadcrumb" aria-label="Breadcrumb">
  <div class="breadcrumb-inner">
    <a href="/">Home</a>
    <span class="bc-sep">›</span>
    <a href="/Blog/">Blog</a>
    <span class="bc-sep">›</span>
    <a href="/Blog/${catSlug}/">${catName}</a>
    <span class="bc-sep">›</span>
    <span class="bc-cur">${articleTitle}</span>
  </div>
</nav>`;

  // Insert between mobile-menu closing </div> and <div class="hero">
  html = html.replace(/(<\/div>)\s*\n(<div class="hero">)/, `$1${bc}\n$2`);

  fs.writeFileSync(f, html, 'utf8');
  console.log('✓', f);
  fixed++;
}

console.log(`\nDone — breadcrumbs added to ${fixed} article pages.`);
