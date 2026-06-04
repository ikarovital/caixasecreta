# Publicar o site novo (GitHub Pages)

## Uma vez no GitHub (obrigatório)

1. Abra https://github.com/ikarovital/caixasecreta/settings/pages
2. **Build and deployment** → **Source:** **GitHub Actions** (não “Deploy from a branch”)
3. Salve

Sem isso, o workflow roda mas o domínio não troca para o React.

## Automático

Cada push em `main` dispara **Deploy frontend (GitHub Pages)**.

O site HTML antigo ficou em `legado/` (fora da raiz) para o Pages não publicar `index.html` da raiz.

## Plano B (se o domínio ainda mostrar site antigo)

1. **Actions** → **Deploy gh-pages branch (plano B)** → **Run workflow**
2. **Settings → Pages** → **Deploy from a branch** → branch `gh-pages` → pasta `/ (root)`
3. Aguarde 2–5 min e teste o domínio em aba anônima

## Manual

**Actions** → **Deploy frontend (GitHub Pages)** → **Run workflow**

## URLs

- Site: https://clubecaixasecreta.com.br (após DNS + deploy)
- Status do deploy: https://github.com/ikarovital/caixasecreta/actions

Deploy leva ~2–5 min (build + testes + upload).
