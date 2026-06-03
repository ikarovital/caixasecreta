@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Recortando fotos com modelos (sem fundo)...
python scripts\recortar_humanos_sem_fundo.py
echo.
echo OK. Recarregue o site (F5).
pause

