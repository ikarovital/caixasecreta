@echo off
chcp 65001 >nul
cd /d "%~dp0"
python scripts/recortar_foto_produto_pdf.py --slug calcinhas
python scripts/gerar_catalogo_frontend.py
echo.
echo Pronto. Recarregue o site em /calcinhas
pause
