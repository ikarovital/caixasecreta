# Checklist antes do push — [caixasecreta](https://github.com/ikarovital/caixasecreta)

Use este guia **antes** de `git push` para o repositório público. Objetivo: não vazar custos/planilhas internas, não subir lixo de build e garantir que o site novo funciona.

---

## 1. O que NUNCA deve ir para o Git

| Item | Motivo |
|------|--------|
| `node_modules/`, `frontend/dist/` | Gerados localmente; pesam e mudam sempre |
| `.env`, chaves API, tokens | Segredos |
| `dados/*.pdf` | Scripts leem **preço de custo** dos PDFs (`atualizar_precos_pdf.py`) |
| `dados/*.xlsx` (planilha mestre) | Controle interno de estoque/preço |
| `dados/extracao_pdf/`, `dados/historicos/` | Rascunhos e extrações grandes |
| Planilha em `C:\Users\...\post\` | Fica só no PC; import gera JSON no repo |

**No Git vão:** `frontend/src/data/*.json`, `frontend/public/importados/`, scripts `.py`, `.bat`, `docs/`.

**Não há banco de clientes no Git:** conta e pedidos ficam no `localStorage` do navegador de cada visitante.

---

## 2. Segurança do site (já no código)

| Controle | Onde |
|----------|------|
| Preço do carrinho = catálogo JSON | `frontend/src/lib/cart-security.js` |
| Checkout recalcula antes do WhatsApp | `CheckoutForm.jsx` + testes |
| Busca/nome/cupom sanitizados | `cart-security.js` |
| Frete SP: CEP validado, peso limitado | `shipping.js`, `frete-api-plugin.js` |
| `/extracao_pdf` bloqueia `..` | `frontend/vite.config.js` |
| Pontos / promo relâmpago desligados | `brand.js` |

### Testes automatizados (obrigatório antes do push)

```powershell
Set-Location frontend
npm install
npm test
```

Esperado: **14 testes** passando (4 arquivos).

Detalhes: [conceito-testes-seguranca.md](./conceito-testes-seguranca.md).

---

## 3. Verificação rápida no terminal

Na raiz do projeto (`caixasecreta`):

```powershell
# Arquivos que seriam commitados (revise a lista)
git status

# Confirme que PDFs/planilhas não aparecem
git status --short dados/

# Busca por padrões de segredo (deve retornar vazio ou só node_modules)
git grep -i "api_key\|secret\|password\|ghp_" -- . ":(exclude)frontend/node_modules" ":(exclude)node_modules"
```

Se `dados/*.pdf` ou `catalogo_produtos.xlsx` aparecerem como **untracked**, o `.gitignore` está correto — **não** use `git add dados/`.

---

## 4. O que commitar (site novo)

```text
frontend/                    # código React (sem node_modules e dist)
frontend/public/importados/  # fotos do catálogo
frontend/src/data/           # catalogo-lingerie.json, catalogo-importado.json
scripts/                     # importação e imagens
docs/                        # documentação
*.bat                        # atalhos Windows (opcional)
CNAME                        # clubecaixasecreta.com.br — manter na raiz
.github/workflows/           # CI (revisar se ainda usa site antigo)
```

### Site antigo na raiz

`index.html`, `script.js`, `style.css`, `carrinho.html` ainda estão no remoto. Após o push do `frontend/`, o **GitHub Pages** continua servindo a raiz até você configurar deploy do build (seção 6).

---

## 5. Checklist manual (5 minutos)

### Segurança e dados

- [ ] `.gitignore` atualizado (PDFs, xlsx, node_modules, dist)
- [ ] Nenhum `.env` ou token no diff
- [ ] Planilhas/PDFs de custo **fora** do `git add`
- [ ] JSON do catálogo só com preço de **venda** (`price`), sem coluna de custo

### Qualidade

- [ ] `npm test` no `frontend/` — 14/14 OK
- [ ] `VER-SITE-NOVO.bat` — home, categorias, detalhe com foto
- [ ] Carrinho: quantidade, subtotal correto
- [ ] Checkout: CEP SP calcula frete; fora da área mostra erro
- [ ] Confirmar pedido abre WhatsApp com texto legível
- [ ] DevTools: alterar preço no `localStorage` **não** reduz valor no pedido

### Repositório

- [ ] Mensagem de commit clara (ex.: `feat: site React + catálogo importado`)
- [ ] Push para `origin main` (ou branch de preview primeiro)
- [ ] Repo público OK? Scripts de precificação ficam visíveis — considere **privado** se quiser ocultar lógica de margem

---

## 6. GitHub Pages após o push

Hoje o Pages publica a **raiz** (site HTML antigo). O site novo precisa de **build**:

```powershell
Set-Location frontend
npm run build
```

Saída: `frontend/dist/`.

Opções:

1. **Workflow de deploy** (recomendado): Action que roda `npm ci && npm build` e publica `frontend/dist` + copia `CNAME`.
2. **Manual (temporário):** publicar conteúdo de `dist/` na branch `gh-pages` ou pasta configurada no Settings → Pages.

Domínio: `CNAME` → `clubecaixasecreta.com.br`. HTTPS vem do GitHub.

Workflow antigo `atualizar-produtos.yml` atualiza `dados/produtos.json` do site **antigo** quando muda `imagens/docs/Planilha_Produtos.xlsx`. Não substitui o frontend React — pode desativar ou adaptar depois.

---

## 7. Comandos sugeridos para o primeiro push grande

```powershell
Set-Location c:\Users\Ikaro\Desktop\caixasecreta

# Adicionar só o que importa (evita dados/ inteiro)
git add .gitignore CNAME docs/ frontend/ scripts/ *.bat
git add frontend/public/importados/

# Conferir o que entrou
git status
git diff --cached --stat

# Commit (ajuste a mensagem)
git commit -m "feat: frontend React, catálogo importado e endurecimento de segurança"

# Push (quando estiver satisfeito com o checklist)
git push origin main
```

Se já tiver alterações no site antigo (`index.html`, etc.), inclua só se quiser publicá-las: `git add index.html script.js style.css ...`

---

## 8. Depois do push

- [ ] Abrir https://github.com/ikarovital/caixasecreta e confirmar que **não** há PDFs/planilhas em `dados/`
- [ ] GitHub → Settings → Pages: origem correta para o site novo
- [ ] Testar https://clubecaixasecreta.com.br (ou URL `*.github.io`) em aba anônima
- [ ] Opcional: ativar **Dependabot** e **secret scanning** no repositório

---

## 9. Resumo

| Pergunta | Resposta |
|----------|----------|
| Push atualiza o site novo automaticamente? | Só após configurar deploy do `frontend/dist` |
| Imagens vão no Git? | Sim — `frontend/public/importados/` |
| Dados de clientes no Git? | Não — só no navegador |
| Repo pode ser público? | Sim; PDFs/planilhas de custo **não** entram no commit |
| Testes mínimos? | `cd frontend && npm test` |

Última revisão: junho/2026 — alinhado ao `.gitignore` e `cart-security.js`.
