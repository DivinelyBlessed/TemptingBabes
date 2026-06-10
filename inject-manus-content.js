const fs = require('fs');
const path = require('path');

const DOWNLOAD_DIR = 'C:\\Users\\Hp\\Downloads\\Title Missing_ Please Provide Context or Content Summary2';
const SITE_DIR = 'C:\\Users\\Hp\\OneDrive\\Desktop\\Tempting Babes';

// ── PARSER ────────────────────────────────────────────────────────────────────
// Uses indexOf instead of regex lookaheads — reliable across all .md formats
function parseMd(raw) {
  // Normalise line endings
  raw = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // PAGE — handles "# PAGE: /path/" and "PAGE: /path/"
  const pageMatch = raw.match(/^#?\s*PAGE:\s*(.+)$/m);
  const page = pageMatch ? pageMatch[1].trim() : null;

  // Extract a named section from raw text using string positions
  function extract(startLabel, ...endLabels) {
    const marker = '\n' + startLabel + '\n';
    const idx = raw.indexOf(marker);
    if (idx === -1) return null;
    const start = idx + marker.length;
    let end = raw.length;
    endLabels.forEach(lbl => {
      const pos = raw.indexOf('\n' + lbl, start);
      if (pos !== -1 && pos < end) end = pos;
    });
    return raw.slice(start, end).trim();
  }

  const content      = extract('CONTENT:',      'FAQ:', 'CTA TEXT:', 'INTERNAL LINK:');
  const faq          = extract('FAQ:',           'CTA TEXT:', 'INTERNAL LINK:');
  const ctaMatch     = raw.match(/^CTA TEXT:\s*(.+)$/m);
  const linkMatch    = raw.match(/^INTERNAL LINK:\s*(.+)$/m);

  return {
    page,
    content,
    faq,
    cta:          ctaMatch  ? ctaMatch[1].trim()  : null,
    internalLink: linkMatch ? linkMatch[1].trim() : null,
  };
}

// ── MARKDOWN → HTML ───────────────────────────────────────────────────────────
function breakSentences(line) {
  const sentences = line.match(/[^.!?]+[.!?]+["']?\s*/g);
  if (!sentences || sentences.length <= 2) return [line.trim()];
  const paras = [];
  for (let i = 0; i < sentences.length; i += 2) {
    paras.push(sentences.slice(i, i + 2).join('').trim());
  }
  return paras;
}

function fixBecause(text) {
  return text
    .replace(/([.!?])\s+Because /g, '$1 This is because ')
    .replace(/^Because /gm, 'This is because ');
}

function mdToHtml(md) {
  let html = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Fix sentences starting with "Because"
  html = fixBecause(html);

  // H2 — full-screen width, breaks out of container, 1 line
  html = html.replace(/^## (.+)$/gm, (_, title) =>
    `\n<div style="width:100vw;position:relative;left:50%;transform:translateX(-50%);text-align:center;margin-top:56px;margin-bottom:32px;overflow:hidden;padding:0 20px;box-sizing:border-box;"><h2 style="font-family:'Bebas Neue',sans-serif;font-size:clamp(1.8rem,3vw,3.7rem);line-height:1.1;white-space:nowrap;background:linear-gradient(90deg,#ff8c00,#ff3d6b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin:0 0 16px;">${title}</h2><div style="width:44px;height:3px;background:linear-gradient(90deg,#ff8c00,#ff3d6b);border-radius:2px;margin:0 auto;"></div></div>\n`
  );

  // H3 — centered, gradient coloring matching H2
  html = html.replace(/^### (.+)$/gm, (_, title) =>
    `\n<h3 style="font-family:'Bebas Neue',sans-serif;font-size:clamp(1.6rem,2.5vw,2.8rem);line-height:1.1;text-align:center;margin:44px 0 16px;background:linear-gradient(90deg,#ff8c00,#ff3d6b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${title}</h3>\n`
  );

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g,
    '<strong style="color:#fff;font-weight:700;">$1</strong>');

  // Italic
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  // Bullet lists — group consecutive * or - lines
  html = html.replace(/((?:^[*\-] .+\n?)+)/gm, match => {
    const items = match.trim().split('\n').map(line => {
      const text = line.replace(/^[*\-] /, '').trim();
      return `<li style="display:flex;gap:10px;align-items:flex-start;padding:5px 0;font-family:'DM Sans',sans-serif;font-size:1rem;color:rgba(255,255,255,0.78);line-height:1.65;">`
           + `<span style="color:#ff8c00;font-weight:700;flex-shrink:0;font-size:1.1rem;margin-top:1px;">›</span>`
           + `<span>${text}</span></li>`;
    }).join('\n');
    return `<ul style="list-style:none;margin:16px 0 28px;padding:0;display:flex;flex-direction:column;gap:4px;">\n${items}\n</ul>\n`;
  });

  // Plain text → paragraphs, max 2 sentences each; skip HTML tag lines
  html = html.replace(/^(?!\s*<|\s*$)(.+)$/gm, (_, line) => {
    const paras = breakSentences(line);
    return paras.map(p =>
      `<p style="font-family:'DM Sans',sans-serif;font-size:1.06rem;color:rgba(255,255,255,0.85);line-height:1.85;margin-bottom:18px;">${p}</p>`
    ).join('\n');
  });

  // Clean up excess blank lines
  html = html.replace(/\n{3,}/g, '\n\n');

  return html.trim();
}

// ── FAQ → HTML ────────────────────────────────────────────────────────────────
function buildFaqHtml(faqText) {
  if (!faqText || !faqText.trim()) return '';

  // Split on "Q:" at start of line
  const raw    = faqText.replace(/\r\n/g, '\n');
  const blocks = raw.split(/\nQ:/).map(b => b.trim()).filter(Boolean);

  const items = blocks.map(block => {
    const aIdx = block.search(/\nA:/);
    if (aIdx === -1) return '';
    const q = block.slice(0, aIdx).replace(/^Q:/, '').trim();
    const a = block.slice(aIdx).replace(/^\nA:/, '').trim();
    if (!q || !a) return '';
    return `
  <details style="background:#111;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px 22px;margin-bottom:10px;">
    <summary style="font-family:'DM Sans',sans-serif;font-size:0.96rem;font-weight:600;color:#ff8c00;cursor:pointer;list-style:none;">${q}</summary>
    <p style="font-family:'DM Sans',sans-serif;font-size:0.9rem;color:rgba(255,255,255,0.7);line-height:1.75;margin-top:12px;">${a}</p>
  </details>`;
  }).filter(Boolean);

  if (!items.length) return '';

  return `
<hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:56px 0 40px;">
<div style="text-align:center;margin-bottom:28px;">
  <span style="font-family:'Bebas Neue',sans-serif;font-size:1.5rem;letter-spacing:4px;color:#fff;">FAQ</span>
</div>
<div style="max-width:760px;margin:0 auto;">
${items.join('')}
</div>`;
}

// ── INJECT ────────────────────────────────────────────────────────────────────
function injectContent(html, newBlock) {
  // Try replacing existing pg-content block (including already-injected ones)
  if (/<div class="pg-content"/.test(html)) {
    const replaced = html.replace(
      /<div class="pg-content"[\s\S]*?<\/div>\s*\n*(?=<footer)/,
      newBlock + '\n\n'
    );
    if (replaced !== html) return replaced;
  }

  // Fallback: replace pg-body div
  if (html.includes('<div class="pg-body">')) {
    const replaced = html.replace(
      /<div class="pg-body">[\s\S]*?(?=<footer)/,
      newBlock + '\n\n'
    );
    if (replaced !== html) return replaced;
  }

  // Last resort: insert before footer
  return html.replace(/(?=<footer\s)/, newBlock + '\n\n');
}

// ── MAP PAGE PATH TO FILE ─────────────────────────────────────────────────────
function resolveHtmlPath(pagePath) {
  const clean = pagePath.replace(/^\//, '').replace(/\/$/, '');
  return path.join(SITE_DIR, clean, 'index.html');
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
const files = fs.readdirSync(DOWNLOAD_DIR).filter(f => f.endsWith('.md'));
let ok = 0, skipped = 0;

files.forEach(file => {
  const raw = fs.readFileSync(path.join(DOWNLOAD_DIR, file), 'utf8');
  const { page, content, faq } = parseMd(raw);

  if (!page) {
    console.log(`SKIP  ${file} — no PAGE field`);
    skipped++; return;
  }

  const htmlPath = resolveHtmlPath(page);
  if (!fs.existsSync(htmlPath)) {
    console.log(`SKIP  ${file} — no HTML file: ${htmlPath}`);
    skipped++; return;
  }

  const bodyHtml = content ? mdToHtml(content) : '';
  const faqHtml  = buildFaqHtml(faq);

  const newBlock = `<div class="pg-content" style="max-width:1080px;margin:0 auto;padding:56px 48px 80px;">
${bodyHtml}
${faqHtml}
</div>`;

  const original = fs.readFileSync(htmlPath, 'utf8');
  const updated  = injectContent(original, newBlock);

  if (updated === original) {
    console.log(`SKIP  ${file} — injection point not found`);
    skipped++; return;
  }

  fs.writeFileSync(htmlPath, updated, 'utf8');
  console.log(`OK    ${file} → ${page}`);
  ok++;
});

console.log(`\nFinished: ${ok} updated, ${skipped} skipped`);
