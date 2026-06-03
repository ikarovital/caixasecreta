# Revisão de segurança (preview local)

Data: revisão estática do código — **não** é pentest profissional.

## Escopo

| Parte | URL / uso |
|-------|-----------|
| Site novo (React) | `http://localhost:5173/` — preview |
| Site antigo | `index.html` + `script.js` — produção GitHub Pages |
| Backend | **Não há** API própria; só arquivos estáticos + WhatsApp |

---

## Site novo (React / Vite)

### Pontos positivos

- Conteúdo do catálogo renderizado com **React (texto escapado)** — sem `dangerouslySetInnerHTML`.
- Link WhatsApp usa `encodeURIComponent` e `noopener,noreferrer`.
- Servidor de imagens `/extracao_pdf` bloqueia `..` e normaliza caminho (path traversal mitigado).

### Riscos (baixos no preview local)

| Risco | Nível | Nota |
|-------|--------|------|
| Servidor dev exposto na rede (`--host`) | Baixo (dev) | Qualquer um na mesma Wi‑Fi pode ver o preview. Não use em rede pública. |
| `server.fs.allow` abre pasta do projeto | Baixo (dev) | Só no `npm run dev`, não no build estático. |
| Dados do PDF no JSON | Baixo | Texto malicioso no PDF vira texto na tela; React não executa HTML. |
| Sem HTTPS no localhost | Info | Normal em desenvolvimento. |

### Produção (quando publicar o React)

- Publicar só a pasta `frontend/dist` (arquivos estáticos).
- Não subir `dados/extracao_pdf` inteiro se não for necessário; preferir imagens em `public/`.
- Cabeçalhos no host: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, HTTPS.

---

## Site antigo (`script.js`)

### Pontos positivos

- `escaparHtml()` em nomes e descrições nos cards.
- CEP: só dígitos (8) antes de chamar ViaCEP — reduz SSRF/absurdo na URL.
- Links WhatsApp com `rel="noopener"`.

### Riscos a tratar antes de escalar

| Risco | Nível | Recomendação |
|-------|--------|--------------|
| **XSS via `innerHTML`** | Médio | Vários trechos montam HTML com dados da planilha/JSON. Nomes/descrições estão escapados; revisar **selos, categorias, promo** e carrinho se algum campo novo não passar por `escaparHtml`. |
| **`urlImagem(src)`** | Médio | Se `imagem` no CSV for `javascript:...` ou URL externa maliciosa, o `<img src>` pode ser vetor. Validar: só caminhos relativos `imagens/...` ou HTTPS do seu domínio. |
| **localStorage** | Baixo | Carrinho e cadastro no navegador do cliente — não é segredo de servidor; risco é troca de dados só no próprio aparelho. |
| **Planilha/JSON como fonte** | Médio | Quem editar o CSV controla o que aparece no site. Proteger quem pode commitar no repositório. |
| **Dependência ViaCEP** | Baixo | Terceiro; CEP já sanitizado. |

---

## O que NÃO se aplica hoje

- SQL injection — sem banco.
- Login/sessão servidor — não implementado.
- Pagamento no site — redireciona para WhatsApp.

---

## Próximos passos (se quiser endurecer)

1. Site antigo: função `urlImagem` que rejeita tudo que não começa com `imagens/`.
2. Site antigo: preferir `textContent` / DOM em vez de `innerHTML` onde possível.
3. Publicação: HTTPS + CSP no GitHub Pages ou domínio próprio.
4. Pentest externo quando houver checkout/login/API.

---

*Gerado para o projeto Caixa Secreta — preview local.*
