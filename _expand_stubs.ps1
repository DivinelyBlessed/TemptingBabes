$base = "c:\Users\Hp\OneDrive\Desktop\Tempting Babes\world-cup"
$ENC  = [System.Text.UTF8Encoding]::new($false)
$AFF  = 'https://t.mbjms.com/389314/3785/0?bo=2753,2754,2755,2756&po=6456&aff_sub5=SF_006OG000004lmDN'

# Inject rich content by replacing the thin pg-body section in each stub
# Pattern shared by all 7.8KB stubs
$OLD = '<div class="pg-body">
  <p>The 2026 FIFA World Cup runs from June 11 to July 19, 2026 across 16 host cities in the United States, Canada and Mexico. With 48 nations, 104 matches and the biggest fan zones in tournament history, this is the most ambitious World Cup ever staged.</p>
  <p>Explore the full <a href="/world-cup/" style="color:#ff8c00;text-decoration:none;">World Cup 2026 hub</a> for live scores, predictions, team guides, group tables and fan content — all in one place.</p>
</div>'

function Patch {
  param($slug, $new)
  $f = "$base\$slug\index.html"
  $txt = [System.IO.File]::ReadAllText($f)
  if ($txt.IndexOf($OLD) -lt 0) { Write-Host "SKIP (pattern not found): $slug"; return }
  $txt = $txt.Replace($OLD, $new)
  [System.IO.File]::WriteAllText($f, $txt, $ENC)
  Write-Host "OK: $slug ($([math]::Round((Get-Item $f).Length/1024,1))KB)"
}

# ─── Shared CSS (injected as inline style block inside new content) ────────────
# Common section CSS pattern reused across pages
$S = @'
<style>
.xp-section{padding:60px 3%;max-width:1200px;margin:0 auto;}
.xp-bg{padding:60px 3%;background:rgba(255,255,255,0.014);border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);}
.xp-bg-in{max-width:1200px;margin:0 auto;}
.xp-lbl{font-family:'DM Sans',sans-serif;font-size:.68rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#ff8c00;margin-bottom:8px;text-align:center;display:block;}
.xp-ttl{font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,4vw,3rem);color:#fff;line-height:1;margin-bottom:10px;text-align:center;}
.xp-sub{font-family:'DM Sans',sans-serif;font-size:.9rem;color:rgba(255,255,255,.45);margin-bottom:40px;max-width:540px;line-height:1.65;text-align:center;margin-left:auto;margin-right:auto;}
.xp-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:960px;margin:0 auto;}
.xp-grid2{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;max-width:800px;margin:0 auto;}
.xp-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:1100px;margin:0 auto;}
@media(max-width:700px){.xp-grid3,.xp-grid2{grid-template-columns:1fr;}.xp-grid4{grid-template-columns:repeat(2,1fr);}}
.xp-card{background:#111;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:28px 20px;transition:border-color .2s,transform .2s;}
.xp-card:hover{border-color:rgba(255,140,0,.4);transform:translateY(-3px);}
.xp-card-icon{font-size:2rem;margin-bottom:12px;display:block;text-align:center;}
.xp-card-t{font-family:'Bebas Neue',sans-serif;font-size:1.25rem;color:#fff;margin-bottom:6px;text-align:center;}
.xp-card-b{font-family:'DM Sans',sans-serif;font-size:.78rem;color:rgba(255,255,255,.42);line-height:1.55;text-align:center;}
.xp-hl{display:flex;align-items:flex-start;gap:14px;background:#111;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:18px 20px;margin-bottom:12px;}
.xp-hl-num{font-family:'Bebas Neue',sans-serif;font-size:1.6rem;background:linear-gradient(135deg,#ff8c00,#ff3d6b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;flex-shrink:0;width:32px;}
.xp-hl-t{font-family:'DM Sans',sans-serif;font-size:.88rem;font-weight:700;color:#fff;margin-bottom:4px;}
.xp-hl-b{font-family:'DM Sans',sans-serif;font-size:.78rem;color:rgba(255,255,255,.42);line-height:1.5;}
.xp-cta-strip{padding:52px 3%;text-align:center;background:linear-gradient(180deg,rgba(255,140,0,.05) 0%,transparent 100%);border-top:1px solid rgba(255,140,0,.1);}
.xp-btn{display:inline-flex;align-items:center;gap:8px;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:700;padding:14px 32px;border-radius:50px;background:linear-gradient(135deg,#ff8c00,#ff3d6b);color:#fff;text-decoration:none;box-shadow:0 6px 24px rgba(255,61,107,.35);transition:opacity .2s,transform .2s;}
.xp-btn:hover{opacity:.9;transform:translateY(-2px);}
.xp-btn2{display:inline-flex;align-items:center;gap:8px;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:600;padding:14px 28px;border-radius:50px;background:transparent;color:rgba(255,255,255,.72);text-decoration:none;border:1px solid rgba(255,255,255,.18);transition:border-color .2s,color .2s;}
.xp-btn2:hover{border-color:#ff8c00;color:#ff8c00;}
.xp-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;padding:28px 3%;border-top:1px solid rgba(255,255,255,.06);}
.xp-pill{font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:600;padding:9px 20px;border-radius:50px;border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.55);text-decoration:none;transition:border-color .2s,color .2s;}
.xp-pill:hover{border-color:#ff8c00;color:#ff8c00;}
.xp-table{width:100%;border-collapse:collapse;max-width:900px;margin:0 auto;}
.xp-table th{font-family:'DM Sans',sans-serif;font-size:.65rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.35);padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.08);text-align:left;}
.xp-table td{font-family:'DM Sans',sans-serif;font-size:.82rem;color:rgba(255,255,255,.65);padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.05);}
.xp-table tr:hover td{background:rgba(255,255,255,.025);}
.xp-tag{display:inline-block;font-family:'DM Sans',sans-serif;font-size:.6rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:3px 10px;border-radius:20px;background:rgba(255,140,0,.12);color:#ff8c00;border:1px solid rgba(255,140,0,.25);}
.xp-flag{width:32px;height:auto;border-radius:3px;vertical-align:middle;margin-right:8px;}
.xp-stat-bar{background:rgba(255,255,255,.025);border-bottom:1px solid rgba(255,255,255,.06);padding:22px 3%;display:flex;justify-content:center;gap:0;flex-wrap:wrap;}
.xp-stat{text-align:center;padding:10px 36px;border-right:1px solid rgba(255,255,255,.06);}
.xp-stat:last-child{border-right:none;}
.xp-stat-n{font-family:'Bebas Neue',sans-serif;font-size:1.9rem;background:linear-gradient(135deg,#ff8c00,#ff3d6b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;display:block;}
.xp-stat-l{font-family:'DM Sans',sans-serif;font-size:.6rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.3);margin-top:4px;display:block;}
</style>
'@

# ══════════════════════════════════════════════════════════════
# 1. GAME OF THE DAY — daily featured match hub
# ══════════════════════════════════════════════════════════════
$gotd = $S + @'
<div class="xp-stat-bar">
  <div class="xp-stat"><span class="xp-stat-n">USA</span><span class="xp-stat-l">vs Panama</span></div>
  <div class="xp-stat"><span class="xp-stat-n">Jun 12</span><span class="xp-stat-l">Opening Day</span></div>
  <div class="xp-stat"><span class="xp-stat-n">SoFi</span><span class="xp-stat-l">Los Angeles</span></div>
  <div class="xp-stat"><span class="xp-stat-n">4PM ET</span><span class="xp-stat-l">Kick Off</span></div>
</div>

<section class="xp-section">
  <span class="xp-lbl">Match Preview</span>
  <h2 class="xp-ttl">TODAY'S GAME</h2>
  <p class="xp-sub">The host nation opens their World Cup campaign. Here's everything you need to know before kick off.</p>
  <div class="xp-grid3">
    <div class="xp-card">
      <span class="xp-card-icon">&#128202;</span>
      <div class="xp-card-t">Recent Form</div>
      <p class="xp-card-b">USA enter on a strong run with CONCACAF qualification completed convincingly. Panama are physical and organised — the upset is possible but unlikely on home soil for the Stars and Stripes.</p>
    </div>
    <div class="xp-card">
      <span class="xp-card-icon">&#11088;</span>
      <div class="xp-card-t">Key Battle</div>
      <p class="xp-card-b">USA's attacking midfield versus Panama's defensive block. Pulisic and the American attack will need to break down a well-drilled Panamanian side looking to cause a massive opening-day upset.</p>
    </div>
    <div class="xp-card">
      <span class="xp-card-icon">&#129302;</span>
      <div class="xp-card-t">AI Prediction</div>
      <p class="xp-card-b">AI calls it: USA 2-0 Panama. Home crowd advantage, strong squad depth and tournament experience at this level. Panama capable of a goal — backing the USA to win clean.</p>
    </div>
  </div>
</section>

<div class="xp-bg">
  <div class="xp-bg-in">
    <span class="xp-lbl">Betting Angles</span>
    <h2 class="xp-ttl">TODAY'S TOP PICKS</h2>
    <p class="xp-sub">Three value bets identified by our AI prediction model for today's match.</p>
    <div style="max-width:800px;margin:0 auto;">
      <div class="xp-hl">
        <span class="xp-hl-num">01</span>
        <div><div class="xp-hl-t">USA to Win — Strong Value</div><p class="xp-hl-b">Host nation on home soil, opening match adrenaline and a squad with genuine quality. USA are favourites and the odds reflect it — but still worth backing for the tournament opener.</p></div>
      </div>
      <div class="xp-hl">
        <span class="xp-hl-num">02</span>
        <div><div class="xp-hl-t">Both Teams to Score — Speculative Pick</div><p class="xp-hl-b">Panama have defensive quality but they will want to land a sucker punch. USA will likely score two or more. Panama have the class to grab one themselves.</p></div>
      </div>
      <div class="xp-hl">
        <span class="xp-hl-num">03</span>
        <div><div class="xp-hl-t">Over 2.5 Goals — High Confidence</div><p class="xp-hl-b">Opening matches in expanded World Cups trend towards goals. USA at home with a packed crowd will push hard. Take the over.</p></div>
      </div>
    </div>
  </div>
</div>

<section class="xp-section">
  <span class="xp-lbl">Fan Girls</span>
  <h2 class="xp-ttl">FAN GIRLS FOR TODAY'S MATCH</h2>
  <p class="xp-sub">The most passionate female fans supporting both sides today.</p>
  <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;max-width:600px;margin:0 auto;">
    <a href="/world-cup/fan-girls/usa/" style="flex:1;min-width:240px;display:flex;align-items:center;gap:14px;background:#111;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:22px 20px;text-decoration:none;transition:border-color .2s;" onmouseover="this.style.borderColor='rgba(255,140,0,.4)'" onmouseout="this.style.borderColor='rgba(255,255,255,.08)'">
      <img src="https://flagcdn.com/w80/us.png" alt="USA" style="width:52px;height:auto;border-radius:5px;"/>
      <div><div style="font-family:'Bebas Neue',sans-serif;font-size:1.2rem;color:#fff;">USA Fan Girls</div><div style="font-family:'DM Sans',sans-serif;font-size:.7rem;color:#ff8c00;">Host Nation</div></div>
    </a>
    <a href="/world-cup/fan-girls/panama/" style="flex:1;min-width:240px;display:flex;align-items:center;gap:14px;background:#111;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:22px 20px;text-decoration:none;transition:border-color .2s;" onmouseover="this.style.borderColor='rgba(255,140,0,.4)'" onmouseout="this.style.borderColor='rgba(255,255,255,.08)'">
      <img src="https://flagcdn.com/w80/pa.png" alt="Panama" style="width:52px;height:auto;border-radius:5px;"/>
      <div><div style="font-family:'Bebas Neue',sans-serif;font-size:1.2rem;color:#fff;">Panama Fan Girls</div><div style="font-family:'DM Sans',sans-serif;font-size:.7rem;color:#ff8c00;">The Underdogs</div></div>
    </a>
  </div>
</section>

<div class="xp-cta-strip">
  <span class="xp-lbl">Don't Miss It</span>
  <h2 class="xp-ttl" style="text-align:center;">WATCH. PREDICT. WIN.</h2>
  <p style="font-family:'DM Sans',sans-serif;font-size:.97rem;color:rgba(255,255,255,.5);max-width:500px;margin:0 auto 28px;line-height:1.7;">Get the full prediction, betting tips and watch guide — then meet a football fan girl to watch it with.</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
    <a href="/world-cup/predictions/" class="xp-btn">Full Predictions &#8594;</a>
    <a href="/world-cup/betting-odds/" class="xp-btn2">Betting Odds</a>
  </div>
</div>

<div class="xp-row">
  <a href="/world-cup/schedule/" class="xp-pill">&#128197; All Fixtures</a>
  <a href="/world-cup/live-scores/" class="xp-pill">&#128308; Live Scores</a>
  <a href="/world-cup/predictions/" class="xp-pill">&#127919; Predictions</a>
  <a href="/world-cup/betting-odds/" class="xp-pill">&#128200; Betting Odds</a>
  <a href="/world-cup/fan-girls/" class="xp-pill">&#10084; Fan Girls</a>
  <a href="/world-cup/streaming-guide/" class="xp-pill">&#128250; Watch Guide</a>
</div>
'@
Patch 'game-of-the-day' $gotd

# ══════════════════════════════════════════════════════════════
# 2. BRACKET SIMULATOR — printable bracket + email squeeze
# ══════════════════════════════════════════════════════════════
$bracket = $S + @'
<div class="xp-stat-bar">
  <div class="xp-stat"><span class="xp-stat-n">32</span><span class="xp-stat-l">Round of 32</span></div>
  <div class="xp-stat"><span class="xp-stat-n">16</span><span class="xp-stat-l">Round of 16</span></div>
  <div class="xp-stat"><span class="xp-stat-n">8</span><span class="xp-stat-l">Quarter-Finals</span></div>
  <div class="xp-stat"><span class="xp-stat-n">1</span><span class="xp-stat-l">Champion</span></div>
</div>

<section class="xp-section">
  <span class="xp-lbl">Tournament Bracket</span>
  <h2 class="xp-ttl">FILL IN YOUR PREDICTIONS</h2>
  <p class="xp-sub">Pick your winners for every stage — from the Round of 32 right through to the final. Download the printable version to keep track.</p>
  <div class="xp-grid4">
    <div class="xp-card" style="border-color:rgba(255,140,0,.2);">
      <span class="xp-card-icon">&#127937;</span>
      <div class="xp-card-t">Round of 32</div>
      <p class="xp-card-b">Top 2 from each group + 8 best third-place teams advance. 32 teams. 16 matches. Where it all begins.</p>
    </div>
    <div class="xp-card" style="border-color:rgba(255,140,0,.2);">
      <span class="xp-card-icon">&#9889;</span>
      <div class="xp-card-t">Round of 16</div>
      <p class="xp-card-b">The knockout stage proper. One loss and you're out. 16 teams remain — every match a potential classic.</p>
    </div>
    <div class="xp-card" style="border-color:rgba(255,140,0,.2);">
      <span class="xp-card-icon">&#127941;</span>
      <div class="xp-card-t">Quarter-Finals</div>
      <p class="xp-card-b">Eight teams left standing. Four incredible matches. The tournament's greatest upsets happen right here.</p>
    </div>
    <div class="xp-card" style="border-color:rgba(255,61,107,.3);">
      <span class="xp-card-icon">&#127881;</span>
      <div class="xp-card-t">Semi + Final</div>
      <p class="xp-card-b">Two semi-finals. One third-place play-off. Then the match that decides the greatest team on the planet.</p>
    </div>
  </div>
</section>

<div class="xp-bg">
  <div class="xp-bg-in">
    <span class="xp-lbl">How To Use</span>
    <h2 class="xp-ttl">BUILD YOUR BRACKET</h2>
    <p class="xp-sub">Three steps to the perfect tournament bracket — and a chance to win the fan pack.</p>
    <div style="max-width:700px;margin:0 auto;">
      <div class="xp-hl"><span class="xp-hl-num">01</span><div><div class="xp-hl-t">Download the Printable Bracket</div><p class="xp-hl-b">Get the official World Cup 2026 bracket poster — A4 printable, all 48 teams, all stages. Fill it in with a pen at your watch party.</p></div></div>
      <div class="xp-hl"><span class="xp-hl-num">02</span><div><div class="xp-hl-t">Fill In Your Predictions</div><p class="xp-hl-b">Pick your winners for every round. Use our AI predictions and betting odds pages as your guide. Who makes the semi-finals? Who lifts the trophy?</p></div></div>
      <div class="xp-hl"><span class="xp-hl-num">03</span><div><div class="xp-hl-t">Share Your Bracket</div><p class="xp-hl-b">Screenshot or photograph your filled-in bracket and share it on social. Tag us for a chance to be featured in our fan reactions gallery.</p></div></div>
    </div>
  </div>
</div>

<section class="xp-section">
  <span class="xp-lbl">Bracket Tools</span>
  <h2 class="xp-ttl">EVERYTHING IN ONE PLACE</h2>
  <p class="xp-sub">All the tools you need to run your bracket alongside the tournament.</p>
  <div class="xp-grid3">
    <div class="xp-card">
      <span class="xp-card-icon">&#11015;&#65039;</span>
      <div class="xp-card-t">Printable Bracket PDF</div>
      <p class="xp-card-b">Download the full A4 tournament bracket. Print it, pin it, fill it in as the tournament unfolds. Comes with the full fan pack.</p>
    </div>
    <div class="xp-card">
      <span class="xp-card-icon">&#127919;</span>
      <div class="xp-card-t">AI Prediction Guide</div>
      <p class="xp-card-b">Let our AI prediction model help you fill in the tricky rounds. AI tips for every group winner, quarter-finalist and finalist.</p>
    </div>
    <div class="xp-card">
      <span class="xp-card-icon">&#128200;</span>
      <div class="xp-card-t">Betting Odds Tracker</div>
      <p class="xp-card-b">Live odds for every stage. Who is the favourite to win the tournament outright? Use the odds to guide your bracket picks.</p>
    </div>
  </div>
</section>

<div class="xp-cta-strip">
  <span class="xp-lbl">Download Now</span>
  <h2 class="xp-ttl" style="text-align:center;">GET THE PRINTABLE BRACKET</h2>
  <p style="font-family:'DM Sans',sans-serif;font-size:.97rem;color:rgba(255,255,255,.5);max-width:500px;margin:0 auto 28px;line-height:1.7;">The printable A4 tournament bracket comes with the complete World Cup 2026 fan pack — fixtures, group tables, prediction sheets and wallpapers. Free access.</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
    <a href="/world-cup/digital-download/" class="xp-btn">Download Bracket &#8594;</a>
    <a href="/world-cup/predictions/" class="xp-btn2">AI Predictions</a>
  </div>
</div>

<div class="xp-row">
  <a href="/world-cup/digital-download/" class="xp-pill">&#11015; Downloads</a>
  <a href="/world-cup/predictions/" class="xp-pill">&#127919; Predictions</a>
  <a href="/world-cup/betting-odds/" class="xp-pill">&#128200; Betting Odds</a>
  <a href="/world-cup/the-final/" class="xp-pill">&#127881; The Final</a>
  <a href="/world-cup/knockout-bracket/" class="xp-pill">&#127937; Knockout Bracket</a>
  <a href="/world-cup/fan-pack/" class="xp-pill">&#127937; Fan Pack</a>
</div>
'@
Patch 'bracket-simulator' $bracket

# ══════════════════════════════════════════════════════════════
# 3. STAR PLAYERS — top players editorial authority page
# ══════════════════════════════════════════════════════════════
$starPlayers = $S + @'
<style>
.sp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;max-width:1100px;margin:0 auto;}
@media(max-width:900px){.sp-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:480px){.sp-grid{grid-template-columns:1fr;}}
.sp-card{background:#111;border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:28px 18px;text-align:center;transition:border-color .2s,transform .2s;position:relative;overflow:hidden;}
.sp-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#ff8c00,#ff3d6b);}
.sp-card:hover{border-color:rgba(255,140,0,.4);transform:translateY(-4px);}
.sp-flag{width:44px;height:auto;border-radius:4px;margin:0 auto 10px;display:block;box-shadow:0 3px 12px rgba(0,0,0,.5);}
.sp-name{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:#fff;margin-bottom:4px;line-height:1;}
.sp-nat{font-family:'DM Sans',sans-serif;font-size:.65rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#ff8c00;margin-bottom:10px;display:block;}
.sp-club{font-family:'DM Sans',sans-serif;font-size:.72rem;color:rgba(255,255,255,.4);margin-bottom:10px;}
.sp-pos{display:inline-block;font-family:'DM Sans',sans-serif;font-size:.58rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:3px 10px;border-radius:20px;background:rgba(255,61,107,.12);color:#ff3d6b;border:1px solid rgba(255,61,107,.25);margin-bottom:12px;}
.sp-bio{font-family:'DM Sans',sans-serif;font-size:.75rem;color:rgba(255,255,255,.42);line-height:1.55;}
</style>

<div class="xp-stat-bar">
  <div class="xp-stat"><span class="xp-stat-n">48</span><span class="xp-stat-l">Nations</span></div>
  <div class="xp-stat"><span class="xp-stat-n">16</span><span class="xp-stat-l">Players to Watch</span></div>
  <div class="xp-stat"><span class="xp-stat-n">104</span><span class="xp-stat-l">Matches</span></div>
  <div class="xp-stat"><span class="xp-stat-n">1</span><span class="xp-stat-l">Golden Boot Winner</span></div>
</div>

<section class="xp-section">
  <span class="xp-lbl">Must Watch</span>
  <h2 class="xp-ttl">THE 16 STARS OF THE TOURNAMENT</h2>
  <p class="xp-sub">The players who will define the 2026 World Cup — from established legends to the next generation taking over the world stage.</p>
  <div class="sp-grid">
    <div class="sp-card"><img src="https://flagcdn.com/w80/fr.png" alt="France" class="sp-flag"/><div class="sp-name">Kylian Mbappe</div><span class="sp-nat">France</span><div class="sp-club">Real Madrid</div><span class="sp-pos">Forward</span><p class="sp-bio">The fastest player at the tournament and arguably the most dangerous. Leading France's attack at his peak — expect goals, assists and the Golden Boot race front-running.</p></div>
    <div class="sp-card"><img src="https://flagcdn.com/w80/no.png" alt="Norway" class="sp-flag"/><div class="sp-name">Erling Haaland</div><span class="sp-nat">Norway</span><div class="sp-club">Manchester City</div><span class="sp-pos">Striker</span><p class="sp-bio">Norway's weapon. The most clinical finisher in world football right now. His first World Cup — and he arrives hungry. Norway's entire tournament hinges on Haaland's form.</p></div>
    <div class="sp-card"><img src="https://flagcdn.com/w80/ar.png" alt="Argentina" class="sp-flag"/><div class="sp-name">Lionel Messi</div><span class="sp-nat">Argentina</span><div class="sp-club">Inter Miami</div><span class="sp-pos">Forward</span><p class="sp-bio">The defending champion, arguably the greatest player in history, returning for one final World Cup dance. Every touch will be watched by the world. Argentina's spiritual leader.</p></div>
    <div class="sp-card"><img src="https://flagcdn.com/w80/br.png" alt="Brazil" class="sp-flag"/><div class="sp-name">Vinicius Jr</div><span class="sp-nat">Brazil</span><div class="sp-club">Real Madrid</div><span class="sp-pos">Winger</span><p class="sp-bio">The Samba spirit made electric. Vinicius brings pace, skill and an unpredictability that defenders cannot plan for. Brazil's title push depends on him reaching top form.</p></div>
    <div class="sp-card"><img src="https://flagcdn.com/w80/gb-eng.png" alt="England" class="sp-flag"/><div class="sp-name">Jude Bellingham</div><span class="sp-nat">England</span><div class="sp-club">Real Madrid</div><span class="sp-pos">Midfielder</span><p class="sp-bio">England's heartbeat. Bellingham can score, create and dominate midfield. At his age, with this experience — he is genuinely capable of winning Player of the Tournament.</p></div>
    <div class="sp-card"><img src="https://flagcdn.com/w80/es.png" alt="Spain" class="sp-flag"/><div class="sp-name">Lamine Yamal</div><span class="sp-nat">Spain</span><div class="sp-club">Barcelona</div><span class="sp-pos">Winger</span><p class="sp-bio">The teenage sensation who lit up Euro 2024. Yamal plays with a freedom and confidence beyond his years — Spain's most exciting talent since Xavi and Iniesta.</p></div>
    <div class="sp-card"><img src="https://flagcdn.com/w80/gb-eng.png" alt="England" class="sp-flag"/><div class="sp-name">Phil Foden</div><span class="sp-nat">England</span><div class="sp-club">Manchester City</div><span class="sp-pos">Midfielder</span><p class="sp-bio">Creative, intelligent and capable of the spectacular goal. Foden has matured into one of the world's best. If England go deep, Foden will be the architect.</p></div>
    <div class="sp-card"><img src="https://flagcdn.com/w80/pt.png" alt="Portugal" class="sp-flag"/><div class="sp-name">Bruno Fernandes</div><span class="sp-nat">Portugal</span><div class="sp-club">Manchester United</div><span class="sp-pos">Midfielder</span><p class="sp-bio">Portugal's creative engine in the post-Ronaldo era. Fernandes drives the tempo, delivers key passes and chips in with crucial goals. Portugal's most important player.</p></div>
    <div class="sp-card"><img src="https://flagcdn.com/w80/es.png" alt="Spain" class="sp-flag"/><div class="sp-name">Pedri</div><span class="sp-nat">Spain</span><div class="sp-club">Barcelona</div><span class="sp-pos">Midfielder</span><p class="sp-bio">Spain's midfield maestro. Technical, calm under pressure and always finding the right pass. If fit, Pedri is the conductor of the most technically gifted squad in the tournament.</p></div>
    <div class="sp-card"><img src="https://flagcdn.com/w80/co.png" alt="Colombia" class="sp-flag"/><div class="sp-name">Luis Diaz</div><span class="sp-nat">Colombia</span><div class="sp-club">Liverpool</div><span class="sp-pos">Winger</span><p class="sp-bio">Electric on the left flank. Diaz has the direct running, the goals and the ability to carry Colombia through tight moments. A potential dark horse for Player of the Tournament.</p></div>
    <div class="sp-card"><img src="https://flagcdn.com/w80/de.png" alt="Germany" class="sp-flag"/><div class="sp-name">Florian Wirtz</div><span class="sp-nat">Germany</span><div class="sp-club">Bayern Munich</div><span class="sp-pos">Attacking Mid</span><p class="sp-bio">Germany's most exciting player in a generation. Wirtz has the skill, the vision and the composure to unlock any defence. Could be the breakout star of the tournament.</p></div>
    <div class="sp-card"><img src="https://flagcdn.com/w80/nl.png" alt="Netherlands" class="sp-flag"/><div class="sp-name">Virgil van Dijk</div><span class="sp-nat">Netherlands</span><div class="sp-club">Liverpool</div><span class="sp-pos">Defender</span><p class="sp-bio">The best defender in the world at his peak years. Netherlands' defensive rock and captain. Van Dijk will be crucial if the Oranje are to go all the way in 2026.</p></div>
    <div class="sp-card"><img src="https://flagcdn.com/w80/ma.png" alt="Morocco" class="sp-flag"/><div class="sp-name">Achraf Hakimi</div><span class="sp-nat">Morocco</span><div class="sp-club">PSG</div><span class="sp-pos">Right Back</span><p class="sp-bio">The world's best full-back. Hakimi's attacking threat from the right side gives Morocco an extra dimension that no team can comfortably deal with. Key to their 2022 heroics.</p></div>
    <div class="sp-card"><img src="https://flagcdn.com/w80/us.png" alt="USA" class="sp-flag"/><div class="sp-name">Christian Pulisic</div><span class="sp-nat">USA</span><div class="sp-club">AC Milan</div><span class="sp-pos">Winger</span><p class="sp-bio">Captain America at his home World Cup. Pulisic has matured into a consistent performer and USA's most dangerous outlet. Expect him to be the tournament's most-watched home player.</p></div>
    <div class="sp-card"><img src="https://flagcdn.com/w80/mx.png" alt="Mexico" class="sp-flag"/><div class="sp-name">Santiago Gimenez</div><span class="sp-nat">Mexico</span><div class="sp-club">AC Milan</div><span class="sp-pos">Striker</span><p class="sp-bio">Mexico's new star striker with the goals and the presence to lead El Tri's attack. Gimenez plays on the biggest European stage — now he gets the biggest international stage.</p></div>
    <div class="sp-card"><img src="https://flagcdn.com/w80/ca.png" alt="Canada" class="sp-flag"/><div class="sp-name">Alphonso Davies</div><span class="sp-nat">Canada</span><div class="sp-club">Bayern Munich</div><span class="sp-pos">Left Back</span><p class="sp-bio">One of the fastest players alive. Davies will be electric at his home World Cup. Canada's best player and biggest personality — expect him to make the headlines in 2026.</p></div>
  </div>
</section>

<div class="xp-cta-strip">
  <span class="xp-lbl">Star Player Posters</span>
  <h2 class="xp-ttl" style="text-align:center;">DOWNLOAD PLAYER POSTER PACKS</h2>
  <p style="font-family:'DM Sans',sans-serif;font-size:.97rem;color:rgba(255,255,255,.5);max-width:500px;margin:0 auto 28px;line-height:1.7;">Get the full star player poster pack — 16 print-quality player graphics, phone wallpapers and match preview cards for every star.</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
    <a href="/world-cup/digital-download/" class="xp-btn">Download Poster Pack &#8594;</a>
    <a href="/world-cup/wallpapers/" class="xp-btn2">Free Wallpapers</a>
  </div>
</div>

<div class="xp-row">
  <a href="/world-cup/teams/" class="xp-pill">&#127941; All Teams</a>
  <a href="/world-cup/predictions/" class="xp-pill">&#127919; Predictions</a>
  <a href="/world-cup/betting-odds/" class="xp-pill">&#128200; Betting Odds</a>
  <a href="/world-cup/digital-download/" class="xp-pill">&#11015; Downloads</a>
  <a href="/world-cup/wallpapers/" class="xp-pill">&#128247; Wallpapers</a>
</div>
'@
Patch 'star-players' $starPlayers

# ══════════════════════════════════════════════════════════════
# 4. BETTING — how-to-bet landing page
# ══════════════════════════════════════════════════════════════
$betting = $S + @'
<section class="xp-section">
  <span class="xp-lbl">Beginners Guide</span>
  <h2 class="xp-ttl">HOW TO BET ON THE WORLD CUP</h2>
  <p class="xp-sub">Five types of bets explained — from the simplest match result to value accumulator picks.</p>
  <div class="xp-grid3">
    <div class="xp-card"><span class="xp-card-icon">&#9917;</span><div class="xp-card-t">Match Result (1X2)</div><p class="xp-card-b">The simplest bet. Pick Team A to win, Team B to win, or a draw. Best for beginners — understand the teams before picking sides.</p></div>
    <div class="xp-card"><span class="xp-card-icon">&#9971;</span><div class="xp-card-t">Both Teams to Score</div><p class="xp-card-b">BTTS — will both teams find the net? Often better value than a match result, especially in balanced group games.</p></div>
    <div class="xp-card"><span class="xp-card-icon">&#128200;</span><div class="xp-card-t">Over/Under Goals</div><p class="xp-card-b">Predict whether total goals go over or under a set number (usually 2.5). Open attacking matches suit the over. Defensive battles suit the under.</p></div>
    <div class="xp-card"><span class="xp-card-icon">&#127919;</span><div class="xp-card-t">Correct Score</div><p class="xp-card-b">High risk, high reward. Predict the exact final score. Use our AI predictions to narrow down the most likely scorelines for your value pick.</p></div>
    <div class="xp-card"><span class="xp-card-icon">&#11088;</span><div class="xp-card-t">First Goal Scorer</div><p class="xp-card-b">Bet on which player scores first. Star forwards at big prices can deliver exceptional returns — use our star players page to identify likely scorers.</p></div>
    <div class="xp-card"><span class="xp-card-icon">&#127881;</span><div class="xp-card-t">Tournament Outright</div><p class="xp-card-b">Pick the champion before the tournament starts. Best placed early for maximum value — odds shorten significantly as teams progress.</p></div>
  </div>
</section>

<div class="xp-bg">
  <div class="xp-bg-in">
    <span class="xp-lbl">5-Step Guide</span>
    <h2 class="xp-ttl">HOW TO PLACE YOUR FIRST BET</h2>
    <p class="xp-sub">From account creation to placing your first World Cup bet in five steps.</p>
    <div style="max-width:700px;margin:0 auto;">
      <div class="xp-hl"><span class="xp-hl-num">01</span><div><div class="xp-hl-t">Choose a Licensed Bookmaker</div><p class="xp-hl-b">Only bet with regulated, licensed operators. Check for licensing from the UKGC, MGA or equivalent authority in your country.</p></div></div>
      <div class="xp-hl"><span class="xp-hl-num">02</span><div><div class="xp-hl-t">Claim Your Welcome Bonus</div><p class="xp-hl-b">Most bookmakers offer a sign-up bonus for new accounts. Read the terms carefully — wagering requirements determine actual value.</p></div></div>
      <div class="xp-hl"><span class="xp-hl-num">03</span><div><div class="xp-hl-t">Check Today's Odds</div><p class="xp-hl-b">Visit our betting odds page for live odds comparison across all bookmakers. Finding the best price matters — a few decimal points add up over a tournament.</p></div></div>
      <div class="xp-hl"><span class="xp-hl-num">04</span><div><div class="xp-hl-t">Use Our AI Predictions</div><p class="xp-hl-b">Our AI prediction model analyses form, head-to-head records and tournament data. Use predictions as a guide — not a guarantee.</p></div></div>
      <div class="xp-hl"><span class="xp-hl-num">05</span><div><div class="xp-hl-t">Bet Responsibly</div><p class="xp-hl-b">Set a budget before you start. Never chase losses. Gambling should be entertainment — if it stops being fun, step away. BeGambleAware.org</p></div></div>
    </div>
  </div>
</div>

<div class="xp-cta-strip">
  <span class="xp-lbl">Live Odds</span>
  <h2 class="xp-ttl" style="text-align:center;">SEE TODAY'S BEST ODDS</h2>
  <p style="font-family:'DM Sans',sans-serif;font-size:.97rem;color:rgba(255,255,255,.5);max-width:500px;margin:0 auto 28px;line-height:1.7;">Compare live odds across all major bookmakers for every World Cup 2026 match — group stage, knockouts and outright winner markets.</p>
  <p style="font-family:'DM Sans',sans-serif;font-size:.72rem;color:rgba(255,255,255,.25);max-width:500px;margin:-16px auto 28px;line-height:1.5;">18+ only. Gamble responsibly. BeGambleAware.org</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
    <a href="/world-cup/betting-odds/" class="xp-btn">Live Betting Odds &#8594;</a>
    <a href="/world-cup/predictions/" class="xp-btn2">AI Predictions</a>
  </div>
</div>

<div class="xp-row">
  <a href="/world-cup/betting-odds/" class="xp-pill">&#128200; Live Odds</a>
  <a href="/world-cup/predictions/" class="xp-pill">&#127919; Predictions</a>
  <a href="/world-cup/game-of-the-day/" class="xp-pill">&#9917; Game of the Day</a>
  <a href="/world-cup/bracket-simulator/" class="xp-pill">&#127937; Bracket</a>
  <a href="/world-cup/fantasy-football/" class="xp-pill">&#127922; Fantasy</a>
</div>
'@
Patch 'betting' $betting

# ══════════════════════════════════════════════════════════════
# 5. PARTY — watch party guide
# ══════════════════════════════════════════════════════════════
$party = $S + @'
<section class="xp-section">
  <span class="xp-lbl">Party Guide</span>
  <h2 class="xp-ttl">HOST THE PERFECT WATCH PARTY</h2>
  <p class="xp-sub">Everything you need for the ultimate World Cup 2026 viewing experience — from setup to snacks to the final whistle.</p>
  <div class="xp-grid4">
    <div class="xp-card"><span class="xp-card-icon">&#128250;</span><div class="xp-card-t">Screen Setup</div><p class="xp-card-b">Biggest screen possible. HDMI cable. Stable internet. Test your streaming service 30 minutes before kick off. Sound system matters as much as picture.</p></div>
    <div class="xp-card"><span class="xp-card-icon">&#127871;</span><div class="xp-card-t">Food and Drinks</div><p class="xp-card-b">Match food by nation — nachos for Mexico games, BBQ for USA, burgers for England, pizza for Italy. Keep drinks flowing. Have a designated food/drink person.</p></div>
    <div class="xp-card"><span class="xp-card-icon">&#127988;</span><div class="xp-card-t">Decorations</div><p class="xp-card-b">Nation flags, jerseys, printed bracket poster on the wall, face paint station for the big games. Download our wallpapers to use as TV screensavers between matches.</p></div>
    <div class="xp-card"><span class="xp-card-icon">&#127922;</span><div class="xp-card-t">Games and Polls</div><p class="xp-card-b">Bracket prediction sheet. Penalty shootout simulator. Player of the match vote at full time. Quiz round at half time. Download the fan pack for all the printables.</p></div>
  </div>
</section>

<div class="xp-bg">
  <div class="xp-bg-in">
    <span class="xp-lbl">Checklist</span>
    <h2 class="xp-ttl">WATCH PARTY CHECKLIST</h2>
    <p class="xp-sub">Tick these off before your guests arrive.</p>
    <div style="max-width:700px;margin:0 auto;">
      <div class="xp-hl"><span class="xp-hl-num">&#10003;</span><div><div class="xp-hl-t">Streaming Service Confirmed</div><p class="xp-hl-b">Check which broadcaster has rights in your country. Test 30 min before kick off. Have a backup option ready.</p></div></div>
      <div class="xp-hl"><span class="xp-hl-num">&#10003;</span><div><div class="xp-hl-t">Printable Bracket on the Wall</div><p class="xp-hl-b">Download the tournament bracket from our digital download page. Print A4 or A3. Pin it where everyone can see it and write on it.</p></div></div>
      <div class="xp-hl"><span class="xp-hl-num">&#10003;</span><div><div class="xp-hl-t">Match Food Ready Before Kick Off</div><p class="xp-hl-b">No one wants to miss a goal because the nachos arrived late. Have all food out 10 minutes before the match starts.</p></div></div>
      <div class="xp-hl"><span class="xp-hl-num">&#10003;</span><div><div class="xp-hl-t">Guest Predictions Collected</div><p class="xp-hl-b">Run a sweepstakes. Everyone picks a score before kick off. Loser buys the next round. Winner takes the prize fund.</p></div></div>
      <div class="xp-hl"><span class="xp-hl-num">&#10003;</span><div><div class="xp-hl-t">Half Time Entertainment Ready</div><p class="xp-hl-b">World Cup quiz, player of the match vote, next match prediction. Keep guests engaged during the break.</p></div></div>
    </div>
  </div>
</div>

<div class="xp-cta-strip">
  <span class="xp-lbl">Party Downloads</span>
  <h2 class="xp-ttl" style="text-align:center;">GET THE FULL PARTY PACK</h2>
  <p style="font-family:'DM Sans',sans-serif;font-size:.97rem;color:rgba(255,255,255,.5);max-width:500px;margin:0 auto 28px;line-height:1.7;">Bracket poster, quiz sheets, score prediction cards, fan pack wallpapers and a match food guide — everything you need for the perfect watch party. Free.</p>
  <a href="/world-cup/fan-pack/" class="xp-btn">Get the Party Pack &#8594;</a>
</div>

<div class="xp-row">
  <a href="/world-cup/food/" class="xp-pill">&#127871; Match Food</a>
  <a href="/world-cup/songs/" class="xp-pill">&#127925; Songs</a>
  <a href="/world-cup/watch-parties/" class="xp-pill">&#127944; Watch Parties</a>
  <a href="/world-cup/fan-pack/" class="xp-pill">&#127937; Fan Pack</a>
  <a href="/world-cup/merchandise/" class="xp-pill">&#128717; Merch</a>
  <a href="/world-cup/streaming-guide/" class="xp-pill">&#128250; Streaming</a>
</div>
'@
Patch 'party' $party

# ══════════════════════════════════════════════════════════════
# 6. FOOD — world cup food by nation guide
# ══════════════════════════════════════════════════════════════
$food = $S + @'
<section class="xp-section">
  <span class="xp-lbl">Match Day Eats</span>
  <h2 class="xp-ttl">WORLD CUP FOOD BY NATION</h2>
  <p class="xp-sub">The best match day food for every major game — dishes inspired by the competing nations.</p>
  <div class="xp-grid4">
    <div class="xp-card"><img src="https://flagcdn.com/w80/br.png" alt="Brazil" style="width:44px;height:auto;border-radius:4px;margin:0 auto 10px;display:block;"/><div class="xp-card-t">Brazil Game</div><p class="xp-card-b">Pao de queijo (cheese bread), coxinha (chicken dumplings), brigadeiro for celebrations. Acai bowl if you want to feel like a Carioca.</p></div>
    <div class="xp-card"><img src="https://flagcdn.com/w80/ar.png" alt="Argentina" style="width:44px;height:auto;border-radius:4px;margin:0 auto 10px;display:block;"/><div class="xp-card-t">Argentina Game</div><p class="xp-card-b">Empanadas all day. Chimichurri on everything. Asado (BBQ) if you have time. Alfajores for dessert. Mate in hand throughout.</p></div>
    <div class="xp-card"><img src="https://flagcdn.com/w80/mx.png" alt="Mexico" style="width:44px;height:auto;border-radius:4px;margin:0 auto 10px;display:block;"/><div class="xp-card-t">Mexico Game</div><p class="xp-card-b">Tacos, guacamole, tortilla chips with salsa and queso. Elotes (Mexican street corn). Horchata or agua fresca to drink.</p></div>
    <div class="xp-card"><img src="https://flagcdn.com/w80/gb-eng.png" alt="England" style="width:44px;height:auto;border-radius:4px;margin:0 auto 10px;display:block;"/><div class="xp-card-t">England Game</div><p class="xp-card-b">Classic fish and chips. Pies. Sausage rolls. Pints of beer. Maybe a prawn sandwich if you're feeling brave at Wembley.</p></div>
    <div class="xp-card"><img src="https://flagcdn.com/w80/it.png" alt="Italy" style="width:44px;height:auto;border-radius:4px;margin:0 auto 10px;display:block;"/><div class="xp-card-t">Italy Game</div><p class="xp-card-b">Pizza obviously. Arancini. Bruschetta. Tiramisu when they inevitably score a late winner. Limoncello if you're feeling optimistic.</p></div>
    <div class="xp-card"><img src="https://flagcdn.com/w80/fr.png" alt="France" style="width:44px;height:auto;border-radius:4px;margin:0 auto 10px;display:block;"/><div class="xp-card-t">France Game</div><p class="xp-card-b">Baguette, brie, charcuterie board. Croissants for brunch kickoffs. Crepes for dessert. Red wine — it's France, that's the rule.</p></div>
    <div class="xp-card"><img src="https://flagcdn.com/w80/us.png" alt="USA" style="width:44px;height:auto;border-radius:4px;margin:0 auto 10px;display:block;"/><div class="xp-card-t">USA Game</div><p class="xp-card-b">Burgers, hot dogs, nachos, Buffalo wings. Coca-Cola in a giant cup. Pretzel bites with cheese dip. American sports watching at its finest.</p></div>
    <div class="xp-card"><img src="https://flagcdn.com/w80/ma.png" alt="Morocco" style="width:44px;height:auto;border-radius:4px;margin:0 auto 10px;display:block;"/><div class="xp-card-t">Morocco Game</div><p class="xp-card-b">Lamb tagine. Couscous. Harissa flatbreads. Mint tea. Bastilla if you want to go full Maghreb. Rich, warm, perfectly spiced.</p></div>
  </div>
</section>

<div class="xp-bg">
  <div class="xp-bg-in">
    <span class="xp-lbl">Host City Food</span>
    <h2 class="xp-ttl">EAT LIKE THE HOST CITIES</h2>
    <p class="xp-sub">The 2026 World Cup spans three countries with wildly different food cultures.</p>
    <div class="xp-grid3">
      <div class="xp-card"><span class="xp-card-icon">&#127474;&#127480;</span><div class="xp-card-t">Mexico — Guadalajara, CDMX, Monterrey</div><p class="xp-card-b">Street tacos, tlayudas, pozole, chiles en nogada. Mexican cuisine is a UNESCO Intangible Cultural Heritage — experience it properly. Skip the fast food.</p></div>
      <div class="xp-card"><span class="xp-card-icon">&#127482;&#127480;</span><div class="xp-card-t">USA — 11 Host Cities</div><p class="xp-card-b">Each US city has its signature: NY pizza, Miami Cuban food, Texas BBQ, LA Korean BBQ and tacos, Seattle seafood, Kansas City smoked ribs.</p></div>
      <div class="xp-card"><span class="xp-card-icon">&#127464;&#127462;</span><div class="xp-card-t">Canada — Toronto, Vancouver</div><p class="xp-card-b">Toronto's multicultural food scene: Ethiopian, Vietnamese, Caribbean. Vancouver: fresh Pacific seafood, ramen, sushi. Canada is an underrated food destination.</p></div>
    </div>
  </div>
</div>

<div class="xp-cta-strip">
  <span class="xp-lbl">Party Food Pack</span>
  <h2 class="xp-ttl" style="text-align:center;">DOWNLOAD THE MATCH FOOD GUIDE</h2>
  <p style="font-family:'DM Sans',sans-serif;font-size:.97rem;color:rgba(255,255,255,.5);max-width:500px;margin:0 auto 28px;line-height:1.7;">The complete World Cup 2026 match food guide — nation by nation, host city by host city. Part of the free fan pack download.</p>
  <a href="/world-cup/fan-pack/" class="xp-btn">Get Food Guide &#8594;</a>
</div>

<div class="xp-row">
  <a href="/world-cup/party/" class="xp-pill">&#127881; Watch Party Guide</a>
  <a href="/world-cup/songs/" class="xp-pill">&#127925; Songs</a>
  <a href="/world-cup/fan-pack/" class="xp-pill">&#127937; Fan Pack</a>
  <a href="/world-cup/travel-guide/" class="xp-pill">&#9992;&#65039; Travel Guide</a>
  <a href="/world-cup/host-cities/" class="xp-pill">&#127968; Host Cities</a>
</div>
'@
Patch 'food' $food

# ══════════════════════════════════════════════════════════════
# 7. FAN VOTING — engagement polls page
# ══════════════════════════════════════════════════════════════
$fanVoting = $S + @'
<style>
.fv-poll{background:#111;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:28px 24px;margin-bottom:18px;max-width:760px;margin-left:auto;margin-right:auto;margin-bottom:18px;}
.fv-q{font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:#fff;margin-bottom:18px;}
.fv-opt{display:flex;align-items:center;gap:12px;margin-bottom:10px;}
.fv-opt-label{font-family:'DM Sans',sans-serif;font-size:.82rem;color:rgba(255,255,255,.7);min-width:160px;flex-shrink:0;}
.fv-bar-wrap{flex:1;background:rgba(255,255,255,.06);border-radius:50px;height:10px;overflow:hidden;}
.fv-bar{height:100%;border-radius:50px;background:linear-gradient(90deg,#ff8c00,#ff3d6b);}
.fv-pct{font-family:'Bebas Neue',sans-serif;font-size:1rem;color:#ff8c00;min-width:42px;text-align:right;}
</style>

<section class="xp-section">
  <span class="xp-lbl">Fan Polls</span>
  <h2 class="xp-ttl">VOTE. YOUR VOICE. YOUR TOURNAMENT.</h2>
  <p class="xp-sub">The tournament's biggest debates — settled by fan votes. Results updated daily.</p>

  <div class="fv-poll">
    <div class="fv-q">Who wins the 2026 World Cup?</div>
    <div class="fv-opt"><span class="fv-opt-label">&#127463;&#127479; Brazil</span><div class="fv-bar-wrap"><div class="fv-bar" style="width:28%;"></div></div><span class="fv-pct">28%</span></div>
    <div class="fv-opt"><span class="fv-opt-label">&#127467;&#127479; France</span><div class="fv-bar-wrap"><div class="fv-bar" style="width:22%;"></div></div><span class="fv-pct">22%</span></div>
    <div class="fv-opt"><span class="fv-opt-label">&#127462;&#127479; Argentina</span><div class="fv-bar-wrap"><div class="fv-bar" style="width:19%;"></div></div><span class="fv-pct">19%</span></div>
    <div class="fv-opt"><span class="fv-opt-label">&#127466;&#127480; Spain</span><div class="fv-bar-wrap"><div class="fv-bar" style="width:14%;"></div></div><span class="fv-pct">14%</span></div>
    <div class="fv-opt"><span class="fv-opt-label">&#127477;&#127481; Portugal</span><div class="fv-bar-wrap"><div class="fv-bar" style="width:10%;"></div></div><span class="fv-pct">10%</span></div>
    <div class="fv-opt"><span class="fv-opt-label">Other</span><div class="fv-bar-wrap"><div class="fv-bar" style="width:7%;"></div></div><span class="fv-pct">7%</span></div>
  </div>

  <div class="fv-poll">
    <div class="fv-q">Who wins the Golden Boot?</div>
    <div class="fv-opt"><span class="fv-opt-label">&#127467;&#127479; Mbappe</span><div class="fv-bar-wrap"><div class="fv-bar" style="width:34%;"></div></div><span class="fv-pct">34%</span></div>
    <div class="fv-opt"><span class="fv-opt-label">&#127475;&#127476; Haaland</span><div class="fv-bar-wrap"><div class="fv-bar" style="width:26%;"></div></div><span class="fv-pct">26%</span></div>
    <div class="fv-opt"><span class="fv-opt-label">&#127463;&#127479; Vinicius Jr</span><div class="fv-bar-wrap"><div class="fv-bar" style="width:18%;"></div></div><span class="fv-pct">18%</span></div>
    <div class="fv-opt"><span class="fv-opt-label">&#127462;&#127479; Messi</span><div class="fv-bar-wrap"><div class="fv-bar" style="width:14%;"></div></div><span class="fv-pct">14%</span></div>
    <div class="fv-opt"><span class="fv-opt-label">Other</span><div class="fv-bar-wrap"><div class="fv-bar" style="width:8%;"></div></div><span class="fv-pct">8%</span></div>
  </div>

  <div class="fv-poll">
    <div class="fv-q">Which nation has the hottest fans?</div>
    <div class="fv-opt"><span class="fv-opt-label">&#127463;&#127479; Brazil</span><div class="fv-bar-wrap"><div class="fv-bar" style="width:38%;"></div></div><span class="fv-pct">38%</span></div>
    <div class="fv-opt"><span class="fv-opt-label">&#127464;&#127476; Colombia</span><div class="fv-bar-wrap"><div class="fv-bar" style="width:24%;"></div></div><span class="fv-pct">24%</span></div>
    <div class="fv-opt"><span class="fv-opt-label">&#127474;&#127480; Mexico</span><div class="fv-bar-wrap"><div class="fv-bar" style="width:18%;"></div></div><span class="fv-pct">18%</span></div>
    <div class="fv-opt"><span class="fv-opt-label">&#127462;&#127479; Argentina</span><div class="fv-bar-wrap"><div class="fv-bar" style="width:12%;"></div></div><span class="fv-pct">12%</span></div>
    <div class="fv-opt"><span class="fv-opt-label">Other</span><div class="fv-bar-wrap"><div class="fv-bar" style="width:8%;"></div></div><span class="fv-pct">8%</span></div>
  </div>
</section>

<div class="xp-cta-strip">
  <span class="xp-lbl">More Engagement</span>
  <h2 class="xp-ttl" style="text-align:center;">MEET FANS WHO VOTED LIKE YOU</h2>
  <p style="font-family:'DM Sans',sans-serif;font-size:.97rem;color:rgba(255,255,255,.5);max-width:500px;margin:0 auto 28px;line-height:1.7;">Find female football fans who back the same team, share your passion and want to watch the matches together.</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
    <a href="'@ + $AFF + @'" class="xp-btn" target="_blank" rel="noopener">Meet Football Fans &#8594;</a>
    <a href="/world-cup/wc-quiz/" class="xp-btn2">Take the Quiz</a>
  </div>
</div>

<div class="xp-row">
  <a href="/world-cup/wc-quiz/" class="xp-pill">&#127922; Quiz</a>
  <a href="/world-cup/hottest-fans/" class="xp-pill">&#128293; Hottest Fans</a>
  <a href="/world-cup/fan-girls/" class="xp-pill">&#10084; Fan Girls</a>
  <a href="/world-cup/predictions/" class="xp-pill">&#127919; Predictions</a>
  <a href="/world-cup/betting-odds/" class="xp-pill">&#128200; Betting Odds</a>
</div>
'@
Patch 'fan-voting' $fanVoting

# ══════════════════════════════════════════════════════════════
# 8. QUIZ — interactive quiz page
# ══════════════════════════════════════════════════════════════
$quiz = $S + @'
<style>
.qz-item{background:#111;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:24px 22px;margin-bottom:14px;max-width:800px;margin-left:auto;margin-right:auto;margin-bottom:14px;}
.qz-q{font-family:'DM Sans',sans-serif;font-size:.95rem;font-weight:700;color:#fff;margin-bottom:14px;}
.qz-opts{display:flex;flex-wrap:wrap;gap:8px;}
.qz-opt{font-family:'DM Sans',sans-serif;font-size:.78rem;padding:8px 16px;border-radius:50px;border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.65);cursor:pointer;transition:border-color .15s,background .15s;}
.qz-opt:hover{border-color:#ff8c00;color:#ff8c00;}
.qz-opt.correct{border-color:rgba(0,200,80,.5);background:rgba(0,200,80,.08);color:#4ade80;}
.qz-ans{font-family:'DM Sans',sans-serif;font-size:.78rem;color:rgba(255,255,255,.35);margin-top:10px;display:none;}
.qz-num{font-family:'Bebas Neue',sans-serif;font-size:.75rem;letter-spacing:2px;color:#ff8c00;margin-bottom:8px;display:block;}
</style>

<section class="xp-section">
  <span class="xp-lbl">Test Your Knowledge</span>
  <h2 class="xp-ttl">WORLD CUP 2026 QUIZ</h2>
  <p class="xp-sub">10 questions on World Cup history, the 2026 tournament and the competing nations. How many can you get right?</p>

  <div class="qz-item"><span class="qz-num">Q1</span><div class="qz-q">Which country will host the most matches at the 2026 World Cup?</div><div class="qz-opts"><span class="qz-opt correct">USA (11 venues)</span><span class="qz-opt">Mexico</span><span class="qz-opt">Canada</span><span class="qz-opt">All equal</span></div><div class="qz-ans">The United States hosts 11 of the 16 venues, including the MetLife Stadium for the final.</div></div>

  <div class="qz-item"><span class="qz-num">Q2</span><div class="qz-q">How many teams compete in the 2026 FIFA World Cup?</div><div class="qz-opts"><span class="qz-opt">32 Teams</span><span class="qz-opt correct">48 Teams</span><span class="qz-opt">36 Teams</span><span class="qz-opt">40 Teams</span></div><div class="qz-ans">2026 expands to 48 teams for the first time — up from 32 in previous tournaments.</div></div>

  <div class="qz-item"><span class="qz-num">Q3</span><div class="qz-q">Who are the defending World Cup champions?</div><div class="qz-opts"><span class="qz-opt">France</span><span class="qz-opt">Brazil</span><span class="qz-opt correct">Argentina</span><span class="qz-opt">Germany</span></div><div class="qz-ans">Argentina won the 2022 World Cup in Qatar, defeating France on penalties in one of the greatest finals ever played.</div></div>

  <div class="qz-item"><span class="qz-num">Q4</span><div class="qz-q">Which stadium hosts the 2026 World Cup Final?</div><div class="qz-opts"><span class="qz-opt">SoFi Stadium</span><span class="qz-opt">Estadio Azteca</span><span class="qz-opt">AT&T Stadium</span><span class="qz-opt correct">MetLife Stadium</span></div><div class="qz-ans">MetLife Stadium in East Rutherford, New Jersey hosts the 2026 World Cup Final on July 19.</div></div>

  <div class="qz-item"><span class="qz-num">Q5</span><div class="qz-q">Who is the all-time top scorer in World Cup history?</div><div class="qz-opts"><span class="qz-opt">Ronaldo</span><span class="qz-opt">Messi</span><span class="qz-opt correct">Miroslav Klose</span><span class="qz-opt">Gerd Muller</span></div><div class="qz-ans">Miroslav Klose holds the record with 16 goals across four World Cups for Germany (2002-2014).</div></div>

  <div class="qz-item"><span class="qz-num">Q6</span><div class="qz-q">Brazil has won the World Cup how many times?</div><div class="qz-opts"><span class="qz-opt">4</span><span class="qz-opt correct">5</span><span class="qz-opt">6</span><span class="qz-opt">3</span></div><div class="qz-ans">Brazil have won 5 World Cups — 1958, 1962, 1970, 1994 and 2002. The most of any nation.</div></div>

  <div class="qz-item"><span class="qz-num">Q7</span><div class="qz-q">How many matches are played in total at the 2026 World Cup?</div><div class="qz-opts"><span class="qz-opt">80</span><span class="qz-opt">96</span><span class="qz-opt correct">104</span><span class="qz-opt">112</span></div><div class="qz-ans">The expanded 48-team format produces 104 matches total — up from 64 in the previous format.</div></div>

  <div class="qz-item"><span class="qz-num">Q8</span><div class="qz-q">Which of these is NOT a host city for 2026?</div><div class="qz-opts"><span class="qz-opt">Kansas City</span><span class="qz-opt">Vancouver</span><span class="qz-opt correct">Chicago</span><span class="qz-opt">Seattle</span></div><div class="qz-ans">Chicago is not one of the 16 host cities. The US venues are: New York/NJ, LA, Dallas, San Francisco, Seattle, Kansas City, Atlanta, Miami, Philadelphia, Houston, and Boston.</div></div>

  <div class="qz-item"><span class="qz-num">Q9</span><div class="qz-q">Which nation reached the World Cup semi-finals for the first time in 2022?</div><div class="qz-opts"><span class="qz-opt">Senegal</span><span class="qz-opt">Ghana</span><span class="qz-opt correct">Morocco</span><span class="qz-opt">Tunisia</span></div><div class="qz-ans">Morocco became the first African nation to reach a World Cup semi-final at the 2022 Qatar tournament.</div></div>

  <div class="qz-item"><span class="qz-num">Q10</span><div class="qz-q">The 2026 World Cup opening ceremony takes place on what date?</div><div class="qz-opts"><span class="qz-opt">June 9</span><span class="qz-opt">June 10</span><span class="qz-opt correct">June 11</span><span class="qz-opt">June 12</span></div><div class="qz-ans">The opening ceremony is on June 11, 2026, launching the biggest World Cup in history.</div></div>
</section>

<div class="xp-cta-strip">
  <span class="xp-lbl">More Quizzes</span>
  <h2 class="xp-ttl" style="text-align:center;">THINK YOU KNOW YOUR FOOTBALL?</h2>
  <p style="font-family:'DM Sans',sans-serif;font-size:.97rem;color:rgba(255,255,255,.5);max-width:500px;margin:0 auto 28px;line-height:1.7;">Download the full 50-question World Cup quiz pack — perfect for half-time entertainment at your watch party. Part of the free fan pack.</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
    <a href="/world-cup/fan-pack/" class="xp-btn">Get the Quiz Pack &#8594;</a>
    <a href="/world-cup/fan-voting/" class="xp-btn2">Vote on Polls</a>
  </div>
</div>

<div class="xp-row">
  <a href="/world-cup/wc-quiz/" class="xp-pill">&#127922; Full Quiz</a>
  <a href="/world-cup/fan-voting/" class="xp-pill">&#128202; Fan Polls</a>
  <a href="/world-cup/history/" class="xp-pill">&#128218; History</a>
  <a href="/world-cup/records-stats/" class="xp-pill">&#128202; Records</a>
  <a href="/world-cup/fan-pack/" class="xp-pill">&#127937; Fan Pack</a>
</div>
'@
Patch 'quiz' $quiz

# ══════════════════════════════════════════════════════════════
# 9. PLAYERS — players index page
# ══════════════════════════════════════════════════════════════
$players = $S + @'
<section class="xp-section">
  <span class="xp-lbl">Player Hub</span>
  <h2 class="xp-ttl">2026 WORLD CUP PLAYERS</h2>
  <p class="xp-sub">The complete player guide — from tournament stars to rising talents and the veterans playing their last World Cup dance.</p>
  <div class="xp-grid3">
    <a href="/world-cup/star-players/" class="xp-card" style="text-decoration:none;display:block;"><span class="xp-card-icon">&#11088;</span><div class="xp-card-t">Star Players</div><p class="xp-card-b">The 16 players who will define the 2026 tournament. Mbappe, Haaland, Messi, Bellingham, Vinicius — the names that matter.</p></a>
    <div class="xp-card"><span class="xp-card-icon">&#128200;</span><div class="xp-card-t">Golden Boot Race</div><p class="xp-card-b">Who will finish as top scorer? Track the Golden Boot race as the tournament progresses. AI prediction: Mbappe leads the market.</p></div>
    <div class="xp-card"><span class="xp-card-icon">&#127941;</span><div class="xp-card-t">Ones to Watch</div><p class="xp-card-b">The breakout stars of 2026. Lamine Yamal, Florian Wirtz, Cole Palmer — the next generation arriving on the biggest stage.</p></div>
  </div>
</section>

<div class="xp-bg">
  <div class="xp-bg-in">
    <span class="xp-lbl">By Position</span>
    <h2 class="xp-ttl">PLAYERS TO WATCH BY POSITION</h2>
    <p class="xp-sub">The key individuals who will decide matches at each position on the pitch.</p>
    <div class="xp-grid4">
      <div class="xp-card"><span class="xp-card-icon">&#129354;</span><div class="xp-card-t">Goalkeepers</div><p class="xp-card-b">Emiliano Martinez (Argentina), Mike Maignan (France), Manuel Neuer (Germany). Who makes the save that wins the tournament?</p></div>
      <div class="xp-card"><span class="xp-card-icon">&#127795;</span><div class="xp-card-t">Defenders</div><p class="xp-card-b">Virgil van Dijk (Netherlands), Ruben Dias (Portugal), Achraf Hakimi (Morocco). The rocks behind every successful campaign.</p></div>
      <div class="xp-card"><span class="xp-card-icon">&#9889;</span><div class="xp-card-t">Midfielders</div><p class="xp-card-b">Bellingham (England), Pedri (Spain), Valverde (Uruguay), Wirtz (Germany). The creative engines who control tournament football.</p></div>
      <div class="xp-card"><span class="xp-card-icon">&#9917;</span><div class="xp-card-t">Forwards</div><p class="xp-card-b">Mbappe, Haaland, Vinicius Jr, Messi, Yamal. The front line that sells tickets, scores the goals and wins the World Cup.</p></div>
    </div>
  </div>
</div>

<div class="xp-cta-strip">
  <span class="xp-lbl">Player Posters</span>
  <h2 class="xp-ttl" style="text-align:center;">DOWNLOAD PLAYER POSTER PACKS</h2>
  <p style="font-family:'DM Sans',sans-serif;font-size:.97rem;color:rgba(255,255,255,.5);max-width:500px;margin:0 auto 28px;line-height:1.7;">16 print-quality player graphics, phone wallpapers and prediction cards. Free with the full fan pack download.</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
    <a href="/world-cup/star-players/" class="xp-btn">Star Players &#8594;</a>
    <a href="/world-cup/digital-download/" class="xp-btn2">Download Posters</a>
  </div>
</div>

<div class="xp-row">
  <a href="/world-cup/star-players/" class="xp-pill">&#11088; Star Players</a>
  <a href="/world-cup/teams/" class="xp-pill">&#127941; All Teams</a>
  <a href="/world-cup/predictions/" class="xp-pill">&#127919; Predictions</a>
  <a href="/world-cup/betting-odds/" class="xp-pill">&#128200; Betting Odds</a>
  <a href="/world-cup/wallpapers/" class="xp-pill">&#128247; Wallpapers</a>
</div>
'@
Patch 'players' $players

# ══════════════════════════════════════════════════════════════
# 10. WORLD-CUP-SHORTS — reels + short content hub
# ══════════════════════════════════════════════════════════════
$shorts = $S + @'
<section class="xp-section">
  <span class="xp-lbl">Short Form Content</span>
  <h2 class="xp-ttl">WORLD CUP 2026 SHORTS</h2>
  <p class="xp-sub">The best World Cup 2026 short-form content — goals, fan reactions, predictions, AI girlfriends and viral moments in 60 seconds or less.</p>
  <div class="xp-grid4">
    <div class="xp-card"><span class="xp-card-icon">&#9917;</span><div class="xp-card-t">Goal Compilations</div><p class="xp-card-b">Every goal reel from the tournament — the screamers, the tap-ins, the penalties. All goals from the 2026 World Cup in short form.</p></div>
    <div class="xp-card"><span class="xp-card-icon">&#10084;&#65039;</span><div class="xp-card-t">Fan Girl Reels</div><p class="xp-card-b">The most beautiful and passionate female fans from all 48 nations. Fan girl match day looks, reactions and celebrations — the hottest fan content from 2026.</p></div>
    <div class="xp-card"><span class="xp-card-icon">&#129302;</span><div class="xp-card-t">AI Predictions</div><p class="xp-card-b">Our AI football girlfriends making match predictions before kick off. Which AI girl got it right? Which one spectacularly got it wrong?</p></div>
    <div class="xp-card"><span class="xp-card-icon">&#128293;</span><div class="xp-card-t">Viral Moments</div><p class="xp-card-b">The moments that broke the internet during the 2026 World Cup. Celebrations, upsets, crazy goals, red cards and fan zone madness.</p></div>
  </div>
</section>

<div class="xp-bg">
  <div class="xp-bg-in">
    <span class="xp-lbl">Series</span>
    <h2 class="xp-ttl">CONTENT SERIES</h2>
    <p class="xp-sub">Ongoing short-form series throughout the tournament.</p>
    <div style="max-width:700px;margin:0 auto;">
      <div class="xp-hl"><span class="xp-hl-num">&#9917;</span><div><div class="xp-hl-t">Daily Goal Reel</div><p class="xp-hl-b">Every goal from the previous matchday in one 60-second reel. Posted within 2 hours of the last match finishing each day.</p></div></div>
      <div class="xp-hl"><span class="xp-hl-num">&#10084;</span><div><div class="xp-hl-t">Fan Girl of the Day</div><p class="xp-hl-b">The most stunning female fan from each day's matches. Voted on by our community — updated every match day.</p></div></div>
      <div class="xp-hl"><span class="xp-hl-num">&#129302;</span><div><div class="xp-hl-t">AI vs Reality</div><p class="xp-hl-b">Did our AI girlfriend prediction come true? We post the original prediction and the actual result every match day. She's right more than you'd think.</p></div></div>
      <div class="xp-hl"><span class="xp-hl-num">&#128293;</span><div><div class="xp-hl-t">Upset of the Day</div><p class="xp-hl-b">When the Group of Death delivers — the biggest shock, the biggest giant-killing, the best upset reaction. Moments that define a World Cup.</p></div></div>
    </div>
  </div>
</div>

<div class="xp-cta-strip">
  <span class="xp-lbl">Follow Us</span>
  <h2 class="xp-ttl" style="text-align:center;">FOLLOW FOR DAILY REELS</h2>
  <p style="font-family:'DM Sans',sans-serif;font-size:.97rem;color:rgba(255,255,255,.5);max-width:500px;margin:0 auto 28px;line-height:1.7;">Daily goal reels, fan girl content, AI predictions and viral moments throughout the 2026 World Cup. Follow Tempting Babes for the best short-form tournament content.</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
    <a href="/world-cup/fan-girls/" class="xp-btn">Fan Girls &#8594;</a>
    <a href="/world-cup/viral-moments/" class="xp-btn2">Viral Moments</a>
  </div>
</div>

<div class="xp-row">
  <a href="/world-cup/highlights/" class="xp-pill">&#9917; Highlights</a>
  <a href="/world-cup/goals/" class="xp-pill">&#127919; Goals</a>
  <a href="/world-cup/viral-moments/" class="xp-pill">&#128293; Viral Moments</a>
  <a href="/world-cup/fan-girls/" class="xp-pill">&#10084; Fan Girls</a>
  <a href="/world-cup/memes/" class="xp-pill">&#128514; Memes</a>
</div>
'@
Patch 'world-cup-shorts' $shorts

# ══════════════════════════════════════════════════════════════
# 11. MATCH COUNTDOWNS — countdown timers page
# ══════════════════════════════════════════════════════════════
$countdownsContent = $S + @'
<style>
.cd-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:960px;margin:0 auto;}
@media(max-width:700px){.cd-grid{grid-template-columns:1fr;}}
.cd-card{background:#111;border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:32px 22px;text-align:center;position:relative;overflow:hidden;transition:border-color .2s;}
.cd-card.featured{border-color:rgba(255,140,0,.3);background:linear-gradient(180deg,rgba(255,140,0,.07) 0%,#111 50%);}
.cd-card:hover{border-color:rgba(255,140,0,.4);}
.cd-eyebrow{font-family:'DM Sans',sans-serif;font-size:.62rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#ff8c00;margin-bottom:10px;display:block;}
.cd-match{font-family:'Bebas Neue',sans-serif;font-size:1.5rem;color:#fff;margin-bottom:6px;line-height:1.1;}
.cd-venue{font-family:'DM Sans',sans-serif;font-size:.7rem;color:rgba(255,255,255,.4);margin-bottom:18px;}
.cd-clock{display:flex;gap:10px;justify-content:center;margin-bottom:16px;}
.cd-unit{text-align:center;}
.cd-num{font-family:'Bebas Neue',sans-serif;font-size:2.5rem;background:linear-gradient(135deg,#ff8c00,#ff3d6b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;display:block;}
.cd-sep{font-family:'Bebas Neue',sans-serif;font-size:2rem;color:rgba(255,140,0,.5);align-self:flex-start;padding-top:2px;}
.cd-label{font-family:'DM Sans',sans-serif;font-size:.55rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.3);margin-top:3px;display:block;}
.cd-date{font-family:'DM Sans',sans-serif;font-size:.75rem;color:rgba(255,255,255,.38);margin-bottom:14px;}
</style>

<section class="xp-section">
  <span class="xp-lbl">Tournament Countdowns</span>
  <h2 class="xp-ttl">COUNTDOWN TO KICK OFF</h2>
  <p class="xp-sub">Every major 2026 World Cup milestone — counted down to the second.</p>
  <div class="cd-grid">
    <div class="cd-card featured">
      <span class="cd-eyebrow">&#9917; Opening Match</span>
      <div class="cd-match">Mexico vs [TBC]</div>
      <div class="cd-venue">Estadio Azteca — Mexico City</div>
      <div class="cd-clock">
        <div class="cd-unit"><span class="cd-num" id="d1">10</span><span class="cd-label">Days</span></div>
        <span class="cd-sep">:</span>
        <div class="cd-unit"><span class="cd-num" id="h1">14</span><span class="cd-label">Hours</span></div>
        <span class="cd-sep">:</span>
        <div class="cd-unit"><span class="cd-num" id="m1">22</span><span class="cd-label">Mins</span></div>
      </div>
      <div class="cd-date">June 11, 2026 — Opening Ceremony + First Match</div>
    </div>
    <div class="cd-card">
      <span class="cd-eyebrow">&#127968; Host Nation</span>
      <div class="cd-match">USA Opener</div>
      <div class="cd-venue">SoFi Stadium — Los Angeles</div>
      <div class="cd-clock">
        <div class="cd-unit"><span class="cd-num">11</span><span class="cd-label">Days</span></div>
        <span class="cd-sep">:</span>
        <div class="cd-unit"><span class="cd-num">08</span><span class="cd-label">Hours</span></div>
        <span class="cd-sep">:</span>
        <div class="cd-unit"><span class="cd-num">45</span><span class="cd-label">Mins</span></div>
      </div>
      <div class="cd-date">June 12, 2026 — Group Stage Begins</div>
    </div>
    <div class="cd-card">
      <span class="cd-eyebrow">&#127881; The Final</span>
      <div class="cd-match">2026 World Cup Final</div>
      <div class="cd-venue">MetLife Stadium — New Jersey</div>
      <div class="cd-clock">
        <div class="cd-unit"><span class="cd-num">48</span><span class="cd-label">Days</span></div>
        <span class="cd-sep">:</span>
        <div class="cd-unit"><span class="cd-num">16</span><span class="cd-label">Hours</span></div>
        <span class="cd-sep">:</span>
        <div class="cd-unit"><span class="cd-num">00</span><span class="cd-label">Mins</span></div>
      </div>
      <div class="cd-date">July 19, 2026 — The Greatest Match on Earth</div>
    </div>
    <div class="cd-card">
      <span class="cd-eyebrow">&#127937; Knockout Stage</span>
      <div class="cd-match">Round of 32</div>
      <div class="cd-venue">Multiple Venues — USA</div>
      <div class="cd-clock">
        <div class="cd-unit"><span class="cd-num">23</span><span class="cd-label">Days</span></div>
        <span class="cd-sep">:</span>
        <div class="cd-unit"><span class="cd-num">04</span><span class="cd-label">Hours</span></div>
        <span class="cd-sep">:</span>
        <div class="cd-unit"><span class="cd-num">00</span><span class="cd-label">Mins</span></div>
      </div>
      <div class="cd-date">From July 3, 2026 — First Knockouts</div>
    </div>
    <div class="cd-card">
      <span class="cd-eyebrow">&#9889; Semi-Finals</span>
      <div class="cd-match">World Cup Semi-Finals</div>
      <div class="cd-venue">MetLife + Rose Bowl</div>
      <div class="cd-clock">
        <div class="cd-unit"><span class="cd-num">40</span><span class="cd-label">Days</span></div>
        <span class="cd-sep">:</span>
        <div class="cd-unit"><span class="cd-num">12</span><span class="cd-label">Hours</span></div>
        <span class="cd-sep">:</span>
        <div class="cd-unit"><span class="cd-num">00</span><span class="cd-label">Mins</span></div>
      </div>
      <div class="cd-date">From July 14, 2026 — The Last Four</div>
    </div>
    <div class="cd-card">
      <span class="cd-eyebrow">&#127941; Group of Death</span>
      <div class="cd-match">Portugal vs Brazil</div>
      <div class="cd-venue">Group G — Miami</div>
      <div class="cd-clock">
        <div class="cd-unit"><span class="cd-num">15</span><span class="cd-label">Days</span></div>
        <span class="cd-sep">:</span>
        <div class="cd-unit"><span class="cd-num">20</span><span class="cd-label">Hours</span></div>
        <span class="cd-sep">:</span>
        <div class="cd-unit"><span class="cd-num">00</span><span class="cd-label">Mins</span></div>
      </div>
      <div class="cd-date">June 15, 2026 — The Match Everyone Wants</div>
    </div>
  </div>
</section>

<div class="xp-cta-strip">
  <span class="xp-lbl">Don't Miss a Kick Off</span>
  <h2 class="xp-ttl" style="text-align:center;">GET FREE MATCH ALERTS</h2>
  <p style="font-family:'DM Sans',sans-serif;font-size:.97rem;color:rgba(255,255,255,.5);max-width:500px;margin:0 auto 28px;line-height:1.7;">Never miss kick off. Get match alerts for your team plus the biggest matches of the tournament — direct to your phone or email.</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
    <a href="/world-cup/match-alerts/" class="xp-btn">Get Match Alerts &#8594;</a>
    <a href="/world-cup/schedule/" class="xp-btn2">Full Schedule</a>
  </div>
</div>

<div class="xp-row">
  <a href="/world-cup/schedule/" class="xp-pill">&#128197; Full Schedule</a>
  <a href="/world-cup/match-alerts/" class="xp-pill">&#128276; Match Alerts</a>
  <a href="/world-cup/live-scores/" class="xp-pill">&#128308; Live Scores</a>
  <a href="/world-cup/predictions/" class="xp-pill">&#127919; Predictions</a>
  <a href="/world-cup/the-final/" class="xp-pill">&#127881; The Final</a>
</div>
'@
Patch 'match-countdowns' $countdownsContent

# ══════════════════════════════════════════════════════════════
# Summary
Write-Host ""
Write-Host "All patches applied."
