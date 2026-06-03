@echo off

chcp 65001 >nul

cd /d "%~dp0"

echo Importando planilha e atualizando catálogo JSON...

pip install openpyxl -q

python scripts\importar_catalogo_planilha.py

echo.

pause

