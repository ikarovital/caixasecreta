@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Melhorando imagens importadas (VTEX 1200px)...
python scripts\melhorar_imagens_importadas.py
echo.
echo Regenerando catalogo...
python scripts\gerar_catalogo_frontend.py
pause
