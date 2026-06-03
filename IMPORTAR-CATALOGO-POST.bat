@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Importando planilha Post + imagens (fundo transparente)...
python scripts/importar_catalogo_post.py
echo.
echo Concluido. Recarregue o site (VER-SITE-NOVO.bat).
pause
