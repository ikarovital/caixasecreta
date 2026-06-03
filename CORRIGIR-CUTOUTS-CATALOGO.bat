@echo off
cd /d "%~dp0"
python scripts/corrigir_cutouts_catalogo.py --slug calcinhas --force-jpeg
python scripts/corrigir_cutouts_catalogo.py --slug fantasias --slug conjuntos --slug espartilhos
pause
