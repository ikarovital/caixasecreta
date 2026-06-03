@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Atualizando catalogo do site local...
pip install pymupdf pillow -q
python scripts\extrair_pdfs_catalogo.py --rebuild-csv
python scripts\gerar_catalogo_frontend.py
echo.
echo Pronto! Agora execute VER-SITE-NOVO.bat
pause
