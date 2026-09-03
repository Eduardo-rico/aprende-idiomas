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
    # el módulo de node — así la regla vive en un solo sitio. Para cs/ru
    # la normalización completa (homóglifos, raya) la aplica
    # `normalizar-privadas.mjs` sobre lo escrito, con el MISMO módulo.
    s = unicodedata.normalize('NFC', s)
    if LANG == 'ro':
        s = s.replace('ş', 'ș').replace('Ş', 'Ș').replace('ţ', 'ț').replace('Ţ', 'Ț')
    return s


# ── 0. extraer páginas ──
# Dos extractores (estante cs/ru, 2026-09-02): pypdf (el de las 7 obras
# PT y Cărtărescu) y `pdftotext` de poppler, que en el PDF de Kundera no
# mete el espacio espurio ante los diacríticos («p řečetl» → «přečetl»)
# y des-guiona por sí solo. Se elige por config; el reflujo es el mismo.
def paginas():
    if cfg.get('extractor', 'pypdf') == 'pdftotext':
        out = subprocess.run(['pdftotext', '-enc', 'UTF-8', cfg['pdf'], '-'], capture_output=True, text=True, check=True).stdout
        return out.split('\f')
    if cfg.get('extractor') == 'txt-dir':
        # ESCANEO sin capa de texto (Sladkov) o con capa inservible
        # (Strugatski, 17,6 % de palabras desconocidas frente a 4,7 % del
        # OCR nuevo): las páginas vienen de `tesseract -l rus` (ocr-escaneo.sh),
        # un .txt por página en `dirTxt`, ordenados por número.
        d = Path(cfg['dirTxt'])
        return [p.read_text() for p in sorted(d.glob('*.txt'))]
    from pypdf import PdfReader
    r = PdfReader(cfg['pdf'])
    return [(p.extract_text() or '') for p in r.pages]


pags = paginas()
ini, fin = cfg.get('pagInicio', 0), cfg.get('pagFin', len(pags))
re_titulo = re.compile(cfg.get('tituloRegex', '$^'))
excluir = set(cfg.get('titulosExcluir', []))
# folio con forma propia («– 7 –» en Ota Pavel), además de los solo-dígitos
re_folio = re.compile(cfg['folioRegex']) if cfg.get('folioRegex') else None
# retoques por línea declarados en el config (OCR de un título, un
# epígrafe en letras espaciadas): [regex, reemplazo], contados
reemplazos = [(re.compile(a), b) for a, b in cfg.get('reemplazos', [])]
n_reemplazos = 0

# ── 1. recolectar líneas con su página ──
# Los folios (líneas de solo dígitos) se quitan DESPUÉS de coser
# fragmentos: el «1970» de «Abril, no Rio, em 1970» y el «74» de «74
# Degraus» son solo-dígitos y el filtro se los comía ANTES de que el
# cosedor pudiera reconstruir el título (cicatriz de Fonseca).
lineas, folios = [], 0
# Basura de OCR (escaneos con ilustraciones, Sladkov: «Ди с», «СРД,», «И О
# ть у ее»): una línea corta sin ninguna palabra de ≥4 letras y sin
# puntuación de cierre no es texto. Se quita SÓLO con `quitarLineasBasura`
# y se cuenta, con muestra impresa.
basura, simbolos, muestra_basura = 0, 0, []


# «palabra plausible»: ≥3 letras, con vocal y sin mezclar alfabetos. El
# OCR de una ilustración da tokens de una o dos letras, sin vocal o
# mezclando escrituras («ЗйЙ», «бзыч», «Ш», «#*», «КОаЬНй»).
VOCALES = set('аеёиоуыэюяaeiouyáéíóúůě')
RE_TOK = re.compile(r'[^\W\d_]+')


def plausible(tok):
    letras = ''.join(RE_TOK.findall(tok))
    if len(letras) < 3 or not (set(letras.lower()) & VOCALES):
        return False
    cir = bool(re.search(r'[а-яёА-ЯЁ]', letras))
    lat = bool(re.search(r'[a-zA-Z]', letras))
    return not (cir and lat)


RE_PUNT = re.compile(r'^[«»„“”—–\-.,!?;:()\[\]…\'"]+$')


def es_basura(ln):
    if not cfg.get('quitarLineasBasura'):
        return False
    # línea CORTA sin NINGUNA palabra plausible («Ди с», «СРД,», «ВЯ 7»).
    # El criterio es «plausible», no «≥4 letras»: con el segundo se caía
    # «зил:» — el rabo de «прогово-|рил:» partido entre páginas, que es
    # texto (visto en el control sobre Dovlatov).
    if len(ln) < 25 and not ln.endswith(FIN_FRASE_BASURA) and not any(plausible(t) for t in ln.split()):
        return True
    # línea LARGA de ilustración: casi ninguno de sus tokens es palabra
    # plausible. El UMBRAL está MEDIDO, no elegido a ojo (2026-09-02):
    # la distribución de esa proporción por línea da, en los dos libros
    # LIMPIOS, percentil 1 = 0,45 y peor línea real 0,25 («- Но я же
    # пьяный.»); en el OCR de las ilustraciones de Sladkov, percentil 10
    # = 0,10 y las peores 0,00. El corte va en 0,20: por debajo de la
    # peor línea legítima y muy por encima de la basura.
    toks = [t for t in ln.split() if not RE_PUNT.match(t)]
    return len(toks) >= 4 and sum(1 for t in toks if plausible(t)) / len(toks) < 0.20


# Tokens sueltos de símbolo (°, №, |, \, #, *, ‘) que el OCR deja dentro
# de una línea buena: «прилетит и ° всё растреплет».
RE_SIMBOLO = re.compile(r'^[^\w\s«»„“”—–\-.,!?;:()\[\]…\'"]+$')


def limpiar_simbolos(ln):
    if not cfg.get('quitarLineasBasura'):
        return ln, 0
    toks = ln.split()
    ok = [t for t in toks if not RE_SIMBOLO.match(t)]
    return ' '.join(ok), len(toks) - len(ok)


# Letras sueltas de la ilustración que caen DENTRO de una línea buena
# («прилетит и ° всё растреплет», «поменыше и цветом потусклее эс»): un
# token de una o dos letras que el diccionario de la lengua NO conoce.
# Se decide con hunspell, nunca con una lista escrita a mano.
#
# Por qué esto no es tapar el defecto (gotcha «la normalización tapa el
# rasgo»): la calidad del OCR se mide por DOS caminos independientes, y
# el segundo NO depende de esta limpieza — la basura LARGA (≥3 letras,
# desconocida y sin vocal / con letra latina / con tres iguales). MEDIDO
# 2026-09-02: por ese segundo camino Sladkov da mediana 0,00 % y máximo
# 0,41 %, contra un corpus público de mediana 0,00 % y máximo 2,59 %: el
# OCR reconoce las PALABRAS bien y lo que sobra son letras sueltas de los
# dibujos. Si el segundo camino se hubiera disparado, el libro se declara
# fuera y no se limpia nada.
letras_sueltas, muestra_sueltas = 0, []


def quitar_letras_sueltas(cuentos):
    dic = AQUI.parent.parent / 'tools/hunspell' / DICS.get(LANG, '')
    if not cfg.get('quitarLineasBasura') or LANG not in DICS or not dic.with_suffix('.dic').exists():
        return cuentos
    cand = {t for _, ls, _, _ in cuentos for ln in ls for t in ln.split()
            if RE_TOK.fullmatch(t) and len(t) <= 2}
    if not cand:
        return cuentos
    r = subprocess.run(['hunspell', '-d', str(dic), '-l'], input='\n'.join(sorted(c.lower() for c in cand)), capture_output=True, text=True)
    malas = {w for w in r.stdout.split('\n') if w}
    global letras_sueltas
    fuera = set()
    nuevos = []
    for tit, ls, autor, bon in cuentos:
        limpias = []
        for ln in ls:
            toks = ln.split()
            keep = [t for t in toks if not (RE_TOK.fullmatch(t) and len(t) <= 2 and t.lower() in malas)]
            for t in toks:
                if t not in keep and t not in fuera and len(muestra_sueltas) < 12:
                    muestra_sueltas.append(t)
                    fuera.add(t)
            letras_sueltas += len(toks) - len(keep)
            if keep:
                limpias.append(' '.join(keep))
        nuevos.append((tit, limpias, autor, bon))
    return nuevos


FIN_FRASE_BASURA = tuple('.!?…»"')
for i in range(ini, min(fin, len(pags))):
    for ln in pags[i].split('\n'):
        # pypdf separa palabras con TAB en algunos PDF (Humanitas): a espacio
        ln = normalizar(ln.replace('\t', ' '))
        for rx, rep in reemplazos:
            ln, k = rx.subn(rep, ln)
            n_reemplazos += k
        ln = re.sub(r' {2,}', ' ', ln.strip())
        if ln and es_basura(ln):
            basura += 1
            if len(muestra_basura) < 8:
                muestra_basura.append(ln[:70])
            continue
        if ln:
            ln, k = limpiar_simbolos(ln)
            simbolos += k
            if ln:
                lineas.append(ln)
if basura or simbolos:
    print(f'  basura OCR quitada: {basura} líneas, {simbolos} tokens de símbolo — muestra: {" | ".join(muestra_basura)}')

# ── 2. partir en cuentos por línea-título ──
# Tres modos de detectar el título:
#   'regex' (default): la línea entera casa con tituloRegex (Lispector: MAYÚSCULAS)
#   'antes-de-versales': línea corta en caja normal seguida de arranque en
#       VERSALES (Tavares: «Um país agradável» + «ERA UM PAÍS…»)
#   'lista': el título es EXACTAMENTE una de titulosLista (Sagarana: el sumário).
#       Cada entrada es una cadena, o un objeto {"linea", "titulo"} cuando la
#       línea del PDF no es el título bonito (el OCR de Tolstaya escribe
#       «МИЛЛЯ ШУРА» y «соня»; el título que se publica es el de la portada).
modo = cfg.get('modoTitulo', 'regex')
_lista = cfg.get('titulosLista', [])
lista_titulos = [t if isinstance(t, str) else t['linea'] for t in _lista]
# El título bonito va por POSICIÓN en la lista, no por línea: una novela
# repite la misma línea («ГЛАВА ПЕРВАЯ» abre las tres historias de
# Strugatski) y un dict por línea se queda con la última — las tres
# primeras salieron rotuladas «Всяческая суета» en la primera pasada.
bonito_por_indice = [None if isinstance(t, str) else t['titulo'] for t in _lista]
_bonito_actual = [None]

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
_sin = [l for l in lineas if not re.fullmatch(r'\d{1,4}', l) and not (re_folio and re_folio.fullmatch(l))]
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
            _bonito_actual[0] = bonito_por_indice[_esperado[0]]
            _esperado[0] += 1
            return True
        return False
    if modo == 'antes-de-versales':
        return (len(ln) < 55 and not ln.isupper() and not ln[0] in '—–«'
                and siguiente is not None
                and re.match(r'[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{2,}[ ,]', siguiente))
    return bool(re_titulo.fullmatch(ln))

# Antología de varios autores (Sladkov, «Рассказы о природе»: Bianki,
# Prishvin, Sladkov…): la línea-autor del PDF («ВИТАЛИЙ БИАНКИ») fija el
# autor de los cuentos que siguen. `autores` = {línea: "Nombre bonito"}.
autores_linea = cfg.get('autores', {})
autor_actual = cfg['autor']
cuentos, actual, titulo = [], [], None
for idx, ln in enumerate(lineas):
    siguiente = lineas[idx + 1] if idx + 1 < len(lineas) else None
    if ln in autores_linea:
        autor_actual = autores_linea[ln]
        continue
    if es_titulo(ln, siguiente):
        if titulo is not None:
            if actual:
                cuentos.append((titulo, actual, autor_cuento, bonito_cuento))
            else:
                # sección estructural sin cuerpo (una «parte»): se reporta
                print(f'  (sección sin cuerpo, no es cuento: «{titulo}»)')
        titulo, actual, autor_cuento, bonito_cuento = ln, [], autor_actual, _bonito_actual[0]
    elif titulo is not None:
        actual.append(ln)
if titulo and actual:
    cuentos.append((titulo, actual, autor_cuento, bonito_cuento))
if modo == 'lista' and _esperado[0] < len(lista_titulos):
    print(f'  ⚠ títulos de la lista NO encontrados en el PDF: {lista_titulos[_esperado[0]:]}')

# ── 3. reflujo de párrafos ──
anchos = sorted(len(l) for _, c, _, _ in cuentos for l in c)
ancho_libro = anchos[int(len(anchos) * 0.75)] if anchos else 90
UMBRAL = ancho_libro - cfg.get('margenCorte', 18)
FIN_FRASE = tuple('.!?…»"“')
# Abren párrafo: raya de diálogo, comillas de apertura. Las comillas
# bajas «„» del checo abren párrafo SÓLO si lo anterior cerró frase (o
# terminó en dos puntos: «Pan doktor:» / «„Deset tisíc.“»): una cita
# que empieza justo al principio de línea en mitad de una frase no es
# párrafo nuevo. La raya «- » ASCII del OCR ruso (Dovlatov: 679 líneas)
# cuenta como raya; `texto-ru.mjs` la convierte después a «—».
ABREN = tuple(cfg.get('abreParrafo', ['—', '–', '«']))
ABREN_TRAS_FRASE = tuple(cfg.get('abreParrafoTrasFrase', []))
SHY = '­'


def abre(ln, buf):
    if ln.startswith(ABREN) or re.match(r'-\s', ln):
        return True
    return bool(ABREN_TRAS_FRASE) and ln.startswith(ABREN_TRAS_FRASE) and buf.endswith(FIN_FRASE + (':',))


# ── guion de fin de línea: ¿partición de palabra o guion del compuesto? ──
# En checo y ruso des-guionar es lo correcto… salvo cuando la línea parte
# JUSTO por el guion de un compuesto: «какой-|нибудь», «что-|то»,
# «часто-|часто», «je-|li». MEDIDO en la primera pasada (2026-09-02):
# Tolstaya dio «какойнибудь», «чтото», «общемто», «Всегото»; Dovlatov
# «попытайтеська». Se decide con el diccionario hunspell de la lengua
# (tools/hunspell), en un solo lote: si la unión sin guion es palabra
# conocida → se une; si no, y la forma con guion es conocida, o la
# segunda parte es partícula (-нибудь, -то, -li), o es reduplicación
# (часто-часто) → se conserva el guion; en cualquier otro caso se une y
# se cuenta como «unión no confirmada». Muestra impresa al final.
DICS = {'cs': 'cs_CZ', 'ru': 'ru_RU', 'ro': 'ro_RO'}
PARTICULAS = {'ru': {'нибудь', 'то', 'либо', 'ка', 'таки', 'де', 'с', 'тка'}, 'cs': {'li'}}.get(LANG, set())
PREFIJOS = {'ru': {'кое', 'кой', 'из', 'по', 'пол'}}.get(LANG, set())   # из-под, по-русски, кое-что, пол-Москвы
RE_A = re.compile(r'([^\W\d_]+)[-­]$')
RE_B = re.compile(r'^([^\W\d_]+)')
decision_guion, muestra_guion, n_guion = {}, {'guion': [], 'union-no-confirmada': []}, {'unir': 0, 'guion': 0, 'union-no-confirmada': 0}


def preparar_guiones(cuentos):
    dic = AQUI.parent.parent / 'tools/hunspell' / DICS.get(LANG, '')
    if cfg.get('guionEsRasgo') or LANG not in DICS or not dic.with_suffix('.dic').exists():
        return
    pares = set()
    for _, ls, _, _ in cuentos:
        for i in range(len(ls) - 1):
            a, b = RE_A.search(ls[i]), RE_B.match(ls[i + 1])
            if a and b:
                pares.add((a.group(1), b.group(1)))
    if not pares:
        return
    # hunspell -l tokeniza por el guion: preguntar «a-b» no sirve (la
    # primera pasada dio por «conocidos» Ры-марь y цеп-дятотся). Se
    # pregunta por «ab», «a» y «b» por separado.
    candidatas = sorted({f'{a}{b}' for a, b in pares} | {a for a, _ in pares} | {b for _, b in pares})
    r = subprocess.run(['hunspell', '-d', str(dic), '-l'], input='\n'.join(candidatas), capture_output=True, text=True)
    desconocidas = set(r.stdout.split('\n'))
    conocida = lambda w: w not in desconocidas
    for a, b in pares:
        if conocida(f'{a}{b}'):
            decision_guion[(a, b)] = 'unir'
        elif b.lower() in PARTICULAS or a.lower() in PREFIJOS or a.lower() == b.lower():
            decision_guion[(a, b)] = 'guion'
        elif conocida(a) and conocida(b) and a[0].islower() and len(a) >= 3 and len(b) >= 3:
            # compuesto de dos palabras plenas («общественно-политическим»,
            # «восточно-германского»); un nombre propio partido
            # («Лолло-бриджида», «Ры-марь») empieza en mayúscula y se une
            decision_guion[(a, b)] = 'guion'
        else:
            decision_guion[(a, b)] = 'union-no-confirmada'


def unir_guion(buf, ln):
    a, b = RE_A.search(buf), RE_B.match(ln)
    d = decision_guion.get((a.group(1), b.group(1)), 'unir') if a and b else 'unir'
    n_guion[d] += 1
    if d != 'unir' and len(muestra_guion[d]) < 12:
        muestra_guion[d].append(f'{a.group(1)}-{b.group(1)}')
    return buf + ln if d == 'guion' else buf[:-1] + ln


def reflujo(ls):
    parrafos, buf = [], ''
    for ln in ls:
        # guion blando de fin de línea (U+00AD: el OCR de Dovlatov y
        # Tolstaya lo deja en 829 y 2.111 líneas): partición de palabra,
        # se une sin él (con la misma comprobación de compuesto)
        if ln.endswith(SHY):
            ln = ln[:-1] + '-'
        if abre(ln, buf) and buf:
            parrafos.append(buf)
            buf = ln
        elif buf.endswith('-') and not buf.endswith(' -'):
            # des-guionado… salvo donde el guion es RASGO de la lengua: en
            # rumano «se-ntindea», «m-a», «zona-ntunecată» parten línea en
            # el guion y unirlos sin él da «sentindea» (49 de 49 líneas
            # del PDF de Cărtărescu). `guionEsRasgo` lo conserva.
            buf = (buf + ln) if cfg.get('guionEsRasgo') else unir_guion(buf, ln)
        else:
            buf = f'{buf} {ln}'.strip()
        if len(ln) < UMBRAL and buf.endswith(FIN_FRASE):
            parrafos.append(buf)
            buf = ''
    if buf:
        parrafos.append(buf)
    return [re.sub(r'\s+', ' ', p).replace(SHY, '').strip() for p in parrafos if p.strip()]


def slug(s):
    s = unicodedata.normalize('NFD', s)
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    # cirílico → latín (translit sencilla, sólo para el id del fichero)
    TR = dict(zip('абвгдежзийклмнопрстуфхцчшщъыьэюяё', ['a', 'b', 'v', 'g', 'd', 'e', 'zh', 'z', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh', 'shch', '', 'y', '', 'e', 'yu', 'ya', 'yo']))
    s = ''.join(TR.get(c, c) for c in s.lower())
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')[:40]


def bonito(tit, declarado=None):
    if declarado:
        return declarado
    if not tit.isupper():
        return tit
    # PT: Title Case (regla de las 7 obras). Otras lenguas: caja de frase
    # (en checo y ruso «Doktor Havel Po Dvaceti Letech» está mal).
    return tit.title() if LANG == 'pt' else tit[0] + tit[1:].lower()


escritos, errores, total = [], [], 0
cuentos = quitar_letras_sueltas(cuentos)
if letras_sueltas:
    print(f'  letras sueltas de ilustración quitadas: {letras_sueltas} — muestra: {" ".join(muestra_sueltas)}')
preparar_guiones(cuentos)
for orden, (tit, ls, autor, bon) in enumerate(cuentos, 1):
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
    titulo_bonito = bonito(tit, bon)
    lid = f"{cfg['serieId']}-{orden:02d}-{slug(titulo_bonito)}"
    if lid in publicos:
        sys.exit(f'GATE: colisión con el catálogo público: {lid}')
    total += palabras
    lectura = {
        'id': lid, 'titulo': titulo_bonito, 'autor': autor,
        'fuente': f"copia personal de Edu ({Path(cfg['pdf']).name[:60]})",
        'licencia': 'copia personal — NO redistribuir; estante privado gitignorado',
        'nivel': cfg['nivel'], 'modo': 'texto', 'privada': True,
        'variante': cfg['variante'],
        **({'notaOrtografia': cfg['notaOrtografia']} if cfg.get('notaOrtografia') else {}),
        'serie': {'id': cfg['serieId'], 'titulo': cfg['serieTitulo'], 'orden': orden},
        'parrafos': [{'texto': p} for p in parrafos],
    }
    (OUT / f'{lid}.json').write_text(json.dumps(lectura, ensure_ascii=False, indent=1) + '\n')
    escritos.append(f'{lid} · {palabras} palabras · {len(parrafos)} párrafos' + (f' · {autor}' if autores_linea else ''))

print(f"\n{cfg['serieTitulo']}: {len(escritos)} cuentos, {total} palabras (medidas) · ancho libro {ancho_libro} · {folios} folios quitados · {n_reemplazos} reemplazos de config")
for e in escritos:
    print('  ✓', e)
if sum(n_guion.values()):
    print(f"guiones de fin de línea: {n_guion['unir']} unidos (palabra conocida) · {n_guion['guion']} conservados (compuesto) · {n_guion['union-no-confirmada']} unidos sin confirmar")
    for k, v in muestra_guion.items():
        if v:
            print(f'  {k}: {", ".join(v)}')
if errores:
    print(f'\ndescartes REPORTADOS ({len(errores)}):')
    for e in errores:
        print('  ✗', e)

# Normalización de la lengua con SU módulo (`texto-<lang>.mjs`: NFC,
# homóglifos y raya en ruso) y gate sobre lo escrito, con el MISMO módulo
# que usa la biblioteca pública. Si el gate falla, se borra lo escrito.
if LANG != 'pt' and escritos:
    ids = [e.split(' · ')[0] for e in escritos]
    n = subprocess.run(['node', str(AQUI / 'normalizar-privadas.mjs'), LANG, str(OUT), *ids], capture_output=True, text=True)
    print(n.stdout.strip())
    if n.returncode != 0:
        sys.exit(f'normalizar-privadas.mjs falló: {n.stderr.strip()}')
    g = subprocess.run(['node', str(AQUI / 'gate-privadas.mjs'), LANG, str(OUT)], capture_output=True, text=True)
    print(g.stdout.strip())
    if g.returncode != 0:
        for lid in ids:
            (OUT / f'{lid}.json').unlink(missing_ok=True)
        sys.exit(f'GATE de {LANG} en rojo: {g.stderr.strip() or g.stdout.strip()} — nada queda escrito')
