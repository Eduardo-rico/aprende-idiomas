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
import json, re, subprocess, sys, unicodedata
from pathlib import Path
from pypdf import PdfReader

cfg = json.load(open(sys.argv[1]))
# Fase F (2026-09-02): parametrizado por lengua. `lang` (default pt) elige
# el estante; `raizSalida` permite escribir en OTRO checkout (el estante
# privado está gitignorado y se ingiere en el checkout principal, no en
# un worktree). Los scripts se resuelven desde este fichero.
LANG = cfg.get('lang', 'pt')
RAIZ = Path(cfg.get('raizSalida', Path.cwd()))
AQUI = Path(__file__).resolve().parent
OUT = RAIZ / f'lib/data/languages/{LANG}/lecturas-privadas'
PUB = RAIZ / f'lib/data/languages/{LANG}/lecturas'
publicos = {p.stem for p in PUB.glob('*.json')}
OUT.mkdir(parents=True, exist_ok=True)


def normalizar(s):
    # ș/ț con COMA (U+0219/U+021B), nunca cedilla: la misma regla que
    # `texto-ro.mjs` (normalizarDiacriticos); aquí sólo para el rumano.
    # La verificación de verdad la hace `gate-privadas.mjs` al final, con
    # el módulo de node — así la regla vive en un solo sitio.
    s = unicodedata.normalize('NFC', s)
    if LANG == 'ro':
        s = s.replace('ş', 'ș').replace('Ş', 'Ș').replace('ţ', 'ț').replace('Ţ', 'Ț')
    return s

r = PdfReader(cfg['pdf'])
ini, fin = cfg.get('pagInicio', 0), cfg.get('pagFin', len(r.pages))
re_titulo = re.compile(cfg.get('tituloRegex', '$^'))
excluir = set(cfg.get('titulosExcluir', []))

# ── 1. recolectar líneas con su página ──
# Los folios (líneas de solo dígitos) se quitan DESPUÉS de coser
# fragmentos: el «1970» de «Abril, no Rio, em 1970» y el «74» de «74
# Degraus» son solo-dígitos y el filtro se los comía ANTES de que el
# cosedor pudiera reconstruir el título (cicatriz de Fonseca).
lineas, folios = [], 0
for i in range(ini, min(fin, len(r.pages))):
    for ln in (r.pages[i].extract_text() or '').split('\n'):
        # pypdf separa palabras con TAB en algunos PDF (Humanitas): a espacio
        ln = normalizar(ln.replace('\t', ' '))
        if ln.strip():
            lineas.append(re.sub(r' {2,}', ' ', ln.strip()))

# ── 2. partir en cuentos por línea-título ──
# Tres modos de detectar el título:
#   'regex' (default): la línea entera casa con tituloRegex (Lispector: MAYÚSCULAS)
#   'antes-de-versales': línea corta en caja normal seguida de arranque en
#       VERSALES (Tavares: «Um país agradável» + «ERA UM PAÍS…»)
#   'lista': el título es EXACTAMENTE una de titulosLista (Sagarana: el sumário)
modo = cfg.get('modoTitulo', 'regex')
lista_titulos = cfg.get('titulosLista', [])

# Con coserFragmentos, los títulos que el PDF parte en trocitos («O» /
# «campeonato», «Nau» / «Catrineta») se re-unen ANTES de comparar contra
# la lista: una racha de líneas cortas sin puntuación final se funde en
# una sola línea candidata si el resultado casa (case-insensitive) con
# algún título de la lista. Cicatriz de Fonseca (2026-08-12).
if cfg.get('coserFragmentos') and lista_titulos:
    lt_norm = {t.lower(): t for t in lista_titulos}
    cosidas, i = [], 0
    while i < len(lineas):
        if len(lineas[i]) < 52 and lineas[i][-1:] not in '.!?»"':
            for largo in (5, 4, 3, 2):
                cand = ' '.join(lineas[i:i + largo])
                if cand.lower() in lt_norm:
                    cosidas.append(lt_norm[cand.lower()])
                    i += largo
                    break
            else:
                cosidas.append(lineas[i]); i += 1
        else:
            cosidas.append(lineas[i]); i += 1
    lineas = cosidas

# ahora sí: fuera folios (los dígitos que sobrevivieron al cosido)
_sin = [l for l in lineas if not re.fullmatch(r'\d{1,4}', l)]
folios = len(lineas) - len(_sin)
lineas = _sin

# El matching de lista es SECUENCIAL: el sumário es el orden del libro,
# así que sólo se acepta el título que TOCA. Sin esto, un título citado
# dentro del texto («…tia Olímpia declamar a Nau Catrineta…» como línea
# suelta en itálicas) parte el cuento por la mitad — pasó con Fonseca.
_esperado = [0]

def es_titulo(ln, siguiente):
    if ln in excluir:
        return False
    if modo == 'lista':
        if _esperado[0] < len(lista_titulos) and ln == lista_titulos[_esperado[0]]:
            _esperado[0] += 1
            return True
        return False
    if modo == 'antes-de-versales':
        return (len(ln) < 55 and not ln.isupper() and not ln[0] in '—–«'
                and siguiente is not None
                and re.match(r'[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{2,}[ ,]', siguiente))
    return bool(re_titulo.fullmatch(ln))

cuentos, actual, titulo = [], [], None
for idx, ln in enumerate(lineas):
    siguiente = lineas[idx + 1] if idx + 1 < len(lineas) else None
    if es_titulo(ln, siguiente):
        if titulo is not None:
            if actual:
                cuentos.append((titulo, actual))
            else:
                # sección estructural sin cuerpo (una «parte»): se reporta
                print(f'  (sección sin cuerpo, no es cuento: «{titulo}»)')
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
            # des-guionado… salvo donde el guion es RASGO de la lengua: en
            # rumano «se-ntindea», «m-a», «zona-ntunecată» parten línea en
            # el guion y unirlos sin él da «sentindea» (49 de 49 líneas
            # del PDF de Cărtărescu). `guionEsRasgo` lo conserva.
            buf = (buf if cfg.get('guionEsRasgo') else buf[:-1]) + ln
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
    # PALABRA = algo con una letra dentro (regla de PT: contar tokens
    # sumaba las rayas y movía la cifra de portada un 2 %)
    palabras = sum(1 for p in parrafos for t in p.split() if re.search(r'\w', t) and not t.isdigit())
    if palabras < cfg.get('minPalabras', 300):
        errores.append(f'«{tit}»: {palabras} palabras < mínimo — saltado')
        continue
    tope = cfg.get('maxCharsParrafo', 1800)  # Lispector legítimamente pasa de 1800
    gigantes = sum(1 for p in parrafos if len(p) > tope)
    # Exención POR CUENTO, explícita en el config: hay relatos que SON un
    # solo párrafo kilométrico (el monólogo de «Agruras de um jovem
    # escritor» de Fonseca). Se declara título por título — nada de subir
    # el tope del libro entero hasta dejar el gate ciego.
    if tit in cfg.get('sinTopeParrafo', []):
        gigantes = 0
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
        **({'notaOrtografia': cfg['notaOrtografia']} if cfg.get('notaOrtografia') else {}),
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

# Gate de la lengua sobre lo escrito (diacríticos, cedilla), con el MISMO
# módulo que usa la biblioteca pública. Si falla, se borra lo escrito.
if LANG != 'pt':
    g = subprocess.run(['node', str(AQUI / 'gate-privadas.mjs'), LANG, str(OUT)], capture_output=True, text=True)
    print(g.stdout.strip())
    if g.returncode != 0:
        for e in escritos:
            (OUT / f"{e.split(' · ')[0]}.json").unlink(missing_ok=True)
        sys.exit(f'GATE de {LANG} en rojo: {g.stderr.strip() or g.stdout.strip()} — nada queda escrito')
