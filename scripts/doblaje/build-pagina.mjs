import fs from 'node:fs';
import path from 'node:path';

const DIR = '/Users/lalo/Desktop/ao-balcao-doblaje';
const m = JSON.parse(fs.readFileSync(path.join(DIR, 'manifiesto.json'), 'utf8'));
const bat = JSON.parse(fs.readFileSync(path.join(DIR, 'bateria', 'bateria.json'), 'utf8'));

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pistas = m.pistas.filter((p) => p.ok);

const ORDEN = ['ep1', 'ep9', 'ep10', 'ep11', 'ep13', 'ep14', 'ep15', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12'];
const piezas = ORDEN.filter((k) => pistas.some((p) => p.pieza === k));

const CAPA = {
  '0': ['orienta', 'Capa 0', 'español'],
  N: ['narra', 'Capa N', 'narradora'],
  '1': ['real', 'Capa 1', 'habla real'],
  '2': ['manej', 'Capa 2', 'manejable'],
};

const util = pistas.filter((p) => p.palabras >= 6);
const med = (c) => {
  const g = util.filter((p) => p.capa === c);
  return g.length ? Math.round(g.reduce((a, p) => a + p.ppmReal, 0) / g.length) : 0;
};
const nativa = (() => {
  const g = util.filter((p) => p.capa === '1' && p.ppm >= 130);
  return Math.round(g.reduce((a, p) => a + p.ppmReal, 0) / g.length);
})();
const sep = Math.round((nativa / med('N') - 1) * 100);
const totalMin = (pistas.reduce((a, p) => a + p.seg, 0) / 60).toFixed(1);

const seccion = (k) => {
  const rs = pistas.filter((p) => p.pieza === k);
  const min = (rs.reduce((a, p) => a + p.seg, 0) / 60).toFixed(1);
  const filas = rs.map((p) => {
    const [cls, etq] = CAPA[p.capa] ?? ['real', '?'];
    return `<div class="ln ${cls}">
  <div class="meta"><span class="cap">${etq}</span><span class="who">${esc(p.quien)}</span>
    <span class="ppm" title="ppm medidos con ffprobe · objetivo ${p.ppm}">${p.ppmReal} ppm</span></div>
  <p class="pt">${esc(p.texto)}</p>
  <p class="dir">${esc(p.direccion)}</p>
  <audio controls preload="none" data-seq="${k}" src="${esc(p.archivo)}"></audio>
</div>`;
  }).join('');
  return `<section class="ep" id="${k}">
  <div class="eh"><h2>${k.startsWith('ep') ? 'Episodio ' + k.slice(2) : 'Pieza ' + k.slice(1)}</h2>
    <span class="et">«${esc(rs[0].titulo)}»</span>
    <span class="ec">${rs.length} réplicas · ${min} min</span>
    <button class="play" data-ep="${k}">▶ Seguido</button></div>
  ${filas}</section>`;
};

const navChips = piezas.map((k) => `<a href="#${k}">${k}</a>`).join('');

const html = `<title>AO BALCÃO · doblaje completo</title>
<style>
:root{
  --cal:#FCFCFA;--surface:#FFFFFF;--sunken:#EFF2F6;
  --ink:#16202B;--ink-2:#55636F;--ink-3:#8794A0;
  --rule:#DDE3E9;--rule-2:#C3CDD7;
  --cobalt:#1B4F8F;--cobalt-soft:#E8EFF7;--cobalt-line:#B6CBE2;
  --learn:#2E6B4F;--learn-soft:#E6F0EA;--review:#A8690B;--review-soft:#F8F0E0;
  --plum:#6B3F7A;--plum-soft:#F1E9F4;--teal:#1F6B6B;
  --serif:"Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif;
  --sans:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
}
@media (prefers-color-scheme:dark){:root{
  --cal:#0C1218;--surface:#131C24;--sunken:#0F171E;--ink:#E9EEF2;--ink-2:#93A2AF;--ink-3:#6C7C8A;
  --rule:#202D38;--rule-2:#2E3E4B;--cobalt:#7FB2EC;--cobalt-soft:#142334;--cobalt-line:#2A415B;
  --learn:#58BC90;--learn-soft:#122318;--review:#E0A544;--review-soft:#241C0E;
  --plum:#B98FC8;--plum-soft:#1C1424;--teal:#63BDBD;}}
:root[data-theme="dark"]{--cal:#0C1218;--surface:#131C24;--sunken:#0F171E;--ink:#E9EEF2;--ink-2:#93A2AF;
  --ink-3:#6C7C8A;--rule:#202D38;--rule-2:#2E3E4B;--cobalt:#7FB2EC;--cobalt-soft:#142334;--cobalt-line:#2A415B;
  --learn:#58BC90;--learn-soft:#122318;--review:#E0A544;--review-soft:#241C0E;--plum:#B98FC8;--plum-soft:#1C1424;--teal:#63BDBD;}
:root[data-theme="light"]{--cal:#FCFCFA;--surface:#FFFFFF;--sunken:#EFF2F6;--ink:#16202B;--ink-2:#55636F;
  --ink-3:#8794A0;--rule:#DDE3E9;--rule-2:#C3CDD7;--cobalt:#1B4F8F;--cobalt-soft:#E8EFF7;--cobalt-line:#B6CBE2;
  --learn:#2E6B4F;--learn-soft:#E6F0EA;--review:#A8690B;--review-soft:#F8F0E0;--plum:#6B3F7A;--plum-soft:#F1E9F4;--teal:#1F6B6B;}
*{box-sizing:border-box}
body{margin:0;background:var(--cal);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.6}
:focus-visible{outline:2px solid var(--cobalt);outline-offset:3px}
.pg{max-width:880px;margin:0 auto;padding:0 22px}
header.mast{border-bottom:1px solid var(--rule);padding:46px 0 26px}
.kicker{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3);margin:0 0 14px}
h1{font-family:var(--serif);font-size:clamp(32px,6vw,52px);line-height:1.03;letter-spacing:-.026em;margin:0 0 12px;font-weight:600;text-wrap:balance}
.lede{font-size:17px;color:var(--ink-2);margin:0;max-width:64ch}
.lede b{color:var(--ink);font-weight:600}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1px;background:var(--rule);
  border:1px solid var(--rule);border-radius:12px;overflow:hidden;margin:26px 0 0}
.st{background:var(--surface);padding:14px 16px}
.st .v{font-family:var(--serif);font-size:26px;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums;display:block}
.st .l{font-family:var(--mono);font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-3);margin-top:2px;display:block}
.st.good .v{color:var(--learn)}
nav.chips{display:flex;flex-wrap:wrap;gap:6px;margin:22px 0 0}
nav.chips a{font-family:var(--mono);font-size:12px;text-decoration:none;color:var(--cobalt);
  border:1px solid var(--cobalt-line);background:var(--cobalt-soft);border-radius:999px;padding:3px 11px}
.card{background:var(--surface);border:1px solid var(--rule);border-radius:12px;padding:20px 22px;margin:26px 0}
.card.warn{border-color:var(--review);background:var(--review-soft)}
.card h3{font-family:var(--serif);font-size:20px;margin:0 0 8px;letter-spacing:-.015em;font-weight:600}
.card p{margin:0 0 10px;color:var(--ink-2);font-size:15px}
.card p:last-child{margin-bottom:0}
.card b{color:var(--ink)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;margin-top:14px}
.vc{background:var(--cal);border:1px solid var(--rule);border-radius:9px;padding:11px 13px}
.vc .n{font-family:var(--serif);font-size:16px;font-weight:600;display:block;margin-bottom:1px}
.vc .r{font-family:var(--mono);font-size:10.5px;color:var(--ink-3);letter-spacing:.04em;display:block;margin-bottom:7px}
.vc audio{width:100%;height:32px}
table.cast{width:100%;border-collapse:collapse;margin-top:12px;font-size:14px}
table.cast th{text-align:left;font-family:var(--mono);font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;
  color:var(--ink-3);border-bottom:1px solid var(--rule-2);padding:5px 8px 5px 0;font-weight:500}
table.cast td{padding:6px 8px 6px 0;border-bottom:1px solid var(--rule);color:var(--ink-2);vertical-align:top}
table.cast td:first-child{font-family:var(--serif);font-size:15px;color:var(--ink);font-weight:600;white-space:nowrap}
.ep{border-top:1px solid var(--rule);padding-top:18px;margin-top:34px}
.eh{display:flex;align-items:baseline;gap:11px;flex-wrap:wrap;margin-bottom:12px;position:sticky;top:0;
  background:var(--cal);padding:11px 0;z-index:4;border-bottom:1px solid var(--rule)}
h2{font-family:var(--serif);font-size:23px;letter-spacing:-.02em;margin:0;font-weight:600}
.et{font-family:var(--serif);font-style:italic;color:var(--ink-2);font-size:18px}
.ec{font-family:var(--mono);font-size:11px;color:var(--ink-3);margin-left:auto;font-variant-numeric:tabular-nums}
.play{font-family:var(--sans);font-size:13px;font-weight:600;border-radius:999px;padding:5px 14px;cursor:pointer;
  border:1px solid var(--cobalt);background:var(--cobalt);color:#fff}
.ln{padding:11px 0 11px 13px;border-top:1px solid var(--rule);border-left:3px solid transparent}
.ln.playing{background:var(--cobalt-soft)}
.ln.narra{border-left-color:var(--cobalt)} .ln.real{border-left-color:var(--rule-2)}
.ln.manej{border-left-color:var(--learn)} .ln.orienta{border-left-color:var(--review)}
.meta{display:flex;align-items:baseline;gap:9px;margin-bottom:3px}
.cap{font-family:var(--mono);font-size:9.5px;text-transform:uppercase;letter-spacing:.09em;padding:1px 6px;border-radius:3px;
  background:var(--sunken);color:var(--ink-3)}
.narra .cap{background:var(--cobalt-soft);color:var(--cobalt)} .manej .cap{background:var(--learn-soft);color:var(--learn)}
.orienta .cap{background:var(--review-soft);color:var(--review)}
.who{font-family:var(--serif);font-size:14.5px;font-weight:600}
.ppm{font-family:var(--mono);font-size:10.5px;color:var(--ink-3);margin-left:auto;font-variant-numeric:tabular-nums}
.pt{font-family:var(--serif);font-size:18.5px;line-height:1.42;margin:0 0 5px;letter-spacing:-.008em}
.orienta .pt{font-style:italic;color:var(--ink-2);font-size:16.5px}
.dir{font-size:12.5px;color:var(--ink-3);margin:0 0 6px;line-height:1.5}
audio{width:100%;height:33px;display:block}
footer{border-top:1px solid var(--rule);margin-top:42px;padding:24px 0 60px;
  font-family:var(--mono);font-size:11.5px;color:var(--ink-3);line-height:1.75}
footer b{color:var(--ink-2);font-weight:500}
@media (max-width:620px){.eh{position:static}.ppm{margin-left:0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>

<header class="mast"><div class="pg">
  <p class="kicker">AO BALCÃO · 13 piezas · doblaje completo</p>
  <h1>Todo lo escrito, dicho en voz alta</h1>
  <p class="lede">Los seis episodios de serie, las seis microhistorias y el episodio 1 rehecho. <b>${pistas.length} réplicas, ${totalMin} minutos, ${m.pistas.reduce((a, p) => a + p.texto.length, 0).toLocaleString('es')} caracteres</b> — un 12&nbsp;% de la cuota mensual.</p>
  <div class="stats">
    <div class="st"><span class="v">${med('N')}</span><span class="l">narradora ppm</span></div>
    <div class="st"><span class="v">${nativa}</span><span class="l">habla nativa ppm</span></div>
    <div class="st good"><span class="v">${sep}%</span><span class="l">separación · diseño 42%</span></div>
    <div class="st"><span class="v">${med('2')}</span><span class="l">capa manejable ppm</span></div>
  </div>
  <nav class="chips">${navChips}</nav>
</div></header>

<main class="pg">

<div class="card warn">
  <h3>Aurora tiene setenta y nueve años y esa voz no existe</h3>
  <p>En toda la biblioteca hay <b>siete voces femeninas de portugués europeo</b>, y ninguna es mayor: todas están etiquetadas <i>young</i> o <i>middle_aged</i>. Aurora está doblada con la más cercana en carácter, pero <b>no suena a setenta y nueve años</b>, y su edad es un dato de la trama — la coda del ep. 13 se apoya en ella.</p>
  <p>Cuatro salidas reales. La última es la única que da la edad de verdad, y cuesta dos palabras en el ep. 13:</p>
  <div class="grid">
  ${bat.aurora.map((a) => `<div class="vc"><span class="n">${esc(a.nombre)}</span><span class="r">${esc(a.nota)}</span>
    <audio controls preload="none" src="bateria/${esc(a.archivo)}"></audio></div>`).join('')}
  </div>
</div>

<div class="card">
  <h3>Batería de aceptación fonética · 10 voces sin validar</h3>
  <p>El método exige pasar toda voz nueva por los cuatro contrastes que un hispanohablante no oye y que una voz mal elegida destruye. <b>Yo no puedo escuchar el resultado</b>, así que ninguna de estas diez está aprobada hasta que la oigas.</p>
  <p style="font-family:var(--serif);font-size:19px;color:var(--ink)">«${esc(bat.frase)}»</p>
  <p><b>cedo : medo</b> — las dos /e/ cerradas, que el español abre &nbsp;·&nbsp; <b>avó : avô</b> — /ɔ/ frente a /o/, el par que separa abuela de abuelo &nbsp;·&nbsp; <b>os livros dos pastéis</b> — la -s final /ʃ/ tres veces &nbsp;·&nbsp; <b>vamos comer depressa</b> — la reducción de átonas, que es la marca del portugués europeo.</p>
  <p>Si una voz no distingue <i>avó</i> de <i>avô</i>, se cambia de voz, no de guion.</p>
  <div class="grid">
  ${bat.bateria.map((b) => `<div class="vc"><span class="n">${esc(b.nombre)}</span><span class="r">${esc(b.papeles)}</span>
    <audio controls preload="none" src="bateria/${esc(b.archivo)}"></audio></div>`).join('')}
  </div>
</div>

<div class="card">
  <h3>Reparto</h3>
  <table class="cast"><thead><tr><th>Personaje</th><th>Voz</th></tr></thead><tbody>
  ${Object.entries(m.voces).map(([k, [, d]]) => `<tr><td>${esc(k)}</td><td>${esc(d)}</td></tr>`).join('')}
  </tbody></table>
</div>

${piezas.map(seccion).join('')}
</main>

<footer><div class="pg">
  <b>Cómo se controló la velocidad.</b> El primer piloto salió con la separación de capas <b>invertida</b>: narradora a 158 ppm y habla real a 154. La causa es que <code>speed</code> no controla los ppm de verdad —manda la puntuación— y 0,7 es el suelo de la API. La salida estaba escrita en las propias direcciones, que llevan las pausas anotadas desde el guion y que nadie estaba ejecutando: ahora las pausas son parte del texto. Y la Capa 1 nunca baja de su velocidad natural, porque frenar al hablante nativo por debajo de su ritmo destruye lo único que hace que la capa signifique algo.<br>
  <b>Todo medido con ffprobe</b>, nunca estimado por tamaño de archivo, y descartando las réplicas de menos de seis palabras: un «Hã?» de una palabra arruina cualquier media.<br>
  <b>Lo que falta.</b> El foley, el filtro de megafonía (pasa-banda 300-3400 Hz sobre las pistas de MEGAFONE), el filtro de cristal del ep. 10 y el de teléfono de la MÃE en P10. Esto es el núcleo dramático, que es lo que hay que escribir a mano; el resto se monta encima.
</div></footer>

<script>
(function(){
  var idx=-1, lista=[];
  function clear(){ document.querySelectorAll('.ln.playing').forEach(function(l){l.classList.remove('playing');}); }
  function next(){
    clear(); idx++;
    if(idx>=lista.length){ return; }
    var a=lista[idx], line=a.closest('.ln');
    line.classList.add('playing'); line.scrollIntoView({block:'center',behavior:'smooth'});
    a.currentTime=0; a.onended=next;
    a.play().catch(function(){ next(); });
  }
  document.querySelectorAll('.play').forEach(function(b){
    b.addEventListener('click',function(){
      document.querySelectorAll('audio').forEach(function(a){a.pause();a.onended=null;});
      lista=Array.prototype.slice.call(document.querySelectorAll('audio[data-seq="'+b.dataset.ep+'"]'));
      idx=-1; next();
    });
  });
})();
</script>
`;

const out = path.join(DIR, 'doblaje.html');
fs.writeFileSync(out, html);
console.log('escrito:', out, (html.length / 1024).toFixed(0) + ' KB');
