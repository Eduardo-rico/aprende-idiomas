// Camas de ambiente bajo cada episodio.
//
// QUÉ ES Y QUÉ NO ES. Esto NO es foley. El foley son los efectos
// puntuales que las direcciones piden en casi cada réplica —la moneda
// cayendo sobre el mármol entre bloque y bloque, la campanilla encima de
// la última sílaba, los frenos en el segundo exacto— y ésos hay que
// grabarlos o comprarlos: sintetizados suenan a juguete y hacen más daño
// que el silencio.
//
// Esto es la cama: el ruido de fondo continuo del sitio donde pasa la
// escena. Se sintetiza con ruido filtrado, que es exactamente lo que un
// ambiente ES —no tiene transitorios que imitar— y resuelve el problema
// más gordo que tiene hoy el audio: entre réplica y réplica hay silencio
// digital absoluto, que no existe en ningún sitio del mundo real y
// delata que esto es TTS a los cuatro segundos.
//
// Nivel deliberadamente bajo. Una cama que se oye es una cama mal puesta:
// tiene que notarse cuando desaparece, no cuando está.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DIR = process.env.DIR || '/Users/lalo/Desktop/ao-balcao-doblaje';
const FIN = path.join(DIR, 'episodios');
const CON = path.join(DIR, 'episodios-con-ambiente');
const TMP = path.join(DIR, '.amb');
fs.mkdirSync(CON, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

const sh = (b, a) => execFileSync(b, a, { stdio: ['ignore', 'pipe', 'pipe'] });

// Cada cama es ruido de color filtrado. `brown` da la masa grave (motor,
// tráfico lejano, nevera); `pink` da el aire y el roce (sala, loza).
const CAMAS = {
  // Pastelaria a las siete y media: máquina de café, nevera, loza lejana.
  pastelaria: 'anoisesrc=c=brown:a=0.30[b];anoisesrc=c=pink:a=0.06[p];' +
              '[b]lowpass=f=420,highpass=f=60[bb];[p]bandpass=f=2600:width_type=o:w=2.2,volume=0.5[pp];' +
              '[bb][pp]amix=inputs=2:normalize=0',
  // Calle de domingo por la mañana en Arroios: casi nada, y ese casi nada
  // es el contenido — el ep. 10 empieza porque todo está cerrado.
  domingo:    'anoisesrc=c=brown:a=0.14[b];[b]lowpass=f=300,highpass=f=50',
  // Dentro del autocarro: motor y carrocería.
  autocarro:  'anoisesrc=c=brown:a=0.55[b];[b]lowpass=f=260,highpass=f=40',
  // Sala de espera con eco duro: sillas de plástico, techo alto.
  sala:       'anoisesrc=c=pink:a=0.10[p];[p]bandpass=f=900:width_type=o:w=3,aecho=0.7:0.5:120:0.2',
  // Calle con tráfico de verdad: Sónia anda por Lisboa hablando por teléfono.
  calle:      'anoisesrc=c=brown:a=0.42[b];anoisesrc=c=pink:a=0.05[p];' +
              '[b]lowpass=f=520,highpass=f=55[bb];[p]highpass=f=1800,volume=0.4[pp];' +
              '[bb][pp]amix=inputs=2:normalize=0',
};

// Qué ambiente lleva cada pieza, y a qué nivel. El nivel va por pieza
// porque no es lo mismo un autocarro —que tapa— que una calle vacía de
// domingo, que es silencio con textura.
const POR_PIEZA = {
  ep1:  ['pastelaria', 0.16],
  ep9:  ['pastelaria', 0.16],
  ep10: ['domingo', 0.13],
  ep11: ['autocarro', 0.15],
  ep13: ['sala', 0.12],
  ep14: ['sala', 0.12],
  ep15: ['sala', 0.13],
  P7:   ['sala', 0.10],
  P8:   ['pastelaria', 0.13],
  P9:   ['calle', 0.15],
  P10:  ['calle', 0.17],
  P11:  ['autocarro', 0.14],
  P12:  ['sala', 0.13],
};

const eps = JSON.parse(fs.readFileSync(path.join(FIN, 'episodios.json'), 'utf8'));
const salida = [];

for (const e of eps) {
  const [cama, nivel] = POR_PIEZA[e.pieza] ?? ['sala', 0.12];
  const dur = e.min * 60;
  const bed = path.join(TMP, `${e.pieza}-cama.mp3`);

  // 1,2 s de más para que el fundido de salida no coma la última sílaba.
  sh('ffmpeg', ['-y', '-filter_complex', `${CAMAS[cama]},volume=${nivel},` +
    `afade=t=in:st=0:d=1.5,afade=t=out:st=${(dur + 0.4).toFixed(2)}:d=1.2[out]`,
    '-map', '[out]', '-t', (dur + 1.6).toFixed(2), '-ar', '44100', '-ac', '1',
    '-c:a', 'libmp3lame', '-b:a', '128k', bed]);

  const dest = path.join(CON, `${e.pieza}.mp3`);
  // `duration=first` ancla la mezcla al diálogo: si la cama se quedara
  // corta o larga, manda la voz. Y `normalize=0` evita que ffmpeg baje el
  // diálogo 6 dB por el hecho de haber dos entradas — que es el fallo
  // clásico de amix y volvería la cama tan audible como la voz.
  sh('ffmpeg', ['-y', '-i', path.join(FIN, `${e.pieza}.mp3`), '-i', bed,
    '-filter_complex', '[0:a][1:a]amix=inputs=2:duration=first:normalize=0[out]',
    '-map', '[out]', '-c:a', 'libmp3lame', '-b:a', '128k', dest]);

  const d = parseFloat(sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dest]).toString());
  salida.push({ ...e, ambiente: cama, nivel, archivoAmbiente: `episodios-con-ambiente/${e.pieza}.mp3`, minAmbiente: +(d / 60).toFixed(2) });
  process.stdout.write(`${e.pieza} `);
}

fs.writeFileSync(path.join(FIN, 'episodios.json'), JSON.stringify(salida, null, 2));
console.log('\n');
for (const s of salida) {
  const ok = Math.abs(s.minAmbiente - s.min) < 0.02 ? '✓' : `✗ ${s.min}→${s.minAmbiente}`;
  console.log(`  ${s.pieza.padEnd(6)} ${s.ambiente.padEnd(11)} nivel ${s.nivel}  ${s.minAmbiente.toFixed(2)} min  ${ok}`);
}
fs.rmSync(TMP, { recursive: true, force: true });
