# Relatório PWA — Clube Caixa Secreta

Data: junho/2026

---

## 1. Análise inicial do projeto

| Item | Resultado |
|------|-----------|
| **Vite** | `^5.4.20` (lock: 5.4.21) |
| **React Router** | `react-router-dom` v7 — `BrowserRouter` em `frontend/src/pages/App.jsx`, rotas `/`, `/busca`, `/carrinho`, `/conta`, `/termos`, `/:categorySlug`, redirects `/fetiche-sado`, `/sex-shop` |
| **Deploy** | GitHub Actions → `frontend/dist` + `CNAME` (`clubecaixasecreta.com.br`) + `404.html` = cópia do `index.html` (SPA) |
| **Base URL produção** | `/` (sem `base` no Vite — domínio próprio na raiz) |
| **PWA pré-existente** | Nenhum (`manifest`, Workbox, service worker ou `vite-plugin-pwa` ausentes) |
| **Logo oficial** | `frontend/public/imagens/logo.jpg` (fonte dos ícones PWA) |
| **Cores identidade** | `theme_color`: `#6C2BD9` (purpleGlow-500); `background_color`: `#0D0618` (brand-950) |

**Checkout / WhatsApp:** links externos `https://wa.me/...` via `window.open` — fora do scope do SW; não cacheados.

**API frete:** `/api/frete` só no dev (plugin Vite); em produção (Pages) não existe — incluída em `navigateFallbackDenylist`.

---

## 2. Arquivos criados

| Arquivo |
|---------|
| `frontend/pwa.config.js` |
| `frontend/scripts/generate-pwa-icons.mjs` |
| `frontend/public/icons/icon-192.png` |
| `frontend/public/icons/icon-512.png` |
| `frontend/public/icons/apple-touch-icon.png` |
| `frontend/public/icons/icon-512-maskable.png` |
| `docs/relatorio-pwa.md` |

---

## 3. Arquivos alterados

| Arquivo |
|---------|
| `frontend/vite.config.js` — plugin PWA (extensão, sem remover plugins existentes) |
| `frontend/index.html` — meta PWA + links de ícones |
| `frontend/package.json` — scripts `pwa:icons`, `prebuild`; dependências |
| `frontend/package-lock.json` |

**Não alterados:** carrinho, checkout, catálogo, frete, workflows de deploy, `404.html`, rotas.

---

## 4. Dependências adicionadas (dev)

| Pacote | Uso |
|--------|-----|
| `vite-plugin-pwa` ^0.21.2 | Manifest + Workbox + registro SW em produção |
| `sharp` ^0.34.5 | Geração de ícones a partir do logo (script `prebuild`) |

---

## 5. Resultado dos testes

```
14/14 testes Vitest — OK
```

---

## 6. Resultado do build

```
dist/manifest.webmanifest
dist/sw.js
dist/workbox-*.js
dist/registerSW.js
Precache: 9 entradas (~378 KiB)
```

Sem precache de `importados/` nem `imagens/` do catálogo.

---

## 7. Status da validação PWA

| Critério | Status |
|----------|--------|
| Manifest no build | OK |
| SW gerado e referenciado em `index.html` | OK (`registerSW.js`) |
| Ícones 192 / 512 / maskable / apple-touch | OK |
| SW desligado em `vite dev` | OK (`devOptions.enabled: false`) |
| Apenas GET em runtime cache | OK |
| Lighthouse no CI | Não executado — validar no celular após deploy |

---

## 8. Estratégia de cache

| Tipo | Estratégia | Cache |
|------|------------|--------|
| JS/CSS/fontes (build) | Precache + Cache First (runtime) | `ccs-static-v1` |
| Navegação SPA | Navigation fallback + Stale While Revalidate | `ccs-pages-v1` |
| Imagens `/importados/`, `/imagens/` | Network First | `ccs-images-v1` |
| Precache build | Cache First (Workbox precache) | `workbox-precache-v2-*` (gerido pelo Workbox) |

---

## 9. Rotas/endpoints excluídos do cache

- `/api/*` — denylist navegação + sem runtime rule
- `/extracao_pdf/*` — denylist
- `POST`, `PUT`, `PATCH`, `DELETE` — sem regras (apenas GET)
- `https://wa.me/*`, `https://viacep.com.br/*` — externos, fora do scope
- JSON de catálogo — embutido no bundle JS, não precacheado separado
- Checkout / localStorage — não passam pelo SW

---

## 10. Limites de cache (imagens)

| Parâmetro | Valor |
|-----------|--------|
| `maxEntries` | 120 imagens |
| `maxAgeSeconds` | 14 dias |
| `networkTimeoutSeconds` | 10 s |
| Precache catálogo | **Não** — `globIgnores` em `importados/**`, `imagens/**` |

---

## 11. Nomes dos caches

- `ccs-static-v1`
- `ccs-pages-v1`
- `ccs-images-v1`
- Precache Workbox (hash no nome, ex. `workbox-precache-v2-...`)

---

## 12. Versionamento / invalidação

- `registerType: 'autoUpdate'` + `skipWaiting` + `clientsClaim`
- `cleanupOutdatedCaches: true`
- Novo deploy → novo `sw.js` com revisões de precache → SW atualiza na próxima visita/recarga
- Bump sufixo `v1` → `v2` nos nomes em `pwa.config.js` se mudar estratégia manualmente

---

## 13. Tamanho aproximado precache

~**378 KiB** (9 arquivos: HTML, JS, CSS, 4 ícones, manifest, registerSW).

---

## 14. Instalar no Android (Chrome / Samsung Internet)

1. Abra https://clubecaixasecreta.com.br/ (HTTPS obrigatório).
2. Menu (⋮) → **Instalar app** ou **Adicionar à tela inicial**.
3. Confirme o nome **Caixa Secreta**.

Requisitos: manifest válido + SW ativo + ícones — atendidos após deploy em produção.

---

## 15. Instalar no iPhone (Safari)

1. Abra o site no **Safari** (não Chrome iOS para “Adicionar à Tela de Início” completo).
2. Compartilhar → **Adicionar à Tela de Início**.
3. Nome: **Caixa Secreta**.

iOS não mostra o mesmo prompt “Instalar” do Android; comportamento nativo via atalho standalone.

---

## 16. Validar após novo deploy

1. Abra o site → DevTools → Application → Service Workers (ou Safari Web Inspector).
2. Confirme SW ativo e manifest carregado.
3. Faça um deploy novo; recarregue o site 1–2 vezes — versão nova sem limpar cache manual.
4. Teste `/lingeries` → F5 (refresh em rota interna).
5. Carrinho → checkout → **Confirmar no WhatsApp** (deve abrir `wa.me`).

**Teste PWA local (opcional):** `npm run build && npm run preview` → http://localhost:4173 (SW ativo no preview de produção).

---

## 17. Limitações e riscos

- **iOS:** sem push; cache mais restrito; atualização do SW pode exigir fechar abas do app.
- **Catálogo grande:** imagens só entram no cache sob demanda (máx. 120 entradas).
- **Sem página offline customizada** — navegação offline limitada ao precache (~378 KiB).
- **GitHub Pages:** mantido; `base` continua `/`.
- **Ícones:** gerados no `prebuild` — alterar logo exige `npm run pwa:icons` ou rebuild.
- **Sem popup de instalação** — apenas prompt nativo do navegador.

---

## Instalação após publicar

Quando o workflow **Deploy frontend (GitHub Pages)** terminar verde no commit com PWA, você já pode instalar no celular (aguarde ~3–5 min e use aba anônima na primeira vez).
