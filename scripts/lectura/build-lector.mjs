// Lector karaoke — piloto standalone antes de integrarlo en la app.
//
// El resaltado sigue al audio palabra a palabra usando los tiempos del
// generador; clicar una palabra salta el audio a ella. Los párrafos se
// encadenan solos, así que «leer el cuento» es un solo botón.
import fs from 'node:fs';
import path from 'node:path';

const DIR = process.argv[2] || '/Users/lalo/Desktop/lectura-karaoke/a-aia';
const j = JSON.parse(fs.readFileSync(path.join(DIR, 'lectura.json'), 'utf8'));
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const min = Math.round(j.parrafos.reduce((a, p) => a + (p.palabras.at(-1)?.e ?? 0), 0) / 60);

const cuerpo = j.parrafos.map((p, pi) =>
  `<p class="par" data-p="${pi}">` +
  p.palabras.map((w, wi) => `<span data-p="${pi}" data-w="${wi}">${esc(w.t)}</span>`).join(' ') +
  `</p>`
).join('\n');

const html = `<!doctype html><html lang="pt"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(j.titulo)} · ${esc(j.autor)}</title>
<style>
:root{
  --cal:#FCFCFA;--ink:#16202B;--ink-2:#55636F;--ink-3:#8794A0;--rule:#DDE3E9;
  --cobalt:#1B4F8F;--cobalt-soft:#E8EFF7;
  --serif:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
  --sans:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --mono:ui-monospace,"SF Mono",Menlo,monospace;
}
@media (prefers-color-scheme:dark){:root{--cal:#0C1218;--ink:#E9EEF2;--ink-2:#93A2AF;--ink-3:#6C7C8A;
  --rule:#202D38;--cobalt:#7FB2EC;--cobalt-soft:#142334;}}
*{box-sizing:border-box}
body{margin:0;background:var(--cal);color:var(--ink);font-family:var(--sans)}
.pg{max-width:680px;margin:0 auto;padding:0 22px 90px}
header{border-bottom:1px solid var(--rule);padding:44px 0 22px;margin-bottom:10px}
.kicker{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3);margin:0 0 12px}
h1{font-family:var(--serif);font-size:clamp(34px,7vw,54px);margin:0 0 6px;font-weight:600;letter-spacing:-.02em}
.autor{font-family:var(--serif);font-style:italic;font-size:19px;color:var(--ink-2);margin:0}
.meta{font-family:var(--mono);font-size:11px;color:var(--ink-3);margin-top:14px;line-height:1.8}
.par{font-family:var(--serif);font-size:20.5px;line-height:1.75;margin:0 0 1.1em;letter-spacing:-.004em}
.par span{border-radius:3px;cursor:pointer;padding:0 1px}
.par span:hover{background:var(--cobalt-soft)}
.par span.on{background:var(--cobalt);color:#fff}
.par.activo{border-left:3px solid var(--cobalt);padding-left:14px;margin-left:-17px}
.barra{position:fixed;left:0;right:0;bottom:0;background:var(--cal);border-top:1px solid var(--rule);
  padding:12px max(22px,env(safe-area-inset-left));display:flex;gap:14px;align-items:center}
.play{font-size:15px;font-weight:600;border-radius:999px;padding:9px 22px;cursor:pointer;
  border:1px solid var(--cobalt);background:var(--cobalt);color:#fff;font-family:var(--sans)}
.estado{font-family:var(--mono);font-size:11.5px;color:var(--ink-3);font-variant-numeric:tabular-nums}
:focus-visible{outline:2px solid var(--cobalt);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
</style></head><body>
<div class="pg">
<header>
  <p class="kicker">Biblioteca · ${esc(j.nivel)} · lectura con karaoke — piloto</p>
  <h1>${esc(j.titulo)}</h1>
  <p class="autor">${esc(j.autor)} († ${esc(j.muerteAutor)})</p>
  <p class="meta">${esc(j.fuente)} · ${esc(j.licencia)} · ~${min} min de audio<br>${esc(j.notaOrtografia ?? '')}</p>
</header>
${cuerpo}
</div>
<div class="barra">
  <button class="play" id="btn">▶ Ouvir</button>
  <span class="estado" id="est">${j.parrafos.length} párrafos · toca una palabra para saltar a ella</span>
</div>
<script>
const L=${JSON.stringify(j.parrafos.map((p) => ({ mp3: p.mp3, w: p.palabras.map((w) => [w.s, w.e]) })))};
const audio=new Audio(); let pi=-1, sonando=false;
const btn=document.getElementById('btn'), est=document.getElementById('est');
const spans=(p)=>document.querySelectorAll('span[data-p="'+p+'"]');

function marca(p,idx){
  document.querySelectorAll('.par span.on').forEach(s=>s.classList.remove('on'));
  document.querySelectorAll('.par.activo').forEach(x=>x.classList.remove('activo'));
  const par=document.querySelector('.par[data-p="'+p+'"]');
  if(par){par.classList.add('activo');}
  if(idx>=0){const s=spans(p)[idx]; if(s){s.classList.add('on');
    const r=s.getBoundingClientRect();
    if(r.top<80||r.bottom>innerHeight-110)s.scrollIntoView({block:'center',behavior:'smooth'});}}
}
function carga(p){pi=p; audio.src=L[p].mp3; marca(p,-1);}
function siguiente(){ if(pi+1<L.length){carga(pi+1); audio.play();} else {sonando=false; btn.textContent='▶ Ouvir'; marca(-1,-1); est.textContent='fim';} }
audio.addEventListener('ended',siguiente);
audio.addEventListener('timeupdate',()=>{
  const t=audio.currentTime, ws=L[pi].w;
  // búsqueda lineal desde atrás: las palabras son ~50 por párrafo
  let idx=-1; for(let i=0;i<ws.length;i++){ if(t>=ws[i][0]-0.03&&t<=ws[i][1]+0.12){idx=i;break;} if(t<ws[i][0])break; idx=i; }
  if(idx>=0)marca(pi,idx);
  est.textContent='párrafo '+(pi+1)+'/'+L.length;
});
btn.addEventListener('click',()=>{
  if(sonando){audio.pause();sonando=false;btn.textContent='▶ Ouvir';return;}
  if(pi<0)carga(0);
  audio.play();sonando=true;btn.textContent='⏸ Pausa';
});
document.querySelectorAll('.par span').forEach(s=>{
  s.addEventListener('click',()=>{
    const p=+s.dataset.p,w=+s.dataset.w;
    if(pi!==p)carga(p);
    audio.currentTime=L[p].w[w][0];
    audio.play();sonando=true;btn.textContent='⏸ Pausa';
  });
});
</script>
</body></html>`;

fs.writeFileSync(path.join(DIR, 'lector.html'), html);
console.log('escrito:', path.join(DIR, 'lector.html'), Math.round(html.length / 1024) + ' KB');
