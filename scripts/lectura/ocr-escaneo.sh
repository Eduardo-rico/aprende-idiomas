#!/bin/bash
# scripts/lectura/ocr-escaneo.sh — OCR de un PDF ESCANEADO del estante
# privado (2026-09-02): un .txt por página con tesseract, para que
# `ingesta-privada-pdf.py` lo lea con `extractor: "txt-dir"`.
#
#   bash scripts/lectura/ocr-escaneo.sh <pdf> <dirSalida> <lang tesseract> [pagInicio] [pagFin]
#
# 300 dpi en gris, --psm 6 (bloque de texto uniforme: página de libro).
# Reanudable: salta las páginas que ya tienen .txt. MEDIDO antes de
# lanzarlo entero (5 páginas de muestra, hunspell ru_RU, palabras en
# minúscula): Strugatski capa de texto del PDF 17,6 % desconocidas vs
# OCR nuevo 4,7 %; Sladkov (sin capa) OCR 4,7 % — y en esa cifra van los
# trozos de palabra partida por guion que el reflujo une después.
set -e
PDF="$1"; OUT="$2"; LANG_T="${3:-rus}"
INI="${4:-1}"; FIN="${5:-$(pdfinfo "$PDF" | awk '/^Pages/{print $2}')}"
mkdir -p "$OUT"
for ((p=INI; p<=FIN; p++)); do
  n=$(printf '%04d' "$p")
  [ -s "$OUT/pag-$n.txt" ] && continue
  pdftoppm -r 300 -gray -png -f "$p" -l "$p" -singlefile "$PDF" "$OUT/pag-$n"
  tesseract "$OUT/pag-$n.png" "$OUT/pag-$n" -l "$LANG_T" --psm 6 >/dev/null 2>&1
  rm -f "$OUT/pag-$n.png"
done
echo "OCR: $(ls "$OUT"/pag-*.txt | wc -l | tr -d ' ') páginas en $OUT"
