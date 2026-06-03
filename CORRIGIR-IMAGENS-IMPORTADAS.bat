 @echo off
 chcp 65001 >nul
 cd /d "%~dp0"
 echo Corrigindo imagens importadas (fundo branco)...
 python scripts\corrigir_imagens_importadas_fundo_branco.py
 echo.
 echo OK. Reabra o site (F5).
 pause
