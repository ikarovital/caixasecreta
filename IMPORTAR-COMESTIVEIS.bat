@echo off

chcp 65001 >nul

cd /d "%~dp0"

echo Importando comestiveis - paginas 1 a 4 (mais vendidos) + fundo transparente...

pip install pillow -q

python scripts\importar_miess.py --slug comestiveis --path sex-shop/comestiveis --titulo "Comestíveis" --paginas 4 --por-pagina 24

echo.

echo Pronto! Execute VER-SITE-NOVO.bat e abra http://localhost:5173/comestiveis

pause

