// ¿Existe un orden que sea a la vez SIN FUGA y no resoluble por posición?
import { evaluarMolde } from '../scripts/lib/pares-minimos';
const line = (s='') => console.log(s);

function ordenes(P: number) {
  const base: {p:number;v:boolean}[] = [];
  for (let i=0;i<P;i++){ base.push({p:i,v:true}); base.push({p:i,v:false}); }
  const out: {p:number;v:boolean}[][] = [];
  const rec = (rest: typeof base, pre: typeof base) => {
    if(!rest.length){ out.push(pre); return; }
    for(let i=0;i<rest.length;i++) rec([...rest.slice(0,i),...rest.slice(i+1)],[...pre,rest[i]!]);
  };
  rec(base,[]);
  const vistos=new Set<string>(); const uniq:typeof out=[];
  for(const o of out){ const k=o.map(s=>`${s.p}${s.v?'B':'M'}`).join('|'); if(!vistos.has(k)){vistos.add(k);uniq.push(o);} }
  return uniq;
}
// resoluble por posición: existe un umbral k tal que «pos<k ⇒ BIEN» (o al revés)
// acierta el 100 %, o la paridad lo hace.
const resolublePorPosicion = (pat: string) => {
  const n = pat.length;
  for (let k=1;k<n;k++){
    let a=0,b=0;
    for(let i=0;i<n;i++){ const pred = i<k; if(pred===(pat[i]==='B')) a++; if(pred===(pat[i]==='M')) b++; }
    if(a===n||b===n) return `umbral en la posición ${k+1}`;
  }
  let a=0,b=0;
  for(let i=0;i<n;i++){ const par=i%2===0; if(par===(pat[i]==='B')) a++; if(par===(pat[i]==='M')) b++; }
  if(a===n||b===n) return 'paridad (alternancia mecánica)';
  return null;
};
line('| pares | N | órdenes | sin fuga (BIEN antes que su MAL) | + molde válido | + NO resoluble por posición |');
line('|---|---|---|---|---|---|');
for (let P=2;P<=5;P++){
  const os = ordenes(P);
  let sinFuga=0, molde=0, ok=0; const ej:string[]=[];
  for(const o of os){
    const pat=o.map(s=>s.v?'B':'M').join('');
    const libre = Array.from({length:P},(_,i)=>i).every(i=>{
      const iB=o.findIndex(s=>s.p===i&&s.v), iM=o.findIndex(s=>s.p===i&&!s.v); return iB<iM;
    });
    if(!libre) continue; sinFuga++;
    if(evaluarMolde(pat,[]).length) continue; molde++;
    if(resolublePorPosicion(pat)) continue; ok++;
    if(ej.length<3) ej.push(pat);
  }
  line(`| ${P} | ${P*2} | ${os.length} | ${sinFuga} | ${molde} | **${ok}**${ok?` (p. ej. ${ej.join(', ')})`:' ← IMPOSIBLE'} |`);
}
line('');
line('Los 6 órdenes sin fuga a N=4, con su patrón y por qué caen:');
for(const o of ordenes(2)){
  const pat=o.map(s=>s.v?'B':'M').join('');
  const libre=[0,1].every(i=>o.findIndex(s=>s.p===i&&s.v)<o.findIndex(s=>s.p===i&&!s.v));
  if(!libre) continue;
  line(`  ${pat}  pares ${o.map(s=>'P-0'+(s.p+2)).join(' ')} → resoluble por posición: ${resolublePorPosicion(pat) ?? 'NO'}`);
}
