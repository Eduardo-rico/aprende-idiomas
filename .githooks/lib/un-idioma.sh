#!/bin/sh
# Rechaza un commit que lleva DATOS de dos lenguas a la vez.
#
# POR QUÉ (2026-09-24): el índice de git es COMPARTIDO entre las sesiones
# que trabajan en paralelo (una por lengua). Tres veces un commit se ha
# llevado ficheros que OTRA sesión tenía preparados: el último, contenido
# del ruso dentro de un commit del latín (`ebd7a056`), con el mensaje del
# ruso huérfano en un commit vacío. No se pierde contenido, pero la
# autoría y el razonamiento quedan en el sitio equivocado.
#
# El aviso escrito en el hook no bastó: se lee cuando el commit FALLA, y
# el barrido ocurre en uno que PASA. Esto lo para en el momento.
#
# La señal es barata y casi sin falsos positivos: cada sesión escribe en
# `lib/data/languages/<su lengua>/`. Un commit que toca dos de esos
# directorios es, salvo que se diga lo contrario, un barrido.
# Para un commit legítimamente multilengua: ORQUESTA_MULTILENGUA=1.
[ "${ORQUESTA_MULTILENGUA:-}" = "1" ] && exit 0
lenguas=$(git diff --cached --name-only | sed -n 's|^lib/data/languages/\([a-z]*\)/.*|\1|p' | sort -u)
n=$(printf '%s\n' "$lenguas" | grep -c .)
if [ "$n" -gt 1 ]; then
  echo ""
  echo "──────────────────────────────────────────────────────────────"
  echo "  ⛔ Este commit lleva datos de $n lenguas: $(echo $lenguas | tr ' ' ',')"
  echo "     Casi seguro es un BARRIDO del índice compartido: ficheros"
  echo "     que otra sesión dejó preparados y que tu commit arrastra."
  echo ""
  git diff --cached --name-only | grep '^lib/data/languages/' | sed 's/^/       /'
  echo ""
  echo "     Commitea sólo tus rutas: git commit -m '…' -- <tus rutas>"
  echo "     Si de verdad es multilengua: ORQUESTA_MULTILENGUA=1 git commit …"
  echo "──────────────────────────────────────────────────────────────"
  exit 1
fi
exit 0
