@echo off

chcp 65001 >nul

cd /d "%~dp0"

echo Importando Vibradores, Acessorios, Cosmeticos e Fetiche e Sado (catalogo externo)...

echo Mantem comestiveis e PDF intactos. 4 paginas x 24 produtos por categoria.

pip install pillow -q

python scripts\importar_miess_lote.py

echo.

echo Pronto! Execute VER-SITE-NOVO.bat

pause

