@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Gerando PDF do catálogo (visual do site + dados da planilha)...
echo   Textos e preços: Catalogo_ClubeCaixaSecreta.xlsx
echo   Imagens: pasta do site, ou foto embutida na planilha
echo.

python scripts\gerar_pdf_catalogo_planilha.py --xlsx "%USERPROFILE%\post\Catalogo_ClubeCaixaSecreta.xlsx"

echo.
echo PDF em: dados\catalogo_clube_caixa_secreta.pdf
pause
