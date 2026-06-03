@echo off
cd /d "%~dp0"
echo Importando catalogo completo (planilha + imagens)...
python scripts/importar_catalogo_caixa_secreta.py
if errorlevel 1 pause
echo.
echo Concluido. Recarregue o site com Ctrl+F5.
pause
