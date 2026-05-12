const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, 'Blog');

const categories = [
  {
    slug: 'dating-advice',
    navLabel: 'Dating Advice',
    brandName: 'The Attraction Game',
    tagline: 'Battle-Tested Tactics That Actually Work',
    description: 'No fluff. No therapy speak. Real strategies men use to attract women, stop getting ghosted, and win at dating in 2026.',
    color: '#ff8c00',
    colorDark: '#9f1239',
    emoji: '🔥',
    metaDesc: 'Battle-tested dating advice for men. Attraction tactics, anti-ghosting strategies, and real-world techniques that actually work.',
    articles: [
      { slug: 'find-active-women-online-near-you', title: 'How to Find Active Women Online Near You' },
      { slug: 'matching-vs-connecting', title: 'Matching vs. Actually Connecting' },
      { slug: 'low-social-circle-meet-women', title: 'Low Social Circle? How to Meet Women Anyway' },
      { slug: 'no-matches-tinder-real-reason', title: 'No Matches on Tinder? The Real Reason' },
      { slug: 'why-women-dont-reply-dating-apps', title: "Why Women Don't Reply on Dating Apps" },
      { slug: 'doom-scrolling-vs-connecting', title: 'Doom Scrolling vs. Actually Connecting' },
      { slug: 'what-women-want-first-message', title: 'What Women Actually Want in a First Message' },
      { slug: 'start-conversation-online-without-being-ignored', title: 'How to Start a Conversation Online Without Being Ignored' },
      { slug: '3am-loneliness-brain', title: 'What Your 3AM Brain Is Really Telling You' },
    ],
    placeholders: 3,
  },
  {
    slug: 'dating-apps',
    navLabel: 'Dating Apps',
    brandName: 'Swipe Game',
    tagline: 'App Hacks for More Matches, Less Wasted Time',
    description: 'Tinder, Bumble, Hinge — the platforms are rigged against average men. These are the cheat codes that tilt the odds back in your favour.',
    color: '#3b82f6',
    colorDark: '#1e3a8a',
    emoji: '📱',
    metaDesc: 'Dating app strategies for men. Tinder hacks, Bumble tips, Hinge prompts, and algorithm secrets to get more matches in 2026.',
    articles: [
      { slug: '../dating-advice/dating-apps-designed-to-keep-you-single', title: 'Are Dating Apps Designed to Keep You Single?' },
      { slug: '../dating-advice/average-man-dating-app-stats', title: "The Average Man's Dating App Stats" },
      { slug: '../dating-advice/ai-girlfriend-apps-ranked-2026', title: 'AI Girlfriend Apps Ranked 2026' },
    ],
    placeholders: 6,
  },
  {
    slug: 'profiles',
    navLabel: 'Profiles',
    brandName: 'Profile Optimization',
    tagline: 'Photos and Bios That Double Your Matches',
    description: 'Your profile is your first impression and most men are failing it. Fix your photos, sharpen your bio, and watch your match rate change overnight.',
    color: '#06b6d4',
    colorDark: '#164e63',
    emoji: '📸',
    metaDesc: 'Dating profile tips for men. Best Tinder bios, profile photo advice, and bio formulas that get more matches on any dating app.',
    articles: [],
    placeholders: 9,
  },
  {
    slug: 'messaging',
    navLabel: 'Messaging',
    brandName: 'Text Game',
    tagline: 'Texts That Turn Matches Into Meetups',
    description: 'Matches die in the DMs every day. The right opener, the right escalation, the right close — this is where dates are won or lost.',
    color: '#ec4899',
    colorDark: '#831843',
    emoji: '💬',
    metaDesc: 'Texting and messaging strategies for men on dating apps. Openers, flirting techniques, and texts that turn matches into real dates.',
    articles: [
      { slug: '../dating-advice/what-women-want-first-message', title: 'What Women Actually Want in a First Message' },
      { slug: '../dating-advice/start-conversation-online-without-being-ignored', title: 'How to Start a Conversation Online Without Being Ignored' },
    ],
    placeholders: 7,
  },
  {
    slug: 'ai-dating',
    navLabel: 'AI Dating',
    brandName: 'AI Girlfriends',
    tagline: 'Virtual Companions, Roleplay, and Real Skill Building',
    description: 'AI companions, virtual girlfriends, and roleplay platforms reviewed honestly. Plus how to use AI to sharpen your real-world game.',
    color: '#22d3ee',
    colorDark: '#0369a1',
    emoji: '🤖',
    metaDesc: 'Best AI girlfriend apps, virtual companions, and AI dating tools reviewed. Find the best AI girls platforms for 2026.',
    articles: [
      { slug: '../dating-advice/talking-to-ai-companion', title: 'What Talking to an AI Companion Actually Feels Like' },
      { slug: '../dating-advice/ai-chat-men-over-30', title: 'AI Chat for Men Over 30 — Is It Worth Your Time?' },
      { slug: '../dating-advice/ai-girlfriend-apps-ranked-2026', title: 'AI Girlfriend Apps Ranked 2026' },
    ],
    placeholders: 6,
  },
  {
    slug: 'confidence',
    navLabel: 'Confidence',
    brandName: 'Confidence',
    tagline: 'Become the Man Women Compete For',
    description: 'Style, grooming, body language, masculine frame. The physical and mental upgrades that change how women respond to you before you say a word.',
    color: '#22c55e',
    colorDark: '#14532d',
    emoji: '💪',
    metaDesc: 'Confidence and self-improvement for men. Masculine presence, grooming, style, and body language tips that make women notice you.',
    articles: [],
    placeholders: 9,
  },
  {
    slug: 'hookups',
    navLabel: 'Hookups',
    brandName: 'Hookups',
    tagline: 'Fast Paths From Chat to Action',
    description: "Reading intent signals, moving off the app, escalating without hesitation. For men who know what they want and don't want to waste time getting there.",
    color: '#f59e0b',
    colorDark: '#78350f',
    emoji: '⚡',
    metaDesc: 'Hookup advice for men. How to read signals, escalate, and move from online chat to real-world action fast.',
    articles: [],
    placeholders: 9,
  },
  {
    slug: 'first-dates',
    navLabel: 'First Dates',
    brandName: 'First Dates',
    tagline: 'Nail the Meetup, Close the Night',
    description: 'Where to go, what to say, how to build chemistry and make the move. The complete playbook from first drink to second location.',
    color: '#eab308',
    colorDark: '#713f12',
    emoji: '📍',
    metaDesc: 'First date advice for men. Best date ideas, how to create chemistry, what to say, and how to close the date successfully.',
    articles: [],
    placeholders: 9,
  },
  {
    slug: 'dating-psychology',
    navLabel: 'Dating Psychology',
    brandName: 'Attraction &amp; Seduction',
    tagline: 'Decode Her Behaviour for Predictable Wins',
    description: 'Why women ghost, what triggers desire, how attachment styles work. Understanding the psychology behind attraction gives you an unfair advantage.',
    color: '#8b5cf6',
    colorDark: '#5b21b6',
    emoji: '🧠',
    metaDesc: 'Female psychology and attraction explained for men. Why women ghost, desire triggers, attachment styles, and behavioural patterns decoded.',
    articles: [
      { slug: '../dating-advice/doom-scrolling-vs-connecting', title: 'Doom Scrolling vs. Actually Connecting' },
      { slug: '../dating-advice/midnight-ache-scrolling-loneliness', title: 'The Midnight Ache: Why You Scroll Instead of Connect' },
      { slug: '../dating-advice/3am-loneliness-brain', title: 'What Your 3AM Brain Is Really Telling You' },
    ],
    placeholders: 6,
  },
];

function buildPage(cat) {
  let articleCards = '';

  cat.articles.forEach(art => {
    articleCards += `
      <a href="/Blog/${art.slug}/" class="article-card">
        <div class="article-thumb" style="background:linear-gradient(135deg,${cat.color} 0%,${cat.colorDark} 100%);"><span class="thumb-icon">${cat.emoji}</span></div>
        <div class="article-body">
          <span class="article-cat-label">${cat.navLabel}</span>
          <h3 class="article-title">${art.title}</h3>
        </div>
      </a>`;
  });

  for (let i = 0; i < cat.placeholders; i++) {
    articleCards += `
      <div class="article-card is-placeholder">
        <div class="article-thumb" style="background:linear-gradient(135deg,${cat.color} 0%,${cat.colorDark} 100%);"><span class="thumb-icon">${cat.emoji}</span><span class="coming-soon-badge">Coming Soon</span></div>
        <div class="article-body">
          <span class="article-cat-label">${cat.navLabel}</span>
          <h3 class="article-title">New guide coming soon</h3>
        </div>
      </div>`;
  }

  return `<!DOCTYPE html>
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
  <title>${cat.navLabel} — ${cat.brandName} | Tempting Babes</title>
  <meta name="description" content="${cat.metaDesc}"/>
  <meta name="robots" content="index, follow"/>
  <link rel="canonical" href="https://www.temptingbabes.com/Blog/${cat.slug}/"/>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=block"/>
  <link rel="stylesheet" href="/styles.css"/>
  <script src="/script.js" defer></script>
  <style>
    .cat-hero {
      text-align: center;
      padding: 64px 24px 48px;
    }
    .cat-eyebrow {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: ${cat.color};
      margin: 0 0 14px;
    }
    .cat-hero h1 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(2.8rem, 8vw, 5.5rem);
      line-height: 1;
      color: #fff;
      margin: 0 0 12px;
    }
    .cat-hero h1 span {
      background: linear-gradient(135deg, ${cat.color}, ${cat.colorDark});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .cat-tagline {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(1rem, 2.5vw, 1.2rem);
      color: rgba(255,255,255,0.55);
      margin: 0 0 16px;
    }
    .cat-desc {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      color: rgba(255,255,255,0.38);
      max-width: 580px;
      margin: 0 auto;
      line-height: 1.75;
    }
    .breadcrumb {
      text-align: center;
      padding: 0 24px 36px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.8rem;
      color: rgba(255,255,255,0.28);
    }
    .breadcrumb a { color: ${cat.color}; text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }
    .blog-wrap {
      width: 100%;
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 24px 80px;
      box-sizing: border-box;
    }
    .section-hd {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    .section-hd h2 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 1.6rem;
      color: #fff;
      margin: 0;
      letter-spacing: 1px;
    }
    .count-badge {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: ${cat.color};
      background: rgba(255,255,255,0.05);
      padding: 5px 12px;
      border-radius: 20px;
    }
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    @media (max-width: 900px) { .posts-grid { grid-template-columns: repeat(2,1fr); } }
    @media (max-width: 540px)  { .posts-grid { grid-template-columns: 1fr; } }
    .article-card {
      background: #111;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 14px;
      overflow: hidden;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      transition: transform 0.22s, border-color 0.22s, box-shadow 0.22s;
    }
    .article-card:not(.is-placeholder):hover {
      transform: translateY(-4px);
      border-color: rgba(255,255,255,0.15);
      box-shadow: 0 12px 40px rgba(0,0,0,0.5);
    }
    .article-card.is-placeholder { opacity: 0.4; pointer-events: none; }
    .article-thumb {
      width: 100%; height: 190px;
      display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden; flex-shrink: 0;
    }
    .thumb-icon { font-size: 3.5rem; opacity: 0.25; user-select: none; }
    .coming-soon-badge {
      position: absolute; bottom: 12px; left: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.62rem; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase; color: rgba(255,255,255,0.6);
      background: rgba(0,0,0,0.35); padding: 4px 10px;
      border-radius: 20px; backdrop-filter: blur(6px);
    }
    .article-body { padding: 18px 20px 22px; display: flex; flex-direction: column; gap: 8px; }
    .article-cat-label {
      font-family: 'DM Sans', sans-serif; font-size: 0.68rem;
      font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
      color: ${cat.color};
    }
    .article-title {
      font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
      font-weight: 700; color: #fff; line-height: 1.45; margin: 0;
    }
    .is-placeholder .article-title { color: rgba(255,255,255,0.22); font-style: italic; }
    .back-link {
      text-align: center; padding: 48px 24px 0;
    }
    .back-link a {
      font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
      font-weight: 700; color: rgba(255,255,255,0.3);
      text-decoration: none; letter-spacing: 0.5px; transition: color 0.2s;
    }
    .back-link a:hover { color: ${cat.color}; }
  </style>
</head>
<body>

<nav>
  <a class="logo" href="/"><img src="/Asset/Logo/logo.webp" alt="" class="logo-img" style="height:42px;width:auto;flex-shrink:0;display:block;"><span class="logo-text" style="font-family:'Playfair Display',serif;font-weight:900;font-size:1.35rem;line-height:1;letter-spacing:1.5px;background:linear-gradient(90deg,#ff8c00,#ff3d6b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-left:-10px;">Tempting Babes</span></a>
  <div class="tabs">
    <a href="/AI-chat/" class="tab">AI Chat</a>
    <a href="/Cams/" class="tab">Cams</a>
    <a href="/Dating/" class="tab">Dating</a>
    <a href="/Offers/" class="tab">Offers</a>
    <a href="/Blog/" class="tab">Blog</a>
    <a href="/New/" class="tab"><span class="tab-star">⭐</span>VIP</a>
  </div>
  <button class="join-btn" id="getAccessBtn" style="background:linear-gradient(135deg,#ff8c00,#ff3d6b);">Join Free</button>
  <button class="menu-btn" id="menuBtn">&#9776;</button>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="/AI-chat/" class="mobile-tab">AI Chat</a>
  <a href="/Cams/" class="mobile-tab">Cams</a>
  <a href="/Dating/" class="mobile-tab">Dating</a>
  <a href="/Offers/" class="mobile-tab">Offers</a>
  <a href="/Blog/" class="mobile-tab">Blog</a>
  <a href="/New/" class="mobile-tab"><span class="tab-star">⭐</span>VIP</a>
</div>

<section class="cat-hero">
  <p class="cat-eyebrow">${cat.emoji} ${cat.navLabel}</p>
  <h1><span>${cat.brandName}</span></h1>
  <p class="cat-tagline">${cat.tagline}</p>
  <p class="cat-desc">${cat.description}</p>
</section>

<p class="breadcrumb"><a href="/Blog/">Blog</a> &rsaquo; ${cat.navLabel}</p>

<div class="blog-wrap">
  <div class="section-hd">
    <h2>All ${cat.navLabel} Guides</h2>
    <span class="count-badge">${cat.articles.length} Published</span>
  </div>
  <div class="posts-grid">
    ${articleCards.trim()}
  </div>
  <div class="back-link">
    <a href="/Blog/">&larr; Back to All Categories</a>
  </div>
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
        <li><a href="/World-Cup/">FIFA World Cup 2026</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4 class="footer-col-title">Legal &amp; Info</h4>
      <ul class="footer-links">
        <li><a href="/About/">About</a></li>
        <li><a href="/privacy-policy/">Privacy Policy</a></li>
        <li><a href="/terms/">Terms of Service</a></li>
        <li><a href="/dmca/">DMCA Policy</a></li>
        <li><a href="/Contact/">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>18+ Only &nbsp;&middot;&nbsp; All rights reserved &nbsp;&middot;&nbsp; Tempting Babes&copy; 2026</p>
  </div>
</footer>

</body>
</html>`;
}

categories.forEach(cat => {
  const dir = path.join(BLOG_DIR, cat.slug);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created: Blog/${cat.slug}/`);
  }
  fs.writeFileSync(path.join(dir, 'index.html'), buildPage(cat), 'utf8');
  console.log(`Written:  Blog/${cat.slug}/index.html  →  H1: "${cat.brandName}"`);
});

console.log('\nAll 9 category pages generated.');
