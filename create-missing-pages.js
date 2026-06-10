const fs = require('fs');
const path = require('path');

const SITE_DIR = 'C:\\Users\\Hp\\OneDrive\\Desktop\\Tempting Babes\\world-cup';

const PAGES = [
  {
    slug: 'best-defender',
    title: 'Best Defender World Cup 2026 — Top Centre-Backs & Full-Backs',
    description: 'Who is the best defender at World Cup 2026? Rankings, stats and analysis of every top centre-back and full-back at the tournament.',
    eyebrow: '🛡️ Best Defender · FIFA World Cup 2026',
    h1a: 'Best',
    h1b: 'Defender',
    sub: 'Who shuts everything down at World Cup 2026? The centre-backs and full-backs making the difference — ranked by performance, stats and impact across the tournament.',
  },
  {
    slug: 'best-forward',
    title: 'Best Forward World Cup 2026 — Top Strikers & Wingers Ranked',
    description: 'The best forwards and strikers at World Cup 2026 — ranked by goals, assists and match-winning performances across the tournament.',
    eyebrow: '⚡ Best Forward · FIFA World Cup 2026',
    h1a: 'Best',
    h1b: 'Forward',
    sub: 'Goals, assists, moments of magic — the strikers and wingers making the biggest impact at World Cup 2026. Updated after every matchday.',
  },
  {
    slug: 'best-goalkeeper',
    title: 'Best Goalkeeper World Cup 2026 — Golden Glove Contenders',
    description: 'Who is the best goalkeeper at World Cup 2026? Golden Glove contenders ranked by saves, clean sheets and match-defining performances.',
    eyebrow: '🧤 Best Goalkeeper · FIFA World Cup 2026',
    h1a: 'Best',
    h1b: 'Goalkeeper',
    sub: 'The last line of defence at the biggest tournament in history. Golden Glove contenders ranked by saves, clean sheets and the moments that kept their nations alive.',
  },
  {
    slug: 'best-midfielder',
    title: 'Best Midfielder World Cup 2026 — Top Playmakers Ranked',
    description: 'The best midfielders at World Cup 2026 — playmakers, box-to-box powerhouses and holding specialists ranked by tournament impact.',
    eyebrow: '⚙️ Best Midfielder · FIFA World Cup 2026',
    h1a: 'Best',
    h1b: 'Midfielder',
    sub: 'The engine rooms of World Cup 2026. Playmakers, ball-winners and box-to-box midfielders — ranked by their impact on the biggest stage in football.',
  },
  {
    slug: 'best-player',
    title: 'Best Player World Cup 2026 — Golden Ball Contenders',
    description: 'Who is the best player at World Cup 2026? Golden Ball contenders ranked — the tournament\'s standout performers updated after every round.',
    eyebrow: '🏆 Best Player · FIFA World Cup 2026',
    h1a: 'Best',
    h1b: 'Player',
    sub: 'One tournament. One trophy. Who is the best player at World Cup 2026? Golden Ball contenders ranked by performance, impact and the moments that define careers.',
  },
  {
    slug: 'coaches',
    title: 'World Cup 2026 Coaches — All 48 Managers & Tactics',
    description: 'Every World Cup 2026 manager profiled — tactical style, record, key players and chances of going all the way. All 48 coaches ranked.',
    eyebrow: '📋 Coaches · FIFA World Cup 2026',
    h1a: 'World Cup',
    h1b: 'Coaches',
    sub: 'The men in the dugout at World Cup 2026. All 48 managers profiled — their system, their record, their star players and their realistic chances of lifting the trophy on July 19.',
  },
  {
    slug: 'golden-boot',
    title: 'World Cup 2026 Golden Boot — Top Scorers & Goals Race',
    description: 'Live World Cup 2026 Golden Boot standings. Top scorers updated after every match — goals, assists and who is leading the race for the top scorer award.',
    eyebrow: '👟 Golden Boot · FIFA World Cup 2026',
    h1a: 'Golden',
    h1b: 'Boot',
    sub: 'Who scores the most goals at World Cup 2026? Live Golden Boot standings updated after every match. The race for the top scorer award starts June 11.',
  },
  {
    slug: 'golden-glove',
    title: 'World Cup 2026 Golden Glove — Best Goalkeeper Award Race',
    description: 'World Cup 2026 Golden Glove contenders — the best goalkeepers at the tournament ranked by saves, clean sheets and match-winning performances.',
    eyebrow: '🧤 Golden Glove · FIFA World Cup 2026',
    h1a: 'Golden',
    h1b: 'Glove',
    sub: 'The Golden Glove goes to the best goalkeeper at World Cup 2026. Contenders ranked by saves, clean sheets and the performances that keep nations in the tournament.',
  },
  {
    slug: 'referees',
    title: 'World Cup 2026 Referees — Officials, VAR & Match Appointments',
    description: 'Every referee at World Cup 2026 — match appointments, VAR officials, controversial decisions and the officials running the biggest games.',
    eyebrow: '🟨 Referees · FIFA World Cup 2026',
    h1a: 'World Cup',
    h1b: 'Referees',
    sub: 'The officials running World Cup 2026 — match appointments, VAR rulings and the referees at the centre of the tournament\'s biggest moments and controversies.',
  },
  {
    slug: 'top-scorers',
    title: 'World Cup 2026 Top Scorers — Goals, Assists & Stats',
    description: 'Live World Cup 2026 top scorers table. Goals and assists updated after every match — who leads the scoring charts at the biggest World Cup ever.',
    eyebrow: '⚽ Top Scorers · FIFA World Cup 2026',
    h1a: 'Top',
    h1b: 'Scorers',
    sub: 'Live World Cup 2026 top scorers. Goals and assists updated after every match across all 104 games — from the group stage opener to the final at MetLife Stadium.',
  },
  {
    slug: 'young-player-award',
    title: 'World Cup 2026 Young Player Award — Best Under-21 Contenders',
    description: 'World Cup 2026 Young Player Award contenders — the best under-21 talents at the tournament and who is favourite to win the award.',
    eyebrow: '🌟 Young Player Award · FIFA World Cup 2026',
    h1a: 'Young Player',
    h1b: 'Award',
    sub: 'The next generation takes the World Cup 2026 stage. Young Player Award contenders — the under-21 talents turning heads and making the case for the tournament\'s breakout star.',
  },
];

function buildPage(p) {
  const canonicalPath = `/world-cup/${p.slug}/`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<script>if(!navigator.globalPrivacyControl){var _ga=document.createElement('script');_ga.async=true;_ga.src='https://www.googletagmanager.com/gtag/js?id=G-PL9NPRYWP3';document.head.appendChild(_ga);window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-PL9NPRYWP3',{anonymize_ip:true});}</script>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${p.title} | Tempting Babes</title>
<meta name="description" content="${p.description}"/>
<meta name="robots" content="index, follow"/>
<link rel="canonical" href="https://www.temptingbabes.com${canonicalPath}"/>
<link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="${p.title}"/>
<meta property="og:description" content="${p.description}"/>
<meta property="og:url" content="https://www.temptingbabes.com${canonicalPath}"/>
<meta property="og:image" content="https://www.temptingbabes.com/Asset/Images/sophie.jpg"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="../../styles.css"/><script src="../../script.js" defer></script>
<style>
:root{--wc-orange:#ff8c00;--wc-pink:#ff3d6b;--wc-grad:linear-gradient(135deg,#ff8c00,#ff3d6b);}
.pg-hero{position:relative;overflow:hidden;padding:88px 24px 80px;text-align:center;background:linear-gradient(180deg,rgba(6,6,10,0.72) 0%,rgba(10,10,10,0.85) 100%),url('https://pub-8ec39968108e49b79a06aa21a79210e6.r2.dev/3KP%20(1).jpg') center top/cover no-repeat;border-bottom:1px solid rgba(255,140,0,0.15);contain:paint;}
.pg-hero-glow{position:absolute;inset:0;pointer-events:none;}
.pg-hero-glow::before{content:'';position:absolute;width:700px;height:400px;top:-80px;left:50%;transform:translateX(-50%);background:radial-gradient(ellipse,rgba(255,140,0,0.18) 0%,transparent 65%);filter:blur(70px);}
.pg-inner{position:relative;z-index:1;max-width:820px;margin:0 auto;}
.pg-eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:'DM Sans',sans-serif;font-size:0.7rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--wc-orange);border:1px solid rgba(255,140,0,0.35);padding:6px 18px;border-radius:50px;margin-bottom:22px;background:rgba(255,140,0,0.06);}
.pg-h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(3rem,9vw,6rem);line-height:0.93;color:#fff;margin-bottom:18px;}
.pg-h1 span{background:var(--wc-grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.pg-sub{font-family:'DM Sans',sans-serif;font-size:clamp(0.9rem,2vw,1.05rem);color:rgba(255,255,255,0.65);max-width:600px;margin:0 auto 36px;line-height:1.75;}
.pg-cta{display:inline-flex;align-items:center;gap:8px;font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:700;padding:14px 32px;border-radius:50px;background:var(--wc-grad);color:#fff;text-decoration:none;box-shadow:0 6px 24px rgba(255,61,107,0.35);transition:opacity .2s,transform .2s;}
.pg-cta:hover{opacity:.9;transform:translateY(-2px);}
.pg-content{max-width:1100px;margin:0 auto;padding:56px 24px;}
.pg-section-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(1.8rem,4vw,2.8rem);color:#fff;margin-bottom:16px;text-align:center;}
.pg-section-label{font-family:'DM Sans',sans-serif;font-size:0.68rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--wc-orange);margin-bottom:8px;text-align:center;display:block;}
.pg-body{font-family:'DM Sans',sans-serif;font-size:0.97rem;color:rgba(255,255,255,0.65);line-height:1.82;margin-bottom:20px;}
.pg-divider{border:none;border-top:1px solid rgba(255,255,255,0.06);margin:48px 0;}
</style>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "${p.title}",
  "description": "${p.description}",
  "url": "https://www.temptingbabes.com${canonicalPath}",
  "publisher": {"@type": "Organization", "name": "Tempting Babes", "url": "https://www.temptingbabes.com"}
}
</script>
</head>
<body>
<nav>
  <a class="logo" href="/"><img src="/Asset/Logo/logo.webp" alt="Tempting Babes" class="logo-img" style="height:42px;width:auto;flex-shrink:0;display:block;"><span class="logo-text" style="font-family:'Playfair Display',serif;font-weight:900;font-size:1.35rem;line-height:1;letter-spacing:1.5px;background:linear-gradient(90deg,#ff8c00,#ff3d6b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-left:-10px;">Tempting Babes</span></a>
  <div class="tabs">
    <a href="/ai-chat/" class="tab">AI Girls</a>
    <a href="/cams/" class="tab">Cams</a>
    <a href="/dating/" class="tab">Dating</a>
    <a href="/offers/" class="tab">Offers</a>
    <a href="/trending/" class="tab">Trending</a>
    <a href="/vip/" class="tab"><span class="tab-star">⭐</span>VIP</a>
  </div>
  <a href="http://refpa30902.com/L?tag=d_5662146m_65195c_&site=5662146&ad=65195" class="join-btn" id="getAccessBtn" style="background:linear-gradient(135deg,#ff8c00,#ff3d6b);text-decoration:none;" target="_blank" rel="noopener">Join Free</a>
  <button class="menu-btn" id="menuBtn">&#9776;</button>
</nav>
<script>(function(){var t=document.querySelectorAll('nav .tab'),x=parseFloat(sessionStorage.getItem('tb_mx')||''),y=parseFloat(sessionStorage.getItem('tb_my')||'');if(x&&y)t.forEach(function(tab){var r=tab.getBoundingClientRect();tab.classList.toggle('hovered',x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom);});}());</script>
<div class="mobile-menu" id="mobileMenu">
  <a href="/ai-chat/" class="mobile-tab">AI Girls</a>
  <a href="/cams/" class="mobile-tab">Cams</a>
  <a href="/dating/" class="mobile-tab">Dating</a>
  <a href="/offers/" class="mobile-tab">Offers</a>
  <a href="/trending/" class="mobile-tab">Trending</a>
  <a href="/vip/" class="mobile-tab"><span class="tab-star">⭐</span>VIP</a>
</div>

<section class="pg-hero">
  <div class="pg-hero-glow"></div>
  <div class="pg-inner">
    <div class="pg-eyebrow">${p.eyebrow}</div>
    <h1 class="pg-h1">${p.h1a} <span>${p.h1b}</span></h1>
    <p class="pg-sub">${p.sub}</p>
    <a href="http://refpa30902.com/L?tag=d_5662146m_65195c_&site=5662146&ad=65195" class="pg-cta" target="_blank" rel="noopener">Get Access &#x2192;</a>
  </div>
</section>

<div class="pg-content">
  <p class="pg-body">Content coming soon. Check back after the next matchday for updated stats and analysis.</p>
</div>

<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <a href="/" class="footer-logo" style="text-decoration:none;">Tempting Babes</a>
      <p class="footer-tagline">Your all-in-one hub for AI Girls, Dating,<br>Live-cams, and VIP access.</p>
    </div>
    <div class="footer-col">
      <h4 class="footer-col-title">Legal &amp; Info</h4>
      <ul class="footer-links">
        <li><a href="/about/">About</a></li>
        <li><a href="/privacy-policy/">Privacy Policy</a></li>
        <li><a href="/terms/">Terms of Service</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4 class="footer-col-title">World Cup</h4>
      <ul class="footer-links">
        <li><a href="/world-cup/">Hub</a></li>
        <li><a href="/world-cup/teams/">All Teams</a></li>
        <li><a href="/world-cup/predictions/">Predictions</a></li>
        <li><a href="/world-cup/fixtures/">Fixtures</a></li>
      </ul>
    </div>
  </div>
</footer>
</body>
</html>`;
}

let created = 0;
PAGES.forEach(p => {
  const dir = path.join(SITE_DIR, p.slug);
  const file = path.join(dir, 'index.html');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, buildPage(p), 'utf8');
  console.log(`CREATED  /world-cup/${p.slug}/`);
  created++;
});

console.log(`\nDone: ${created} pages created`);
