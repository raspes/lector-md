// Construye dist/lector-md.html: inyecta marked, DOMPurify y Mermaid dentro de src/template.html.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = __dirname;
const lib = p => fs.readFileSync(path.join(root, 'node_modules', p), 'utf8');

// Quita el sourceMappingURL y escapa secuencias que romperían un <script> inline.
const prep = (name, s) => {
  s = s.replace(/\n?\/\/# sourceMappingURL=.*$/m, '');
  const closers = (s.match(/<\/script/gi) || []).length;
  const comments = (s.match(/<!--/g) || []).length;
  console.log(`${name.padEnd(8)} ${(s.length / 1024).toFixed(0).padStart(5)} KB  (</script x${closers}, <!-- x${comments} escapados)`);
  return s.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
};

const parts = {
  '/*__MARKED__*/': prep('marked', lib('marked/lib/marked.umd.js')),
  '/*__PURIFY__*/': prep('purify', lib('dompurify/dist/purify.min.js')),
  '/*__MERMAID__*/': prep('mermaid', lib('mermaid/dist/mermaid.min.js')),
};

// Texto de licencias embebido en el HTML (la licencia propia + las de terceros), en texto plano.
const read = f => {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) throw new Error(f + ' no existe' + (f.startsWith('THIRD') ? ' (ejecuta: npm run licenses)' : ''));
  return fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
};
let third = read('THIRD_PARTY_LICENSES.md')
  .replace(/<details><summary>(.*?)<\/summary>\n\n```text\n/g, '[$1]\n')
  .replace(/\n```\n\n<\/details>\n\n?/g, '\n\n');
if (/<details|<\/details>|```/.test(third)) throw new Error('Quedaron restos de Markdown en el texto de licencias');
const licenses = 'lector-md\n=========\n\n' + read('LICENSE').trim() + '\n\n\n' + third.trim() + '\n';
if (/<\/script|<!--/i.test(licenses)) throw new Error('El texto de licencias contiene secuencias que romperían el <script> inline');
parts['/*__LICENSES__*/'] = licenses;
console.log(`licenses ${(licenses.length / 1024).toFixed(0).padStart(5)} KB  (texto plano embebido)`);

let html = fs.readFileSync(path.join(root, 'src', 'template.html'), 'utf8');
for (const [marker, code] of Object.entries(parts)) {
  if (!html.includes(marker)) throw new Error('Falta el marcador ' + marker + ' en src/template.html');
  html = html.replace(marker, () => code);
}

const out = path.join(root, 'dist', 'lector-md.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
const sha = crypto.createHash('sha256').update(html).digest('hex');
console.log(`\nOK  dist/lector-md.html  ${(html.length / 1024 / 1024).toFixed(2)} MB`);
console.log(`sha256  ${sha}`);
