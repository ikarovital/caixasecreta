@echo off
cd /d "%~dp0"
echo Importando calcinhas, lingeries e espartilhos...
python scripts/importar_catalogo_caixa_secreta.py
if errorlevel 1 pause
echo.
echo Concluido. Recarregue o site com Ctrl+F5.
pause
