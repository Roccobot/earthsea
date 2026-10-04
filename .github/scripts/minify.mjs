// Genera `<cartella>/index.html` minificato da `<cartella>/index.src.html`, e `admin.js` da
// `admin.src.js` se c'è. Lo usano, ciascuno con la sua copia nel proprio repo, 'I Grandi di Terramare' (dalla 2.70) e
// 'I Grandi di Arda' (dalla 15.64): chi corregge una copia guardi l'altra.
//
// PERCHÉ C'È: nei due sorgenti i commenti erano il 61% (Terramare) e il 41% (Arda) del codice
// servito, e ogni visitatore li scaricava. Il sorgente resta commentato e si modifica lui;
// questo file ne ricava la pagina pubblicata.
//
// CHE COSA FA, e che cosa NO:
// - minifica con esbuild ogni <script> in linea e ogni <style>, senza commenti;
// - toglie i commenti HTML fuori da script e stili;
// - NON tocca gli spazi del markup: fra due elementi in linea uno spazio è contenuto, e
//   comprimerlo cambierebbe l'impaginazione;
// - NON rinomina i nomi globali: in uno script classico esbuild tiene i simboli di primo
//   livello, che servono ai gestori scritti nel markup e agli accessi `window[nome]`.
//
// Uso: `node .github/scripts/minify.mjs .` dalla radice del repo. Le
// GitHub Action `earthsea-minify.yml` e `arda-minify.yml` lo lanciano a ogni push che tocca i
// sorgenti del loro progetto.
import { transform } from 'esbuild';
import fs from 'node:fs';
import vm from 'node:vm';

const DIR = (process.argv[2] || '').replace(/\/+$/, '');
if (!DIR || !fs.existsSync(DIR + '/index.src.html')) { console.error('uso: node .github/scripts/minify.mjs <cartella con index.src.html>'); process.exit(1); }
const SRC = DIR + '/index.src.html';
const OUT = DIR + '/index.html';
const BANNER = '<!-- FILE GENERATO da index.src.html con .github/scripts/minify.mjs: si modifica il sorgente, mai questo file. -->\n';

const src = fs.readFileSync(SRC, 'utf8');
const parti = [];
const re = /<(script|style)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
let ultimo = 0, m;
while ((m = re.exec(src))) {
  parti.push({ markup: src.slice(ultimo, m.index) });
  parti.push({ tag: m[1].toLowerCase(), attr: m[2], corpo: m[3] });
  ultimo = re.lastIndex;
}
parti.push({ markup: src.slice(ultimo) });

// ── Caricamento differito (15.72 / 2.82): lo script principale esce in `app.js` ──────────
// Nel sorgente lo script principale è in linea in fondo al body, dopo `<script src="dati.js">`
// sincrono: il parser si ferma su `dati.js` (616 KB su Arda, 210 su Terramare) e il primo disegno aspetta tutti e
// due. Nel generato `dati.js` prende `defer` e lo script principale va in un file `app.js`,
// anch'esso `defer`: il browser li scarica mentre legge il resto, li esegue in quest'ordine a
// documento completo, e la pagina si disegna prima. Il sorgente resta com'è, e aperto da sé
// funziona uguale (gli script sono già in fondo al body, quindi il DOM è completo lo stesso).
// ⚠️ `app.js` resta uno script CLASSICO, non un modulo: funzioni e `let` di primo livello
// restano globali, che è ciò che `admin.js` e i gestori nel markup si aspettano.
// ⚠️ L'indirizzo ha la VERSIONE del sito (`?v=`), letta dal badge del sorgente: a ogni versione
// il browser scarica il file nuovo, e un `index.html` nuovo non gira mai con un `app.js` vecchio
// preso dalla cache. `dati.js` non la prende: lo riscrive il Worker a ogni salvataggio, e questo
// file non gira in quel momento.
const VER = (src.match(/vb-v">v<\/span>([0-9.]+)/) || [])[1] || String(Date.now());
const APP_OUT = DIR + '/app.js';
const inLinea = parti.filter(p => p.tag === 'script' && !/\bsrc\s*=/.test(p.attr));
const principale = inLinea.sort((a, b) => b.corpo.length - a.corpo.length)[0];
if (!principale || principale.corpo.length < 50000) { console.error('script principale non trovato nel sorgente'); process.exit(1); }

// ── L'elenco leggibile SENZA JavaScript (15.74 / 2.84) ─────────────────────────────────────
// Le card nascono dallo script, quindi chi legge la pagina senza eseguirlo (un agente, un
// motore di ricerca che non esegue JS, un lettore senza JavaScript) trovava una lista vuota.
// Il sorgente contiene un `<noscript data-elenco>` con la frase d'introduzione; qui ci si
// aggiunge l'elenco ricavato da `dati.js`, nell'ordine della classifica: nome, tipo e opera della
// prima apparizione. Gli apocrifi vanno in un elenco a parte, col titolo che il sorgente dichiara
// in `data-titolo-apocrifi`.
// ⚠️ La frase breve (`info`) NON c'è, ed è misurato: su Arda portava la pagina compressa da 20 a
// 35 KB, e la velocità viene prima. Le frasi complete un agente le legge in `dati.js`, a cui
// `llms.txt` rimanda; l'opera invece si ripete e si comprime quasi a zero.
// ⚠️ L'elenco segue i salvataggi admin perché il workflow gira anche quando cambia `dati.js`.
// ⚠️ Il testo arriva dai dati, quindi passa da `esc`: un nome con `<` resta testo.
const esc = t => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function elencoStatico(markup) {
  return markup.replace(/(<noscript\b[^>]*\bdata-elenco\b[^>]*>)([\s\S]*?)(<\/noscript>)/i, (tutto, apre, dentro, chiude) => {
    if (!fs.existsSync(DIR + '/dati.js')) return tutto;
    const ctx = {};
    vm.runInNewContext(fs.readFileSync(DIR + '/dati.js', 'utf8') + '\n;this.__dati = dati;', ctx);
    const dati = ctx.__dati || [];
    const titoloApo = (apre.match(/data-titolo-apocrifi="([^"]*)"/) || [])[1] || '';
    const voce = d => {
      const nome = d.nome || d.vero_nome || '';
      let s = '<li><b>' + esc(nome) + '</b>';
      if (d.vero_nome && d.nome && d.vero_nome !== d.nome) s += ', vero nome ' + esc(d.vero_nome);
      if (d.tipo) s += ' (' + esc(d.tipo) + ')';
      if (d.fonte) s += ': ' + esc(d.fonte);
      return s + '</li>';
    };
    const lista = v => '<ol>' + v.map(voce).join('') + '</ol>';
    const principali = dati.filter(d => !d.apocrifo), apocrifi = dati.filter(d => d.apocrifo);
    let html = dentro.replace(/<!--[\s\S]*?-->/g, '').trim() + lista(principali);
    if (apocrifi.length && titoloApo) html += '<h2>' + esc(titoloApo) + '</h2>' + lista(apocrifi);
    console.log(`elenco senza JavaScript: ${principali.length} voci, più ${apocrifi.length} a parte`);
    return apre + '<div class="elenco-statico">' + html + '</div>' + chiude;
  });
}

let out = '';
for (const p of parti) {
  if (p.markup !== undefined) { out += elencoStatico(p.markup).replace(/<!--[\s\S]*?-->\n?/g, ''); continue; }
  const esterno = /\bsrc\s*=/.test(p.attr);
  const tipo = (p.attr.match(/\btype\s*=\s*["']?([^"'\s>]+)/i) || [])[1];
  const js = p.tag === 'script' && !esterno && (!tipo || /javascript|module/i.test(tipo));
  if (p === principale) {
    const r = await transform(p.corpo, { loader: 'js', minify: true, legalComments: 'none', charset: 'utf8' });
    fs.writeFileSync(APP_OUT, '// FILE GENERATO da index.src.html con .github/scripts/minify.mjs: si modifica il sorgente, mai questo file.\n' + r.code);
    out += '<script src="app.js?v=' + VER + '" defer></script>';
    console.log(`script principale -> ${APP_OUT}: ${r.code.length.toLocaleString('it-IT')} caratteri`);
  } else if (esterno && /\bsrc\s*=\s*["']?dati\.js/.test(p.attr) && !/\bdefer\b/.test(p.attr)) {
    out += '<script' + p.attr + ' defer></script>';
  } else if (p.tag === 'style' || js) {
    const r = await transform(p.corpo, { loader: p.tag === 'style' ? 'css' : 'js', minify: true, legalComments: 'none', charset: 'utf8' });
    out += '<' + p.tag + p.attr + '>' + r.code.trim() + '</' + p.tag + '>';
  } else {
    out += '<' + p.tag + p.attr + '>' + p.corpo + '</' + p.tag + '>';
  }
}
out = out.replace(/^(<!doctype html>\s*)/i, '$1' + BANNER);
if (!out.includes(BANNER)) out = BANNER + out;
fs.writeFileSync(OUT, out);
console.log(`${SRC}: ${src.length.toLocaleString('it-IT')} caratteri -> ${OUT}: ${out.length.toLocaleString('it-IT')}`);

// Il codice dell'amministrazione, se il progetto lo tiene a parte: stesso trattamento, file a
// parte. La pagina lo scarica solo al primo ingresso nell'area admin (vedi `caricaAdmin`).
const ADMIN_SRC = DIR + '/admin.src.js', ADMIN_OUT = DIR + '/admin.js';
if (!fs.existsSync(ADMIN_SRC)) process.exit(0);
const adminSrc = fs.readFileSync(ADMIN_SRC, 'utf8');
const adminMin = await transform(adminSrc, { loader: 'js', minify: true, legalComments: 'none', charset: 'utf8' });
fs.writeFileSync(ADMIN_OUT, '// FILE GENERATO da admin.src.js con .github/scripts/minify.mjs: si modifica il sorgente, mai questo file.\n' + adminMin.code);
console.log(`${ADMIN_SRC}: ${adminSrc.length.toLocaleString('it-IT')} caratteri -> ${ADMIN_OUT}: ${adminMin.code.length.toLocaleString('it-IT')}`);
