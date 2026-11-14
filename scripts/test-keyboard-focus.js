// Keyboard focus bench for 'I Grandi di Terramare'.
//
// The rule (Roccobot.md, section 'La navigazione con la tastiera non si vede', owner's
// choice Ambito-01): the control reached with Tab shows NO ring (no outline, no box-shadow
// or border added by :focus / :focus-visible), and it changes exactly like on mouse hover,
// so the keyboard still has a visible sign (WCAG 2.4.7). Text fields are exempt from the
// change: their sign is the caret.
//
// The bench presses REAL Tab keys: a button gets :focus-visible only from the keyboard,
// and .focus() from code would leave the control at rest and prove nothing.
// For every control reached it compares three readings of the computed style: at rest,
// under the mouse, and focused from the keyboard. Checkboxes hidden for accessibility are
// read through what the eye sees, the box next to them and the row that holds them.
//
// It walks: the page, the Panel, the site search, the maps list, the image viewer, and the
// admin area (password gate, choice modal, Console), whose Worker is answered by a stub.
// Two themes (the system one decides it) and two widths, 1280 and 390.
//
// It runs on the GENERATED page (index.html, app.js, admin.js): build first with
// `node .github/scripts/minify.mjs .` (esbuild installed), then, from the repo root:
//   NODE_PATH=/opt/node22/lib/node_modules node scripts/test-keyboard-focus.js [repo dir]
// The repo dir defaults to the parent of this script; it is served at /earthsea/.
// PROVA_VERBOSE=1 prints the green checks too. The output lists the red ones (KO).
//
// Author: Rocco Casadei, a.k.a. Roccobot
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const PORT = Number(process.env.PROVA_PORT || 8774);
const PAGE = `http://127.0.0.1:${PORT}/earthsea/index.html?d=full`;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.webmanifest': 'application/manifest+json' };

// Serves REPO at /earthsea/, so the absolute paths of the page are the production ones.
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/earthsea\//, '/');
  const file = path.join(REPO, rel);
  if (!file.startsWith(REPO)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
});

let failed = 0, passed = 0;
function check(name, ok, detail) {
  if (ok) passed++; else failed++;
  if (!ok || process.env.PROVA_VERBOSE) console.log(`${ok ? 'OK ' : 'KO '} ${name}${detail ? '  -> ' + detail : ''}`);
}

// In-page helpers, installed once per page.
const HELPERS = () => {
  const PROPS = ['color', 'backgroundColor', 'backgroundImage', 'borderTopColor', 'borderRightColor',
    'borderBottomColor', 'borderLeftColor', 'opacity', 'filter', 'textDecorationColor', 'transform', 'boxShadow'];
  const RING = ['outlineStyle', 'outlineWidth', 'boxShadow', 'borderTopColor', 'borderRightColor',
    'borderBottomColor', 'borderLeftColor', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth',
    'borderLeftWidth'];
  // What the eye sees of a control: itself and its parent (a ring drawn by :focus-within is a
  // ring too, and the title's gradient is painted by the h1 around the link), and for a
  // visually hidden checkbox the box next to it and the row (label) that holds it.
  window.__kfNodes = (el, withParent = true) => {
    const nodes = [el];
    const r = el.getBoundingClientRect();
    if (el.tagName === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio') && (r.width <= 2 || r.height <= 2)) {
      if (el.nextElementSibling) nodes.push(el.nextElementSibling);
      const row = el.closest('label');
      if (row && !nodes.includes(row)) nodes.push(row);
    }
    if (withParent && el.parentElement && !nodes.includes(el.parentElement)) nodes.push(el.parentElement);
    return nodes;
  };
  // A box that is focusable because it scrolls (the browser makes it so, or a tabindex lets
  // the arrows scroll it, like the table of the micro-adjustments) is not a control: it
  // must not ring, and it needs no sign (`#ctrl-panel`).
  window.__kfScroller = (el) => !['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'SUMMARY'].includes(el.tagName) &&
    !el.getAttribute('role') && /auto|scroll/.test(getComputedStyle(el).overflowY + getComputedStyle(el).overflowX);
  window.__kfSnap = (el) => window.__kfNodes(el).map((n) => {
    const cs = getComputedStyle(n);
    const o = {};
    for (const p of PROPS.concat(RING)) o[p] = cs[p];
    return o;
  });
  window.__kfDesc = (el) => {
    const id = el.id ? '#' + el.id : '';
    const cls = typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
    const lbl = (el.getAttribute('aria-label') || el.title || el.textContent || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 28);
    return el.tagName.toLowerCase() + id + cls + (lbl ? ` '${lbl}'` : '');
  };
  window.__kfTextField = (el) => el.tagName === 'TEXTAREA' || el.isContentEditable ||
    (el.tagName === 'INPUT' && !['checkbox', 'radio', 'range', 'button', 'submit', 'reset', 'color', 'file'].includes(el.type));
  window.__kfVisible = (el) => {
    for (const n of window.__kfNodes(el, false)) {
      const r = n.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      let ok = true;
      for (let a = n; a && a !== document.documentElement; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) { ok = false; break; }
      }
      if (ok) return true;
    }
    return false;
  };
};

// A picture of what the eye sees of a control, 3px around it. The second picture of the
// same control takes the size of the first, centred on where the control is now (the page
// may have scrolled in between). A style can change and still show nothing (a white veil
// on a white bar): the pixels are the proof that the sign is VISIBLE.
async function shoot(page, kf, size) {
  const vp = page.viewportSize();
  const r = await page.evaluate((id) => {
    const el = document.querySelector(`[data-kf="${id}"]`);
    if (!el) return null;
    const node = window.__kfNodes(el, false).find((n) => { const b = n.getBoundingClientRect(); return b.width >= 2 && b.height >= 2; });
    if (!node) return null;
    const b = node.getBoundingClientRect();
    return { cx: b.left + b.width / 2, cy: b.top + b.height / 2, w: b.width + 6, h: b.height + 6 };
  }, kf);
  if (!r) return null;
  const w = Math.round(size ? size.w : r.w), h = Math.round(size ? size.h : r.h);
  const x = Math.round(r.cx - w / 2), y = Math.round(r.cy - h / 2);
  if (x < 0 || y < 0 || x + w > vp.width || y + h > vp.height || w < 2 || h < 2) return null;
  const png = await page.screenshot({ clip: { x, y, width: w, height: h } });
  return { w, h, data: png.toString('base64') };
}

// Pixels that differ between two pictures of the same size (a channel moved by 8 or more).
async function pixelDiff(page, a, b) {
  return page.evaluate(async ([pa, pb]) => {
    const load = async (s) => createImageBitmap(await (await fetch('data:image/png;base64,' + s)).blob());
    const [ia, ib] = await Promise.all([load(pa.data), load(pb.data)]);
    const w = Math.min(ia.width, ib.width), h = Math.min(ia.height, ib.height);
    const px = (img) => { const c = new OffscreenCanvas(w, h); const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, w, h).data; };
    const da = px(ia), db = px(ib);
    let n = 0;
    for (let i = 0; i < da.length; i += 4) {
      if (Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2])) >= 8) n++;
    }
    return { n, of: w * h };
  }, [a, b]);
}

// One walk: real Tab presses inside the current state of the page, until the focus comes
// back to a control already seen (focus traps cycle) or leaves to <body>.
async function walk(page, phase, ctx, maxTabs, restPoint) {
  const visited = [];
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(380); // the hover styles have transitions up to ~0.3s
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      if (!el.dataset.kf) el.dataset.kf = String(++window.__kfCount);
      // Covered: something else (the mobile sheet over the FAB) is on top of the control's
      // centre, so no sign of it can be seen; reported, not judged on pixels.
      const nodes = window.__kfNodes(el, false);
      const node = nodes.find((n) => { const b = n.getBoundingClientRect(); return b.width >= 2 && b.height >= 2; });
      let covered = false;
      if (node) {
        const b = node.getBoundingClientRect();
        const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        covered = !!hit && !nodes.some((n) => n === hit || n.contains(hit));
      }
      return { kf: el.dataset.kf, desc: window.__kfDesc(el), fv: el.matches(':focus-visible'),
        text: window.__kfTextField(el), scroller: window.__kfScroller(el), visible: window.__kfVisible(el),
        covered, focus: window.__kfSnap(el) };
    });
    if (!info) break;
    if (visited.some((v) => v.kf === info.kf)) break;
    if (info.visible && !info.text && !info.scroller && !info.covered) info.shot = await shoot(page, info.kf, null);
    if (info.covered) console.log(`--  ${ctx} ${phase}: ${info.desc} (coperto da un altro elemento: i pixel non si giudicano)`);
    visited.push(info);
  }
  if (!visited.length) { check(`${ctx} ${phase}: il Tab raggiunge qualcosa`, false, 'nessun comando raggiunto'); return; }
  // Rest reading: every control but the one that holds the focus now (the walk ends when
  // the focus comes back to a control already seen) is at rest; then one more Tab, and the
  // one left behind is read too. The mouse goes to a neutral point first.
  await page.mouse.move(restPoint.x, restPoint.y);
  await page.waitForTimeout(380);
  const read = (ids) => page.evaluate((list) => {
    const out = {};
    for (const kf of list) {
      const el = document.querySelector(`[data-kf="${kf}"]`);
      if (el && el !== document.activeElement) out[kf] = window.__kfSnap(el);
    }
    return out;
  }, ids);
  const rest = await read(visited.map((v) => v.kf));
  const missing = visited.map((v) => v.kf).filter((kf) => !rest[kf]);
  if (missing.length) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(380);
    Object.assign(rest, await read(missing));
  }
  // Hover reading: the mouse over each control, with the focus elsewhere. The control is
  // brought into view first (a mouse outside the viewport hovers nothing), and the reading
  // counts only if the point under the mouse belongs to the control: a control that is
  // invisible until focused (the jump buttons) cannot be hovered, and has no hover style
  // to compare with.
  const hover = {}, restShot = {};
  for (const v of visited) {
    const box = await page.evaluate((kf) => {
      const el = document.querySelector(`[data-kf="${kf}"]`);
      if (!el) return null;
      if (document.activeElement === el) document.activeElement.blur();
      const nodes = window.__kfNodes(el, false);
      const node = nodes.find((n) => { const r = n.getBoundingClientRect(); return r.width >= 2 && r.height >= 2; });
      if (!node) return null;
      node.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
      const r = node.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const hit = document.elementFromPoint(x, y);
      const hoverable = !!hit && nodes.some((n) => n === hit || n.contains(hit)) && window.__kfVisible(el);
      return { x, y, hoverable };
    }, v.kf);
    if (!box) continue;
    if (v.shot) { await page.waitForTimeout(380); restShot[v.kf] = await shoot(page, v.kf, v.shot); }
    if (!box.hoverable) continue;
    await page.mouse.move(box.x, box.y);
    await page.waitForTimeout(380);
    hover[v.kf] = await page.evaluate((kf) => {
      const el = document.querySelector(`[data-kf="${kf}"]`);
      return el && el !== document.activeElement ? window.__kfSnap(el) : null;
    }, v.kf);
    await page.mouse.move(restPoint.x, restPoint.y);
  }
  await page.mouse.move(restPoint.x, restPoint.y);

  for (const v of visited) {
    const name = `${ctx} ${phase}: ${v.desc}`;
    if (!v.visible) { if (process.env.PROVA_VERBOSE) console.log(`--  ${name} (invisibile, saltato)`); continue; }
    check(`${name}: è :focus-visible`, v.fv);
    const r = rest[v.kf], h = hover[v.kf];
    if (!r) { check(`${name}: lettura a riposo`, false, 'non riuscita'); continue; }
    // No ring: no outline at all, and no box-shadow or border colour that the focus adds
    // and the hover does not have. A border colour counts only where the border is drawn
    // (a colour on a zero-width border shows nothing).
    const rings = [];
    v.focus.forEach((f, i) => {
      if (f.outlineStyle !== 'none' && parseFloat(f.outlineWidth) > 0) rings.push(`outline ${f.outlineStyle} ${f.outlineWidth} sul nodo ${i}`);
      for (const p of ['boxShadow', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor']) {
        if (p !== 'boxShadow' && parseFloat(f[p.replace('Color', 'Width')]) === 0) continue;
        if (f[p] !== r[i][p] && !(h && h[i] && f[p] === h[i][p])) rings.push(`${p} aggiunto dal fuoco sul nodo ${i}`);
      }
    });
    check(`${name}: niente anello`, !rings.length, rings.join('; '));
    if (v.text || v.scroller) continue; // the caret is the sign of a text field; a scroll box is no control
    const PROPS = ['color', 'backgroundColor', 'backgroundImage', 'borderTopColor', 'borderRightColor',
      'borderBottomColor', 'borderLeftColor', 'opacity', 'filter', 'textDecorationColor', 'transform', 'boxShadow'];
    const changed = [];
    v.focus.forEach((f, i) => { for (const p of PROPS) if (f[p] !== r[i][p]) changed.push(`${p}@${i}`); });
    check(`${name}: cambia rispetto al riposo`, changed.length > 0, changed.length ? '' : 'identico al riposo');
    // The change must be visible: at least 12 pixels differ between the two pictures.
    if (v.shot && restShot[v.kf]) {
      const d = await pixelDiff(page, v.shot, restShot[v.kf]);
      check(`${name}: il segno si vede`, d.n >= 12, `${d.n} pixel diversi su ${d.of}`);
    }
    if (h && changed.length) {
      const diff = [];
      v.focus.forEach((f, i) => { for (const p of PROPS) if (f[p] !== h[i][p]) diff.push(`${p}@${i}: fuoco ${f[p]} / mouse ${h[i][p]}`); });
      check(`${name}: cambia come al passaggio del mouse`, !diff.length, diff.join('; '));
    }
  }
}

async function run(browser, theme, width) {
  const ctx = `[${theme} ${width}]`;
  const height = width > 600 ? 900 : 844;
  const context = await browser.newContext({ viewport: { width, height }, locale: 'it-IT', colorScheme: theme,
    hasTouch: false, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  // The admin Worker is answered by a stub: the password gate accepts anything, and no
  // save ever leaves the bench.
  await page.route(/workers\.dev/, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
  await page.addInitScript(() => { window.__kfCount = 0; });
  // `?d=full` draws the whole list at once: drawn in stretches, the list grows while the
  // bench scrolls to the footer, and the footer runs away from the mouse.
  await page.goto(PAGE, { waitUntil: 'load' });
  await page.waitForSelector('#rank-list .rank-item');
  await page.evaluate(HELPERS);
  await page.evaluate(async () => { try { await document.fonts.ready; } catch (e) {} });
  const theme0 = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  check(`${ctx} tema del documento`, theme0 === theme, theme0);
  // The neutral point for the mouse: the top right corner, which no control reaches (the
  // language switch sits 1.5rem from the edges, and the mobile sheet rises from below).
  const rest = { x: width - 3, y: 3 };
  await page.mouse.move(rest.x, rest.y);
  await page.waitForTimeout(600);

  await walk(page, 'pagina', ctx, 30, rest);

  // Panel: opened with the mouse, walked with the keyboard.
  await page.click('#ctrl-fab');
  await page.waitForSelector('#ctrl-panel.open');
  await page.waitForTimeout(500);
  // One badge filter switched on, so a row in its 'on' state is walked too.
  await page.locator('#ctrl-panel .ctrl-legend-row').nth(1).click();
  await page.waitForTimeout(400);
  await page.mouse.move(rest.x, rest.y);
  await walk(page, 'Pannello', ctx, 80, rest);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Site search, with a query that gives results.
  await page.evaluate(() => openSiteSearch());
  await page.waitForTimeout(600);
  await page.keyboard.type('Ged');
  await page.waitForTimeout(400);
  await walk(page, 'ricerca', ctx, 10, rest);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // Maps list, then the image viewer of the first map.
  await page.evaluate(() => openMaps());
  await page.waitForTimeout(600);
  await walk(page, 'elenco mappe', ctx, 20, rest);
  const opened = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.modal button, .modal a')].find((x) => !x.classList.contains('modal-close'));
    if (!b) return false; b.click(); return true;
  });
  if (opened) {
    await page.waitForTimeout(900);
    await walk(page, 'visualizzatore', ctx, 20, rest);
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Admin area: gate and choice modal, then every screen of the choice, each from a fresh
  // load. The long editors are walked for their first controls only: the controls repeat
  // card after card, and the first ones cover every kind.
  await page.evaluate(() => openAdminGate());
  await page.waitForSelector('.fab-modal-box input[type=password]', { timeout: 8000 });
  await page.waitForTimeout(400);
  await walk(page, 'admin, parola d\'ordine', ctx, 10, rest);
  await page.fill('.fab-modal-box input[type=password]', 'prova');
  await page.press('.fab-modal-box input[type=password]', 'Enter');
  await page.waitForTimeout(900);
  await walk(page, 'admin, bivio', ctx, 15, rest);
  const SCREENS = [
    ['Console', 'admin, Console', 60],
    ['Modifica personaggi', 'admin, editor personaggi', 45],
    ['Modifica colori', 'admin, editor colori', 45],
    ['Statistiche', 'admin, statistiche', 30],
    ['Micro-aggiustamenti', 'admin, micro-aggiustamenti', 45],
  ];
  for (const [label, phase, tabs] of SCREENS) {
    await page.goto(PAGE, { waitUntil: 'load' });
    await page.waitForSelector('#rank-list .rank-item');
    await page.evaluate(HELPERS);
    await page.evaluate(() => openAdminGate());
    await page.waitForSelector('.fab-modal-box input[type=password]', { timeout: 8000 });
    await page.fill('.fab-modal-box input[type=password]', 'prova');
    await page.press('.fab-modal-box input[type=password]', 'Enter');
    await page.waitForTimeout(900);
    const opened = await page.evaluate((l) => {
      const b = [...document.querySelectorAll('.fab-modal-box button')].find((x) => x.textContent.startsWith(l));
      if (!b) return false; b.click(); return true;
    }, label);
    check(`${ctx} ${phase}: si apre`, opened);
    if (!opened) continue;
    await page.waitForTimeout(1200);
    await page.mouse.move(rest.x, rest.y);
    await walk(page, phase, ctx, tabs, rest);
    if (label === 'Console') {
      // The settings of one effect, behind its gear: sliders, menus, colour wells.
      const gear = await page.evaluate(() => { const g = document.querySelector('.fx-gear'); if (!g) return false; g.click(); return true; });
      check(`${ctx} admin, regolazioni: si aprono`, gear);
      if (gear) { await page.waitForTimeout(900); await walk(page, 'admin, regolazioni', ctx, 50, rest); }
    }
  }
  check(`${ctx} nessun errore della pagina`, !errors.length, errors.join(' | '));
  await context.close();
}

(async () => {
  await new Promise((ok) => server.listen(PORT, '127.0.0.1', ok));
  const browser = await chromium.launch();
  try {
    // PROVA_CONTESTI narrows the run while working (e.g. `dark:390,light:1280`); the
    // verdict is the full run, about ten minutes.
    const only = (process.env.PROVA_CONTESTI || '').split(',').filter(Boolean);
    for (const theme of ['dark', 'light']) for (const width of [1280, 390]) {
      if (only.length && !only.includes(`${theme}:${width}`)) continue;
      await run(browser, theme, width);
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`\n${passed} verdi, ${failed} rosse`);
  process.exit(failed ? 1 : 0);
})();
