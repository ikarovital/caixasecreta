@echo off
cd /d "%~dp0"
echo Importando calcinhas (planilha + fotos CALCINHA)...
python scripts/importar_lingerie_planilha.py --aba CALCINHA
if errorlevel 1 pause
echo.
echo Concluido. Recarregue o site com Ctrl+F5.
pause
