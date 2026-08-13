#!/usr/bin/env bash
#
# export.sh — export the QPD project for the texpage platform.
#
# Usage:
#   ./export.sh          # LaTeX sources + assets + infra -> export/
#   ./export.sh --web    # web assets (JSON + per-problem PDFs) -> web/
#
set -euo pipefail

# Resolve the directory this script lives in (so it works from anywhere).
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ---- web mode ----
if [[ "${1:-}" == "--web" ]]; then
  exec python3 "$ROOT/export_web.py"
fi

DEST="$ROOT/export"

echo "Exporting QPD project -> $DEST"

# Start fresh.
rm -rf "$DEST"
mkdir -p "$DEST"

# ---- 1. Infrastructure (classes, package, boilerplate, template) ----
for f in \
    QPDBooklet.cls \
    QPDSingle.cls \
    qpd-common.sty \
    qpd-bootstrap.tex \
    qpd-end.tex \
    TEMPLATE.tex \
    main.tex \
; do
    [ -f "$ROOT/$f" ] && cp "$ROOT/$f" "$DEST/"
done

# ---- 2. Problem files (YYYYMMDD.tex) ----
# Copy every .tex file whose name is exactly 8 digits (a problem ID).
for f in "$ROOT"/*.tex; do
    base="$(basename "$f")"
    name="${base%.tex}"
    if [[ "$name" =~ ^[0-9]{8}$ ]]; then
        cp "$f" "$DEST/"
    fi
done

# ---- 3. Assets (images referenced by problems) ----
if [ -d "$ROOT/assets" ]; then
    cp -R "$ROOT/assets" "$DEST/assets"
fi

# ---- 4. Docs (optional, but handy for contributors) ----
for f in README.md; do
    [ -f "$ROOT/$f" ] && cp "$ROOT/$f" "$DEST/"
done

echo "Done. Files in $DEST:"
ls -1 "$DEST"
