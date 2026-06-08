#!/usr/bin/env bash
# scripts/with-env.sh — load .env.local into the current shell, then exec the given command.
# Uso: bash scripts/with-env.sh npm run generate:content -- --block 1
# Por qué: evita teclear `set -a; source .env.local; set +a` cada vez y previene que la
# API key quede en el historial del shell.
set -a
# shellcheck disable=SC1091
[ -f .env.local ] && source .env.local
set +a
exec "$@"
