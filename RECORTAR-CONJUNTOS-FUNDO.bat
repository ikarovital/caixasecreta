@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo [1/2] Recortando foto do produto (sem texto do catalogo)...
python scripts/recortar_foto_produto_pdf.py --slug conjuntos
echo.
echo [2/2] Removendo fundo e aplicando branco (pode demorar)...
python scripts/recortar_humanos_sem_fundo.py --slug conjuntos
echo.
echo Pronto. Recarregue /conjuntos no site.
pause
