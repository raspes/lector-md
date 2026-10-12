// Prueba de humo en Chromium: render del ejemplo, saneado de HTML y aislamiento de red.
// Uso: npm run build && npx playwright install chromium && npm test
const { chromium } = require('playwright');
const path = require('path');
const { pathToFileURL } = require('url');

const html = pathToFileURL(process.env.LECTOR_HTML || path.join(__dirname, '..', 'dist', 'lector-md.html')).href;
const sample = path.join(__dirname, '..', 'examples', 'prueba-lector.md');
const hostile = path.join(__dirname, 'hostile.md');

const results = [];
const check = (name, ok, detail = '') => { results.push(ok); console.log(`${ok ? 'OK  ' : 'FALLA'} ${name}${detail ? '  ' + detail : ''}`); };
const external = u => !/^(file|data|blob):/.test(u);

(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1360, height: 900 } })).newPage();
  const requests = [], failed = [], pageErrors = [];
  page.on('request', r => { if (external(r.url())) requests.push(r.url()); });
  page.on('requestfailed', r => { if (external(r.url())) failed.push(r.url()); });
  page.on('pageerror', e => pageErrors.push(String(e)));

  // 1) Documento de ejemplo
  await page.goto(html);
  await page.setInputFiles('#file', sample);
  await page.waitForFunction(() => document.querySelector('.diagram') && !document.querySelector('.diagram.pending'), null, { timeout: 90000 });
  const r = await page.evaluate(() => ({
    ok: document.querySelectorAll('.diagram:not(.err) svg').length,
    err: document.querySelectorAll('.diagram.err').length,
    tables: document.querySelectorAll('.tablewrap table').length,
    callouts: document.querySelectorAll('.callout').length,
  }));
  check('12 diagramas Mermaid renderizan', r.ok === 12, `(${r.ok})`);
  check('1 diagrama inválido se reporta como error', r.err === 1, `(${r.err})`);
  check('5 tablas', r.tables === 5, `(${r.tables})`);
  check('5 avisos tipo GitHub', r.callouts === 5, `(${r.callouts})`);
  check('0 solicitudes externas al cargar el documento', requests.length === 0, JSON.stringify(requests));

  // 1b) Licencias embebidas en el HTML y accesibles desde la interfaz
  const L = await page.evaluate(() => { const t = document.getElementById('licenses'); return t ? t.textContent : ''; });
  check('el HTML embebe los textos de licencia (marked, DOMPurify, Mermaid)', L.includes('Permission is hereby granted') && /marked@\d/.test(L) && /dompurify@\d/.test(L) && /mermaid@\d/.test(L), `(${Math.round(L.length / 1024)} KB)`);
  check('licencias de al menos 100 paquetes', (L.match(/^### .+@.+$/gm) || []).length >= 100, `(${(L.match(/^### .+@.+$/gm) || []).length})`);
  check('incluye la licencia propia de lector-md', /^lector-md\n=+\n\nMIT License/.test(L.trim()));
  await page.click('#btnLic');
  const shown = await page.evaluate(() => ({ open: !document.getElementById('lic').hidden, len: document.getElementById('licText').textContent.length }));
  check('el enlace «Licencias de terceros» abre el diálogo con el texto', shown.open && shown.len > 100000, `(${shown.len} caracteres)`);
  await page.keyboard.press('Escape');
  check('Esc cierra el diálogo de licencias', await page.evaluate(() => document.getElementById('lic').hidden));

  // 2) HTML hostil
  await page.setInputFiles('#file', hostile);
  await page.waitForFunction(() => document.querySelector('#fname').textContent === 'hostile.md');
  await page.waitForTimeout(300);
  const h = await page.evaluate(() => ({
    scripts: document.querySelectorAll('#doc script, #doc iframe, #doc object, #doc embed').length,
    handlers: !!document.querySelector('#doc [onerror], #doc [onclick], #doc [onload]'),
    jsHref: [...document.querySelectorAll('#doc a')].some(a => /^javascript:/i.test(a.getAttribute('href') || '')),
    flags: ['__x1', '__x2', '__x3'].map(k => window[k]),
  }));
  check('sin <script>/<iframe>/<object> en el documento', h.scripts === 0);
  check('sin manejadores de eventos en línea', !h.handlers);
  check('sin enlaces javascript:', !h.jsHref);
  check('ningún payload se ejecutó', h.flags.every(v => v === undefined), JSON.stringify(h.flags));
  check('0 solicitudes externas con HTML hostil', requests.length === 0, JSON.stringify(requests));

  // 3) Aislamiento de red (CSP). Se cuentan las violaciones de CSP reportadas por el navegador:
  //    sin CSP no hay violaciones, así que esta comprobación no puede pasar "por casualidad" si la red falla.
  const iso = await page.evaluate(async () => {
    const violations = [];
    document.addEventListener('securitypolicyviolation', e => violations.push(`${e.effectiveDirective}`));
    const o = {};
    try { await fetch('https://probe.example.invalid/'); o.fetch = 'permitido'; } catch { o.fetch = 'rechazado'; }
    o.xhr = await new Promise(res => { const x = new XMLHttpRequest(); x.onerror = () => res('rechazado'); x.onload = () => res('permitido'); try { x.open('GET', 'https://probe.example.invalid/'); x.send(); } catch { res('rechazado'); } });
    o.img = await new Promise(res => { const i = new Image(); i.onload = () => res('permitido'); i.onerror = () => res('rechazado'); i.src = 'https://probe.example.invalid/a.png'; });
    o.ws = await new Promise(res => { try { const w = new WebSocket('wss://probe.example.invalid/'); w.onerror = () => res('rechazado'); w.onopen = () => res('permitido'); } catch { res('rechazado'); } });
    await new Promise(r => setTimeout(r, 300));
    return { o, violations };
  });
  const connectV = iso.violations.filter(d => d === 'connect-src').length;
  const imgV = iso.violations.filter(d => d === 'img-src').length;
  check('la CSP reporta violación para fetch, XHR y WebSocket (connect-src x3)', connectV >= 3, JSON.stringify(iso.violations));
  check('la CSP reporta violación para la imagen remota (img-src)', imgV >= 1);
  check('ninguna sonda fue permitida', Object.values(iso.o).every(v => v === 'rechazado'), JSON.stringify(iso.o));
  check('sin errores de JavaScript en la página', pageErrors.length === 0, JSON.stringify(pageErrors));

  await browser.close();
  const bad = results.filter(v => !v).length;
  console.log(`\n${results.length - bad}/${results.length} comprobaciones correctas`);
  process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
