// Genera THIRD_PARTY_LICENSES.md con el cierre de dependencias de producción de marked, mermaid y dompurify.
// Es un superconjunto de lo que queda embebido en el HTML: Mermaid empaqueta sus dependencias en un solo bundle.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const seen = new Map();

function findPkg(name, from) {
  let d = from;
  for (;;) {
    const p = path.join(d, 'node_modules', name, 'package.json');
    if (fs.existsSync(p)) return p;
    const up = path.dirname(d);
    if (up === d) return null;
    d = up;
  }
}
function walk(name, from) {
  const pj = findPkg(name, from);
  if (!pj) return;
  const j = JSON.parse(fs.readFileSync(pj, 'utf8'));
  const key = `${j.name}@${j.version}`;
  if (seen.has(key)) return;
  seen.set(key, { j, dir: path.dirname(pj) });
  for (const dep of Object.keys(j.dependencies || {})) walk(dep, path.dirname(pj));
}
['marked', 'dompurify', 'mermaid'].forEach(n => walk(n, root));

const licOf = j => (typeof j.license === 'string' ? j.license : (j.license && j.license.type) || '');
const entries = [...seen.entries()].sort(([a], [b]) => a.localeCompare(b));

let md = `# Licencias de terceros\n\n`;
md += `Generado con \`npm run licenses\`. \`lector-md.html\` embebe **marked**, **DOMPurify** y **Mermaid**; `;
md += `Mermaid a su vez empaqueta sus propias dependencias. Esta lista cubre el cierre de dependencias de producción `;
md += `(${entries.length} paquetes), que es un superconjunto de lo realmente incluido en el bundle.\n\n`;
md += `Si distribuyes el HTML en un contexto comercial, revisa esta lista con quien corresponda: es un inventario automático, no una opinión legal.\n\n`;
md += `## Resumen\n\n| Paquete | Licencia declarada |\n|---|---|\n`;
for (const [key, { j, dir }] of entries) {
  const files = fs.readdirSync(dir).filter(f => /^(licen[sc]e|copying)/i.test(f));
  let lic = licOf(j);
  if (!lic && files.length) lic = 'según archivo de licencia';
  if (!lic) lic = 'no declarada';
  md += `| ${key} | ${lic} |\n`;
}
md += `\n## Textos de licencia\n`;
for (const [key, { j, dir }] of entries) {
  const files = fs.readdirSync(dir).filter(f => /^(licen[sc]e|copying|notice)/i.test(f)).sort();
  md += `\n### ${key}\n\n`;
  if (!files.length) {
    md += `Licencia declarada en \`package.json\`: **${licOf(j) || 'no declarada'}**. El paquete no incluye archivo de licencia.\n`;
    continue;
  }
  for (const f of files) {
    const txt = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n').trim();
    md += `<details><summary>${f}</summary>\n\n\`\`\`text\n${txt}\n\`\`\`\n\n</details>\n\n`;
  }
}
fs.writeFileSync(path.join(root, 'THIRD_PARTY_LICENSES.md'), md);
console.log(`THIRD_PARTY_LICENSES.md: ${entries.length} paquetes, ${(md.length / 1024).toFixed(0)} KB`);
