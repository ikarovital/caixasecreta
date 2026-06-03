@echo off

chcp 65001 >nul

cd /d "%~dp0"

echo Exportando catálogo completo para Excel...

pip install openpyxl -q

python scripts\exportar_catalogo_planilha.py

echo.

echo Planilha em: dados\catalogo_produtos.xlsx

pause

