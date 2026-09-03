#!/usr/bin/env python3
# scripts/lectura/gate-ocr-privadas.py — gate de CALIDAD DE OCR del
# estante privado (2026-09-02), hermano de `auditar-ocr-ro.mjs`.
#
#   python3 scripts/lectura/gate-ocr-privadas.py <lang> [--raiz DIR] [--serie PREFIJO] [--borrar]
#
# Por qué existe: cuatro de los libros del estante cs/ru no vienen de un
# fichero digital sino de una CAPA OCR (Dovlátov, Tolstáya) o de un OCR
# nuestro sobre un escaneo (Sladkov, Strugatski). Un OCR malo no falla:
# entrega un texto plausible con «запинште» por «запишите» y «зто» por
# «это». Eso no lo caza el gate de lengua (todo sigue siendo cirílico),
# así que se mide con hunspell y se compara con el CORPUS PÚBLICO de la
# misma lengua, que es la referencia de lo que este proyecto ya acepta.
#
# Regla, escrita antes de mirar los números de los escaneos:
#   · se mide la tasa de palabras desconocidas por pieza (sólo tokens en
#     minúscula, para no contar los nombres propios; en ruso ё→е, que el
#     ru_RU de Lebedev no distingue);
#   · el corte es el PERCENTIL 90 del corpus público de esa lengua —
#     no un número redondo elegido a ojo;
#   · una pieza por encima del corte NO se publica: se reporta con su
#     cifra (`--borrar` la quita del estante). Nada de «casi pasa».
#
# ⚠ Este gate es SÓLO para series que vienen de OCR; se pasa con
# `--serie`. Sobre un texto en lengua coloquial mide el rasgo, no el
# defecto: MEDIDO 2026-09-02, «Opilé banány» de Šabach da 7-9 % de
# desconocidas y son TODAS obecná čeština («sme», «kterej», «bejt»,
# «tý»), que es la lengua del narrador. Correrlo sobre ese libro sería
# el gotcha de siempre: un gate que aprueba (o suspende) por otra
# pregunta que la suya.
import json, re, statistics, subprocess, sys
from pathlib import Path

args = sys.argv[1:]
LANG = args[0] if args else 'ru'
RAIZ = Path(args[args.index('--raiz') + 1]) if '--raiz' in args else Path.cwd()
SERIE = args[args.index('--serie') + 1] if '--serie' in args else ''
BORRAR = '--borrar' in args
DICS = {'ro': 'ro_RO', 'cs': 'cs_CZ', 'ru': 'ru_RU'}
DIC = Path(__file__).resolve().parent.parent.parent / 'tools/hunspell' / DICS[LANG]
PUB = RAIZ / f'lib/data/languages/{LANG}/lecturas'
PRIV = RAIZ / f'lib/data/languages/{LANG}/lecturas-privadas'
RE_PAL = re.compile(r"[^\W\d_]+(?:['’\-][^\W\d_]+)*")


def texto(f):
    return '\n'.join(p['texto'] for p in json.loads(f.read_text())['parrafos'])


def tasa(t):
    toks = [w for w in RE_PAL.findall(t) if w[:1].islower()]
    if LANG == 'ru':
        toks = [w for w in toks if re.search('[а-яё]', w)]
    if not toks:
        return None, 0, []
    consulta = [w.replace('ё', 'е') for w in toks] if LANG == 'ru' else toks
    r = subprocess.run(['hunspell', '-d', str(DIC), '-l'], input='\n'.join(consulta),
                       capture_output=True, text=True, errors='replace')
    desc = {w for w in r.stdout.split('\n') if w}
    malas = [w for w, q in zip(toks, consulta) if q in desc]
    return 100 * len(malas) / len(toks), len(toks), malas


publicas = []
for f in sorted(PUB.glob('*.json')):
    v, _, _ = tasa(texto(f))
    if v is not None:
        publicas.append(v)
publicas.sort()
corte = publicas[int(0.9 * len(publicas))]
print(f'corpus público {LANG}: {len(publicas)} piezas · mediana {statistics.median(publicas):.2f} % · CORTE (p90) {corte:.2f} %')

fuera, dentro = [], 0
for f in sorted(PRIV.glob(f'{SERIE}*.json')):
    v, n, malas = tasa(texto(f))
    if v is None:
        continue
    if v > corte:
        from collections import Counter
        fuera.append((f, v, n, [w for w, _ in Counter(malas).most_common(10)]))
    else:
        dentro += 1
for f, v, n, ej in fuera:
    print(f'✗ {f.name[:58]:58s} {n:6d} pal · {v:5.2f} % desconocidas — FUERA · {", ".join(ej)}')
    if BORRAR:
        f.unlink()
print(f'gate-ocr {LANG}{" " + SERIE if SERIE else ""}: {dentro} piezas dentro · {len(fuera)} fuera{" (borradas)" if BORRAR and fuera else ""}')
sys.exit(1 if fuera and not BORRAR else 0)
