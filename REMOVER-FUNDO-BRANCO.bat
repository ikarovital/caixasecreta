@echo off
chcp 65001 >nul
cd /d "%~dp0"
python scripts/remover_fundo_branco_importados.py
echo.
echo Pronto. Recarregue o site.
pause
