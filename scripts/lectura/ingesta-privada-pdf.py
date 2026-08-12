#!/usr/bin/env python3
# scripts/lectura/ingesta-privada-pdf.py — ingesta del ESTANTE PRIVADO
# desde PDF (2026-08-12). Hermano del ingesta-privada-epub.mjs; en python
# porque pypdf es el extractor que ya probó las 7 obras.
#
# El PDF no trae párrafos: los reconstruye la heurística de reflujo —
# una línea claramente más corta que el ancho del libro Y terminada en
# puntuación cierra párrafo; una raya de diálogo abre párrafo nuevo; una
# línea terminada en guion se une des-guionada. Cada libro trae su
# config con el regex de títulos de cuento y las páginas útiles.
#
# Gates (sin descartes silenciosos):
#   · cada cuento ≥ minPalabras, si no se reporta y se salta
#   · párrafos-gigante (>1800 chars) ≤ 5% por cuento, si no ABORTA ese
#     cuento con reporte (la heurística falló ahí; se ajusta config)
#   · líneas de solo dígitos (folios) se quitan y SE CUENTAN
#   · colisión de id con el catálogo público → aborta todo
#
# Uso: python3 scripts/lectura/ingesta-privada-pdf.py <config.json>
import json, re, sys, unicodedata
from pathlib import Path
from pypdf import PdfReader

cfg = json.load(open(sys.argv[1]))
RAIZ = Path.cwd()
OUT = RAIZ / 'lib/data/languages/pt/lecturas-privadas'
PUB = RAIZ / 'lib/data/languages/pt/lecturas'
publicos = {p.stem for p in PUB.glob('*.json')}
OUT.mkdir(parents=True, exist_ok=True)

r = PdfReader(cfg['pdf'])
ini, fin = cfg.get('pagInicio', 0), cfg.get('pagFin', len(r.pages))
re_titulo = re.compile(cfg.get('tituloRegex', '$^'))
excluir = set(cfg.get('titulosExcluir', []))

# ── 1. recolectar líneas con su página, quitando folios ──
lineas, folios = [], 0
for i in range(ini, min(fin, len(r.pages))):
    for ln in (r.pages[i].extract_text() or '').split('\n'):
        ln = ln.rstrip()
        if re.fullmatch(r'\s*\d{1,4}\s*', ln):
            folios += 1
            continue
        if ln.strip():
            lineas.append(ln.strip())

# ── 2. partir en cuentos por línea-título ──
# Tres modos de detectar el título:
#   'regex' (default): la línea entera casa con tituloRegex (Lispector: MAYÚSCULAS)
#   'antes-de-versales': línea corta en caja normal seguida de arranque en
#       VERSALES (Tavares: «Um país agradável» + «ERA UM PAÍS…»)
#   'lista': el título es EXACTAMENTE una de titulosLista (Sagarana: el sumário)
modo = cfg.get('modoTitulo', 'regex')
lista_titulos = cfg.get('titulosLista', [])

def es_titulo(ln, siguiente):
    if ln in excluir:
        return False
    if modo == 'lista':
        return ln in lista_titulos
    if modo == 'antes-de-versales':
        return (len(ln) < 55 and not ln.isupper() and not ln[0] in '—–«'
                and siguiente is not None
                and re.match(r'[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{2,}[ ,]', siguiente))
    return bool(re_titulo.fullmatch(ln))

cuentos, actual, titulo = [], [], None
for idx, ln in enumerate(lineas):
    siguiente = lineas[idx + 1] if idx + 1 < len(lineas) else None
    if es_titulo(ln, siguiente):
        if titulo and actual:
            cuentos.append((titulo, actual))
        titulo, actual = ln, []
    elif titulo is not None:
        actual.append(ln)
if titulo and actual:
    cuentos.append((titulo, actual))

# ── 3. reflujo de párrafos ──
anchos = sorted(len(l) for _, c in cuentos for l in c)
ancho_libro = anchos[int(len(anchos) * 0.75)] if anchos else 90
UMBRAL = ancho_libro - cfg.get('margenCorte', 18)
FIN_FRASE = tuple('.!?…»"')


def reflujo(ls):
    parrafos, buf = [], ''
    for ln in ls:
        if ln.startswith(('—', '–', '«')) and buf:
            parrafos.append(buf)
            buf = ln
        elif buf.endswith('-') and not buf.endswith(' -'):
            buf = buf[:-1] + ln  # des-guionado
        else:
            buf = f'{buf} {ln}'.strip()
        if len(ln) < UMBRAL and buf.endswith(FIN_FRASE):
            parrafos.append(buf)
            buf = ''
    if buf:
        parrafos.append(buf)
    return [re.sub(r'\s+', ' ', p).strip() for p in parrafos if p.strip()]


def slug(s):
    s = unicodedata.normalize('NFD', s)
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')[:40]


escritos, errores, total = [], [], 0
for orden, (tit, ls) in enumerate(cuentos, 1):
    parrafos = reflujo(ls)
    palabras = sum(len(p.split()) for p in parrafos)
    if palabras < cfg.get('minPalabras', 300):
        errores.append(f'«{tit}»: {palabras} palabras < mínimo — saltado')
        continue
    tope = cfg.get('maxCharsParrafo', 1800)  # Lispector legítimamente pasa de 1800
    gigantes = sum(1 for p in parrafos if len(p) > tope)
    if gigantes / max(1, len(parrafos)) > 0.05:
        errores.append(f'«{tit}»: {gigantes}/{len(parrafos)} párrafos > {tope} chars — la heurística falló, ABORTADO')
        continue
    titulo_bonito = tit.title() if tit.isupper() else tit
    lid = f"{cfg['serieId']}-{orden:02d}-{slug(tit)}"
    if lid in publicos:
        sys.exit(f'GATE: colisión con el catálogo público: {lid}')
    total += palabras
    lectura = {
        'id': lid, 'titulo': titulo_bonito, 'autor': cfg['autor'],
        'fuente': f"copia personal de Edu ({Path(cfg['pdf']).name[:60]})",
        'licencia': 'copia personal — NO redistribuir; estante privado gitignorado',
        'nivel': cfg['nivel'], 'modo': 'texto', 'privada': True,
        'variante': cfg['variante'],
        'serie': {'id': cfg['serieId'], 'titulo': cfg['serieTitulo'], 'orden': orden},
        'parrafos': [{'texto': p} for p in parrafos],
    }
    (OUT / f'{lid}.json').write_text(json.dumps(lectura, ensure_ascii=False, indent=1) + '\n')
    escritos.append(f'{lid} · {palabras} palabras · {len(parrafos)} párrafos')

print(f"\n{cfg['serieTitulo']}: {len(escritos)} cuentos, {total} palabras (medidas) · ancho libro {ancho_libro} · {folios} folios quitados")
for e in escritos:
    print('  ✓', e)
if errores:
    print(f'\ndescartes REPORTADOS ({len(errores)}):')
    for e in errores:
        print('  ✗', e)
