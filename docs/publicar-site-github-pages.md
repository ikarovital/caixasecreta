# Publicar o site novo (GitHub Pages)

## Uma vez no GitHub (obrigatório)

1. Abra https://github.com/ikarovital/caixasecreta/settings/pages
2. **Build and deployment** → **Source:** **GitHub Actions** (não “Deploy from a branch”)
3. Salve

Sem isso, o workflow roda mas o domínio não troca para o React.

## Automático

Cada push em `main` que altere `frontend/` dispara **Deploy frontend (GitHub Pages)**.

## Manual

**Actions** → **Deploy frontend (GitHub Pages)** → **Run workflow**

## URLs

- Site: https://clubecaixasecreta.com.br (após DNS + deploy)
- Status do deploy: https://github.com/ikarovital/caixasecreta/actions

Deploy leva ~2–5 min (build + testes + upload).
