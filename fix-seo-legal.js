/**
 * fix-seo-legal.js
 * Fixes: logo alt, OG tags on Blog/category pages, 2257 page, cookie consent banner
 * Run: node fix-seo-legal.js
 */

const fs   = require('fs');
const path = require('path');
const ROOT = __dirname;

function read(rel)        { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
function write(rel, data) { fs.writeFileSync(path.join(ROOT, rel), data, 'utf8'); console.log('  wrote:', rel); }
function mkdirp(rel)      { fs.mkdirSync(path.join(ROOT, rel), { recursive: true }); }
function exists(rel)      { return fs.existsSync(path.join(ROOT, rel)); }

// ─────────────────────────────────────────────────────────────
// FIX 1 — Logo alt text in nav partial
// ─────────────────────────────────────────────────────────────
console.log('\n[1] Fixing logo alt text...');
{
  let nav = read('_partials/nav.html');
  if (nav.includes('alt=""')) {
    nav = nav.replace('alt=""', 'alt="Tempting Babes"');
    write('_partials/nav.html', nav);
    console.log('  Logo alt fixed.');
  } else {
    console.log('  Already fixed — skipped.');
  }
}

// ─────────────────────────────────────────────────────────────
// FIX 2 — OG tags on Blog/index.html + all 9 category pages
// ─────────────────────────────────────────────────────────────
console.log('\n[2] Adding OG tags to Blog hub and category pages...');

const ogPages = [
  {
    file: 'Blog/index.html',
    title: 'Dating Advice & Guides for Men | Tempting Babes Blog',
    description: 'Dating playbooks for men who want results. Profiles, messaging, psychology, hookups, AI companions and more.',
    url: 'https://www.temptingbabes.com/Blog/',
    type: 'website',
  },
  {
    file: 'Blog/dating-advice/index.html',
    title: 'Dating Advice — The Attraction Game | Tempting Babes',
    description: 'Battle-tested dating advice for men. Attraction tactics, anti-ghosting strategies, and real-world techniques that actually work.',
    url: 'https://www.temptingbabes.com/Blog/dating-advice/',
    type: 'website',
  },
  {
    file: 'Blog/dating-apps/index.html',
    title: 'Dating Apps Guide — Swipe Game | Tempting Babes',
    description: 'The truth about dating apps — how the algorithm works against you and what to do instead.',
    url: 'https://www.temptingbabes.com/Blog/dating-apps/',
    type: 'website',
  },
  {
    file: 'Blog/profiles/index.html',
    title: 'Profile Optimization for Dating Apps | Tempting Babes',
    description: 'Build a dating profile that actually gets matches. Photo strategy, bio formulas and everything in between.',
    url: 'https://www.temptingbabes.com/Blog/profiles/',
    type: 'website',
  },
  {
    file: 'Blog/messaging/index.html',
    title: 'Online Dating Messaging — Text Game | Tempting Babes',
    description: 'First messages that get replies, conversation techniques that build attraction, and how to avoid being ignored.',
    url: 'https://www.temptingbabes.com/Blog/messaging/',
    type: 'website',
  },
  {
    file: 'Blog/ai-dating/index.html',
    title: 'AI Girlfriends & AI Dating Apps Reviewed | Tempting Babes',
    description: 'Best AI girlfriend apps, virtual companions, and AI dating tools reviewed for 2026.',
    url: 'https://www.temptingbabes.com/Blog/ai-dating/',
    type: 'website',
  },
  {
    file: 'Blog/confidence/index.html',
    title: 'Confidence for Dating — Level Up | Tempting Babes',
    description: 'Build the mindset and presence that attracts women. Practical confidence guides for men.',
    url: 'https://www.temptingbabes.com/Blog/confidence/',
    type: 'website',
  },
  {
    file: 'Blog/hookups/index.html',
    title: 'Hookup Tips & Casual Dating — Fast Lane | Tempting Babes',
    description: 'How to meet women for casual encounters. No-nonsense guides for men who know what they want.',
    url: 'https://www.temptingbabes.com/Blog/hookups/',
    type: 'website',
  },
  {
    file: 'Blog/first-dates/index.html',
    title: 'First Date Tips — Seal the Deal | Tempting Babes',
    description: 'Where to go, what to say, and how to close on a first date. Everything men need to turn a match into a meet.',
    url: 'https://www.temptingbabes.com/Blog/first-dates/',
    type: 'website',
  },
  {
    file: 'Blog/dating-psychology/index.html',
    title: 'Dating Psychology — Attraction & Seduction | Tempting Babes',
    description: 'The psychology behind attraction, desire, and connection. Deep dives into what actually drives women to want you.',
    url: 'https://www.temptingbabes.com/Blog/dating-psychology/',
    type: 'website',
  },
];

const ogImage = 'https://www.temptingbabes.com/Asset/Images/sophie.jpg';

ogPages.forEach(({ file, title, description, url, type }) => {
  if (!exists(file)) { console.log(`  SKIP (not found): ${file}`); return; }
  let html = read(file);
  if (html.includes('<meta property="og:title"')) {
    console.log(`  SKIP (OG exists): ${file}`);
    return;
  }
  const ogBlock = `  <meta property="og:type" content="${type}"/>
  <meta property="og:site_name" content="Tempting Babes"/>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${description}"/>
  <meta property="og:url" content="${url}"/>
  <meta property="og:image" content="${ogImage}"/>
  <meta property="og:image:alt" content="Tempting Babes"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${description}"/>
  <meta name="twitter:image" content="${ogImage}"/>`;

  // Insert before </head> or before first <link rel="preconnect"
  if (html.includes('<link rel="preconnect"')) {
    html = html.replace('<link rel="preconnect"', ogBlock + '\n  <link rel="preconnect"');
  } else {
    html = html.replace('</head>', ogBlock + '\n</head>');
  }
  write(file, html);
});

// ─────────────────────────────────────────────────────────────
// FIX 3 — 18 U.S.C. § 2257 compliance page
// ─────────────────────────────────────────────────────────────
console.log('\n[3] Creating 18 U.S.C. § 2257 compliance page...');
if (!exists('2257')) mkdirp('2257');

const page2257 = `<!DOCTYPE html>
<html lang="en">
<head>
  <script>
    if (!navigator.globalPrivacyControl) {
      var _ga = document.createElement('script');
      _ga.async = true;
      _ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-PL9NPRYWP3';
      document.head.appendChild(_ga);
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-PL9NPRYWP3', { anonymize_ip: true });
    }
  </script>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>18 U.S.C. § 2257 Compliance Statement | Tempting Babes</title>
  <meta name="description" content="18 U.S.C. § 2257 Record-Keeping Requirements Compliance Statement for Tempting Babes."/>
  <meta name="robots" content="noindex, follow"/>
  <link rel="canonical" href="https://www.temptingbabes.com/2257/"/>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap"/>
  <link rel="stylesheet" href="../styles.css"/>
  <script src="../script.js" defer></script>
  <style>
    .policy-wrap {
      max-width: 860px;
      margin: 0 auto;
      padding: 60px 24px 100px;
    }
    .policy-wrap h1 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(2rem, 5vw, 3.5rem);
      color: #fff;
      margin-bottom: 8px;
      letter-spacing: 1px;
    }
    .policy-wrap .policy-date {
      font-size: 0.82rem;
      color: rgba(255,255,255,0.35);
      margin-bottom: 40px;
      display: block;
    }
    .policy-wrap h2 {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.05rem;
      font-weight: 700;
      color: #ff8c00;
      margin: 36px 0 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .policy-wrap p, .policy-wrap li {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      color: rgba(255,255,255,0.75);
      line-height: 1.8;
      margin-bottom: 14px;
    }
    .policy-wrap ul { padding-left: 20px; }
    .policy-wrap a { color: #ff8c00; }
    .policy-notice {
      background: rgba(255,140,0,0.08);
      border: 1px solid rgba(255,140,0,0.2);
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 32px;
    }
    .policy-notice p { margin: 0; color: rgba(255,255,255,0.6); font-size: 0.88rem; }
  </style>
</head>
<body>

<!-- NAV PLACEHOLDER — replaced by build.js -->
<nav>
  <a class="logo" href="/"><img src="/Asset/Logo/logo.webp" alt="Tempting Babes" class="logo-img" style="height:42px;width:auto;flex-shrink:0;display:block;"><span class="logo-text" style="font-family:'Playfair Display',serif;font-weight:900;font-size:1.35rem;line-height:1;letter-spacing:1.5px;background:linear-gradient(90deg,#ff8c00,#ff3d6b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-left:-10px;">Tempting Babes</span></a>
  <div class="tabs">
    <a href="/ai-chat/" class="tab">AI Chat</a>
    <a href="/cams/" class="tab">Cams</a>
    <a href="/dating/" class="tab">Dating</a>
    <a href="/offers/" class="tab">Offers</a>
    <a href="/trending/" class="tab">Trending</a>
    <a href="/new/" class="tab"><span class="tab-star">⭐</span>VIP</a>
  </div>
  <button class="join-btn" id="getAccessBtn" style="background:linear-gradient(135deg,#ff8c00,#ff3d6b);">Join Free</button>
  <button class="menu-btn" id="menuBtn">&#9776;</button>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="/ai-chat/" class="mobile-tab">AI Chat</a>
  <a href="/cams/" class="mobile-tab">Cams</a>
  <a href="/dating/" class="mobile-tab">Dating</a>
  <a href="/offers/" class="mobile-tab">Offers</a>
  <a href="/trending/" class="mobile-tab">Trending</a>
  <a href="/new/" class="mobile-tab"><span class="tab-star">⭐</span>VIP</a>
</div>

<div class="policy-wrap">

  <h1>18 U.S.C. § 2257 Compliance Statement</h1>
  <span class="policy-date">Last updated: May 2026</span>

  <div class="policy-notice">
    <p><strong>Important:</strong> Tempting Babes is an affiliate marketing website. We do not produce, host, or distribute sexually explicit content. All content accessible through this site is hosted and managed by third-party platforms. The § 2257 compliance responsibility for such content rests entirely with those primary producers.</p>
  </div>

  <h2>Nature of This Website</h2>
  <p>Tempting Babes (temptingbabes.com) operates as an affiliate directory and referral platform. This website contains links to third-party adult content platforms and dating services. We are a secondary producer only — we do not create, film, photograph, or otherwise produce any sexually explicit visual content.</p>

  <h2>Third-Party Content</h2>
  <p>Any sexually explicit visual content accessible via links on this website is produced by and hosted on third-party platforms. These platforms are the primary producers of such content and are solely responsible for maintaining the records required under 18 U.S.C. § 2257 and 28 C.F.R. § 75.</p>
  <p>Users accessing explicit content through links on this site will be redirected to third-party platforms that operate in compliance with applicable law. The custodian of records for content on those platforms is the respective platform operator.</p>

  <h2>Non-Explicit Content Produced by This Site</h2>
  <p>Any original written content, articles, blog posts, or marketing copy produced by Tempting Babes does not constitute sexually explicit conduct as defined under 18 U.S.C. § 2256(2). Accordingly, we are not required to maintain § 2257 records for such content.</p>

  <h2>Exemption Basis</h2>
  <p>Tempting Babes claims exemption from the record-keeping requirements of 18 U.S.C. § 2257 on the following basis:</p>
  <ul>
    <li>We do not produce, direct, manufacture, issue, or publish any sexually explicit visual content as defined under 18 U.S.C. § 2256(2).</li>
    <li>We are a secondary producer under the definition of 28 C.F.R. § 75.1(c)(2).</li>
    <li>All explicit visual content accessible through outbound links is the sole responsibility of the primary producers operating on third-party platforms.</li>
  </ul>

  <h2>Compliance by Third-Party Platforms</h2>
  <p>The third-party platforms to which this site links maintain their own § 2257 records in compliance with federal law. Users are encouraged to review the § 2257 statements of any third-party platform they access.</p>

  <h2>Contact</h2>
  <p>For questions or concerns related to this compliance statement, please contact us via our <a href="/contact/">contact page</a>.</p>

</div>

<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <div class="footer-logo">Tempting Babes</div>
      <p class="footer-tagline">Your all-in-one hub for Dating, Live Cams, AI Girls and VIP access. Built for real connections and instant interaction.</p>
    </div>
    <div class="footer-col">
      <h4 class="footer-col-title">Explore</h4>
      <ul class="footer-links">
        <li><a href="/Blog/">Blog</a></li>
        <li><a href="/world-cup/">FIFA World Cup 2026</a></li>
        <li><a href="/ways-to-meet/">Ways to Meet</a></li>
        <li><a href="/popular/">Popular Girls</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4 class="footer-col-title">Legal &amp; Info</h4>
      <ul class="footer-links">
        <li><a href="/about/">About</a></li>
        <li><a href="/privacy-policy/">Privacy Policy</a></li>
        <li><a href="/terms/">Terms of Service</a></li>
        <li><a href="/dmca/">DMCA Policy</a></li>
        <li><a href="/2257/">18 U.S.C. § 2257</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>18+ Only &nbsp;&middot;&nbsp; All rights reserved &nbsp;&middot;&nbsp; Tempting Babes&copy; 2026</p>
  </div>
</footer>

</body>
</html>`;

write('2257/index.html', page2257);

// ─────────────────────────────────────────────────────────────
// FIX 4 — Cookie consent banner + add 2257 link to footer partial
// ─────────────────────────────────────────────────────────────
console.log('\n[4] Adding cookie consent banner and 2257 link to footer partial...');

const cookieBannerHTML = `
<!-- COOKIE CONSENT BANNER -->
<div id="cookieBanner" style="display:none;position:fixed;bottom:0;left:0;right:0;z-index:9999;background:rgba(10,10,10,0.97);border-top:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(20px);padding:16px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
  <p style="font-family:'DM Sans',sans-serif;font-size:0.82rem;color:rgba(255,255,255,0.6);margin:0;flex:1;min-width:200px;">
    We use cookies to analyse traffic and improve your experience. By continuing you consent to our use of cookies. <a href="/privacy-policy/" style="color:#ff8c00;text-decoration:none;">Privacy Policy</a>
  </p>
  <div style="display:flex;gap:10px;flex-shrink:0;">
    <button id="cookieDecline" style="font-family:'DM Sans',sans-serif;font-size:0.78rem;font-weight:600;padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.5);cursor:pointer;">Essential Only</button>
    <button id="cookieAccept" style="font-family:'DM Sans',sans-serif;font-size:0.78rem;font-weight:700;padding:8px 20px;border-radius:8px;border:none;background:linear-gradient(135deg,#ff8c00,#ff3d6b);color:#fff;cursor:pointer;">Accept All</button>
  </div>
</div>
<script>
(function(){
  var CONSENT_KEY = 'tb_cookie_consent';
  var banner = document.getElementById('cookieBanner');
  if (!banner) return;
  var stored = localStorage.getItem(CONSENT_KEY);
  if (!stored) { banner.style.display = 'flex'; }
  document.getElementById('cookieAccept').addEventListener('click', function(){
    localStorage.setItem(CONSENT_KEY, 'all');
    banner.style.display = 'none';
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' });
    }
  });
  document.getElementById('cookieDecline').addEventListener('click', function(){
    localStorage.setItem(CONSENT_KEY, 'essential');
    banner.style.display = 'none';
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied' });
    }
  });
})();
</script>`;

{
  let footer = read('_partials/footer.html');

  // Add 2257 link if not present
  if (!footer.includes('2257')) {
    footer = footer.replace(
      '<li><a href="/contact/">Contact</a></li>',
      '<li><a href="/2257/">18 U.S.C. § 2257</a></li>\n        <li><a href="/contact/">Contact</a></li>'
    );
  }

  // Add cookie banner before closing </footer> tag
  if (!footer.includes('cookieBanner')) {
    footer = footer.replace('</footer>', cookieBannerHTML + '\n</footer>');
  }

  write('_partials/footer.html', footer);
}

// ─────────────────────────────────────────────────────────────
// Update sitemap.xml — add 2257 page
// ─────────────────────────────────────────────────────────────
console.log('\n[5] Adding 2257 to sitemap...');
{
  let sitemap = read('sitemap.xml');
  if (!sitemap.includes('/2257/')) {
    sitemap = sitemap.replace(
      '<url><loc>https://www.temptingbabes.com/privacy-policy/',
      '<url><loc>https://www.temptingbabes.com/2257/</loc><lastmod>2026-05-12</lastmod><changefreq>yearly</changefreq><priority>0.2</priority></url>\n\n  <url><loc>https://www.temptingbabes.com/privacy-policy/'
    );
    write('sitemap.xml', sitemap);
  }
}

console.log('\n✓ fix-seo-legal.js complete. Now run: node build.js\n');
