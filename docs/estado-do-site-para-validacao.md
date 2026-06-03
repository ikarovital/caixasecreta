# Clube Caixa Secreta — Estado do site (documento para validação)

> **Data de referência:** maio/2026  
> **Objetivo:** descrever o que existe hoje no projeto para que outro GPT (ou revisor) valide se os pontos prometidos estão implementados, o que falta e o que é só preview local.

---

## 1. Visão geral

Existem **duas versões** do site no mesmo repositório:

| Versão | Pasta / arquivos | Status |
|--------|------------------|--------|
| **Site antigo (produção atual)** | `index.html`, `script.js`, `style.css`, `carrinho.html`, `termos.html` na raiz | Publicado / em uso |
| **Site novo (preview local)** | `frontend/` — React 18 + Vite 5 + Tailwind | **Não publicado** — só `localhost:5173` |

O trabalho recente concentra-se no **site novo** em `frontend/`.  
Marca exibida no novo site: **Clube Caixa Secreta** (logo + texto “CLUBE / Caixa Secreta”).

**WhatsApp da loja:** `5511918535361` (constante `WHATSAPP_PHONE` em `frontend/src/data/catalog.js`).

---

## 2. Como rodar o site novo (preview)

```bat
VER-SITE-NOVO.bat
```

- Instala dependências se necessário (`npm install` em `frontend/`)
- Sobe Vite em `http://localhost:5173/` com `--host` (acessível no celular na mesma Wi‑Fi, ex.: `http://192.168.0.6:5173/`)

**Atualizar catálogo PDF:**

```bat
ATUALIZAR-CATALOGO.bat
```

- Roda `scripts/extrair_pdfs_catalogo.py` + `scripts/gerar_catalogo_frontend.py`
- Gera `frontend/src/data/catalogo-lingerie.json`

**Importar categorias Miess:**

```bat
IMPORTAR-MIESS-CATEGORIAS.bat
```

- Roda `scripts/importar_miess_lote.py`
- Atualiza `frontend/src/data/catalogo-importado.json` (comestíveis, vibradores, acessórios, cosméticos, fetiche/sado)

---

## 3. Stack técnica (site novo)

- **React 18** + **React Router 7**
- **Vite 5** (dev server porta 5173)
- **Tailwind CSS 3** — tema escuro roxo/rosa (`brand-950`, `purpleGlow-500`)
- **Lucide React** (ícones)
- **Sem backend real** — carrinho, conta e pontos usam `localStorage` no navegador
- **API de frete** — plugin Vite em dev (`/api/frete`) que consulta Correios; fallback regional se API falhar
- **ViaCEP** — consulta endereço por CEP no checkout

---

## 4. Rotas e páginas

| Rota | Página | Função |
|------|--------|--------|
| `/` | HomePage | Hero, Flash Sale, grid de categorias, FAQ, blocos de confiança |
| `/:categorySlug` | CategoryPage | Listagem de produtos por categoria + ordenação |
| `/busca?q=...` | SearchPage | Busca por nome ou ref |
| `/carrinho` | CartPage | Carrinho + formulário de checkout |
| `/conta` | AccountPage | Cadastro/login, saldo de pontos, histórico de pedidos |
| `/termos` | TermsPage | Termos e condições (conteúdo adulto, frete, troca, etc.) |
| `/fetiche-sado` | — | Redireciona para `/sado` |
| `*` | — | Redireciona para `/` |

**Categorias ativas (10):**

1. `/calcinhas`
2. `/conjuntos`
3. `/espartilhos`
4. `/fantasias`
5. `/comestiveis`
6. `/cosmeticos`
7. `/vibradores`
8. `/acessorios`
9. `/sex-shop`
10. `/sado` (menu: “Fetiche e Sado”)

**Menu lateral** (`Sidebar.jsx`):

- Início, Ofertas (`/#ofertas`), Carrinho, todas as categorias, Termos
- **Desktop:** barra fixa à esquerda
- **Mobile:** gaveta (botão ☰ no header)

---

## 5. Layout e UI

### Header (`Header.jsx`)

- Faixa superior roxa: “Frete grátis SP acima de R$120 · 10 pts por real” (quando campanha ativa)
- Linha principal: menu mobile · logo (só mobile) · busca central · ícones conta + carrinho (com badges)
- **Não exibe** contagem total de produtos (removido a pedido)

### Sidebar (`Sidebar.jsx`)

- Logo + nome da marca
- Links verticais com destaque roxo no item ativo

### Home (`HomePage.jsx`)

- Badge “Catálogo Clube Caixa Secreta” (sem número de produtos)
- Banner/hero com imagem
- **Flash Sale** (`FlashSaleSection.jsx`) — tema escuro glass, countdown até fim do dia, produtos em destaque
- Cards de categorias **sem** chips “X produtos / X com foto”
- Seção “Compre com segurança” (entrega discreta, pagamento, envio, atendimento)
- FAQ

### Produtos (`ProductGrid.jsx`)

- Cards com foto (ou placeholder “Sem foto”)
- Chip de categoria + ref
- Preço, botão adicionar ao carrinho
- Clique expande card (des travamento e descrição)

### Footer (`Footer.jsx`)

- Links de categorias, WhatsApp, texto “Lingerie e produtos íntimos com discrição”
- **Sem** contagem de produtos

### Paleta

- Fundo: `#0D0618` (brand-950)
- Destaque: `#6C2BD9` (purpleGlow-500)
- Estilo: glass (`bg-white/5`, bordas `white/10`)

---

## 6. Catálogo de produtos

### Fontes de dados

| Arquivo | Origem | Produtos |
|---------|--------|----------|
| `catalogo-lingerie.json` | PDFs extraídos (`dados/extracao_pdf/`) | **456** |
| `catalogo-importado.json` | API VTEX Miess (`scripts/importar_miess.py`) | **479** |
| **Merge em `catalog.js`** | `[...lingerie, ...importado]` | **935** |

### Produtos por categoria (total no site)

| Categoria | PDF | Miess | **Total** |
|-----------|-----|-------|-----------|
| Calcinhas | 43 | — | **43** |
| Conjuntos | 30 | — | **30** |
| Espartilhos | 7 | — | **7** |
| Fantasias | 80 | — | **80** |
| Comestíveis | — | 96 | **96** |
| Cosméticos | — | 96 | **96** |
| Vibradores | 69 | 96 | **165** |
| Acessórios | — | 96 | **96** |
| Sex Shop | 169 | — | **169** |
| Fetiche e Sado | 58 | 95 | **153** |
| **TOTAL** | **456** | **479** | **935** |

**Com foto:** ~678 de 935. Muitos PDFs ficam sem foto por filtro de qualidade em `gerar_catalogo_frontend.py` (remove faixas do layout, fundos lisos, imagens compartilhadas entre produtos).

### PDFs processados (extração)

Conforme `dados/extracao_pdf/_resumo.json`:

- Calcinhas, Conjuntos, Espartilhos, Fantasias (catálogos lingerie)
- **SADO MARÇO 2026.pdf** → 58 produtos em `/sado`
- **SEX SHOP MAIO.JUNHO.2026.pdf** → 169 produtos
- **VIBRADORES MAIO. JUNHO 2026.pdf** → 69 produtos (+ 96 Miess na mesma categoria)

### Imagens — URLs

| Origem | Pasta física | URL no site |
|--------|--------------|-------------|
| PDF | `dados/extracao_pdf/` | `/extracao_pdf/...` (middleware Vite) |
| Miess | `frontend/public/importados/miess/{slug}/` | `/importados/miess/...` |
| Logo/banner | `imagens/` e `frontend/public/imagens/` | `/imagens/...` |

### Ordenação (`ProductSortSelect` + `sort-products.js`)

Opções estilo Miess:

- Menor preço / Maior preço
- Mais vendidos (padrão; usa `importRank` nos importados)
- Data de lançamento
- Melhor desconto

---

## 7. Carrinho

**Arquivo:** `CartContext.jsx` + `cart-storage.js`

- Adicionar/remover/alterar quantidade
- Persistência em `localStorage` (`caixasecreta_carrinho_v1`)
- Toast ao adicionar (`CartToast.jsx`)
- Badge no ícone do header
- Dados do cliente salvos para pré-preencher checkout (`caixasecreta_cliente_v1`)

**Fluxo:** adicionar produtos → `/carrinho` → checkout → WhatsApp

---

## 8. Checkout e pagamento

**Arquivo:** `CheckoutForm.jsx` (dentro de `CartPage.jsx`)

### Campos obrigatórios

- Nome completo
- WhatsApp
- CEP

### Frete

1. Usuário informa CEP e clica “Calcular frete”
2. ViaCEP busca cidade/UF
3. **Frete grátis:** subtotal ≥ **R$ 120** e destino **SP** (`FRETE_GRATIS_UF`)
4. Caso contrário: tenta `/api/frete` (Correios PAC/SEDEX via plugin Vite)
5. Se API falhar: estimativa por UF (`shipping-config.js`)

**CEP origem loja:** `01310100` (configurável em `shipping-config.js`)

### Formas de pagamento

- **Pix** — 5% de desconto (`PIX_DISCOUNT_PERCENT` em `promotions.js`)
- **Cartão** — preço cheio; parcelamento exibido nos cards de promo (10x)

### Finalização

- **Não há gateway de pagamento online**
- Ao confirmar: monta mensagem WhatsApp (`checkout-message.js`) e abre `wa.me/5511918535361`
- Status do pedido: `aguardando_whatsapp`
- Registra pedido e pontos na conta local

---

## 9. Programa de pontos / fidelidade

**Arquivos:** `points-config.js`, `customer-account.js`, `AccountPage.jsx`

### Regras configuradas

| Regra | Valor |
|-------|-------|
| Campanha ativa | Sim |
| Pontos por real (campanha) | **10 pts / R$ 1** |
| Fora de campanha | 1 pt / R$ 1 |
| Bônus 1ª compra | **+50 pts** |
| Cálculo | `Math.floor(totalPago × pontosPorReal)` + bônus |

### Conta do cliente

- Cadastro: nome, WhatsApp, CEP, e-mail (opcional)
- Login: só WhatsApp (busca cadastro existente)
- Dados em `localStorage`: `caixasecreta_clientes_v1`, sessão em `caixasecreta_sessao_v1`
- Página `/conta`: saldo, regra da campanha, exemplos (ex. R$ 300 = 3.000 pts), histórico de pedidos
- Pontos creditados **automaticamente ao finalizar checkout** (antes de abrir WhatsApp)
- Mensagem WhatsApp inclui pontos ganhos e saldo

### Limitações importantes (validar com o negócio)

- Pontos existem **só no navegador local** — não sincronizam entre dispositivos
- **Não há resgate de pontos** implementado (só acúmulo e exibição)
- **Não há validação humana** de pagamento antes de creditar pontos
- Não há painel admin

---

## 10. Promoções

**Flash Sale (`FlashSaleSection.jsx`):**

- Countdown até 23:59:59 do dia
- Escolhe produtos com desconto (`listPrice` > `price`) ou fallback comestíveis/com foto
- Exibe preço Pix (5% off), parcelamento, botão carrinho

**Desconto Pix:** 5% em todo o site (função `pixPrice`)

---

## 11. Termos e condições

- React: `/termos` (`TermsPage.jsx`)
- HTML legado: `termos.html` na raiz (site antigo)
- Cobre: +18, discrição, preços de referência, frete grátis SP, Pix 5%, troca/devolução, privacidade

---

## 12. Site antigo (produção) — o que ainda é diferente

O `index.html` na raiz **não** é o React. Características:

- HTML/CSS/JS estático
- Carrinho em `carrinho.html` separado
- Menu horizontal clássico (Promoção, Mais vendidos, Ofertas, Carrinho, Frete, Lançamento, Termos)
- **Não tem:** sidebar, programa de pontos, categorias dinâmicas do merge PDF+Miess, busca SPA, rotas React
- Título ainda “Caixa Secreta” (sem “Clube” no `<title>`)

**Decisão pendente:** publicar o `frontend/` build substituindo o site estático.

---

## 13. O que NÃO está implementado (gaps)

Use esta lista para validação crítica:

- [ ] Hospedagem / deploy do site novo
- [ ] Backend real (API, banco, auth segura)
- [ ] Pagamento online (Pix QR, cartão, Mercado Pago, etc.)
- [ ] Sincronização de pontos entre dispositivos
- [ ] Resgate/uso de pontos em compras
- [ ] Confirmação manual de pedido pago antes de pontos
- [ ] Painel administrativo
- [ ] Estoque / indisponibilidade de produto
- [ ] E-mail transacional
- [ ] Login com senha ou OAuth
- [ ] SEO completo / sitemap do SPA
- [ ] PWA / app instalável
- [ ] Analytics
- [ ] LGPD: banner de cookies, exclusão de dados centralizada
- [ ] Frete Correios em produção (plugin só no `vite dev`; build precisa de server ou função serverless)
- [ ] Todas as fotos dos PDFs (257 produtos sem imagem)

---

## 14. Checklist para o GPT validador

Peça ao GPT que responda **Sim / Parcial / Não** para cada item:

### Catálogo
1. 935 produtos carregados no frontend?
2. 10 categorias com páginas dedicadas?
3. Produtos SADO MARÇO 2026 (58) presentes em `/sado`?
4. Importação Miess (479) funcionando com imagens PNG?
5. Busca por nome/ref funciona?

### UX / navegação
6. Menu lateral no desktop e gaveta no mobile?
7. Contagem de produtos **oculta** na UI (header/footer/home)?
8. Flash Sale com countdown visível na home?
9. Ordenação estilo Miess nas categorias?

### Compra
10. Carrinho persiste ao recarregar?
11. Checkout exige nome, WhatsApp, CEP?
12. Frete grátis SP ≥ R$ 120 implementado?
13. Cálculo Correios (ou fallback) no dev?
14. Desconto Pix 5% aplicado no total?
15. Pedido finaliza abrindo WhatsApp com resumo?

### Fidelidade
16. Cadastro/login por WhatsApp?
17. 10 pts/R$ na campanha?
18. +50 pts na 1ª compra?
19. Saldo e histórico em `/conta`?
20. Pontos vão na mensagem WhatsApp?

### Legal / marca
21. Termos acessíveis em `/termos`?
22. Aviso +18 presente?
23. Marca “Clube Caixa Secreta” no site novo?

### Produção
24. Site novo já está no ar publicamente?
25. Site antigo e novo são a mesma experiência?

---

## 15. Estrutura de arquivos relevante

```
caixasecreta/
├── index.html, script.js, style.css    # Site antigo (produção)
├── carrinho.html, termos.html
├── VER-SITE-NOVO.bat
├── ATUALIZAR-CATALOGO.bat
├── IMPORTAR-MIESS-CATEGORIAS.bat
├── dados/extracao_pdf/                 # Extração PDF + imagens
├── scripts/
│   ├── gerar_catalogo_frontend.py
│   ├── extrair_pdfs_catalogo.py
│   ├── importar_miess.py
│   └── importar_miess_lote.py
└── frontend/
    ├── src/
    │   ├── pages/          # App, Home, Category, Cart, Account, Search, Terms
    │   ├── components/     # Header, Sidebar, Footer, ProductGrid, CheckoutForm, FlashSale...
    │   ├── context/        # CartContext, CustomerContext
    │   ├── data/           # catalog.js, catalogo-*.json, points-config, promotions
    │   └── lib/            # shipping, cart-storage, customer-account, sort-products...
    ├── server/             # frete-api-plugin.js, correios-frete.js
    └── public/imagens/     # Assets estáticos
```

---

## 16. Prompt sugerido para colar no GPT

```
Você é revisor de produto/e-commerce. Leia o documento "Estado do site Clube Caixa Secreta" abaixo e:

1. Preencha o checklist da seção 14 (Sim / Parcial / Não + observação).
2. Liste inconsistências entre o que o site promete (termos, faixa do header, pontos) e o que é tecnicamente possível hoje.
3. Aponte riscos legais/UX (pontos sem backend, checkout só WhatsApp, +18).
4. Diga o que falta para ir a produção com segurança.
5. Separe claramente "preview local" vs "site publicado".

[Cole aqui o conteúdo deste arquivo]
```

---

*Documento gerado a partir do código em `frontend/` e dos JSONs de catálogo em maio/2026.*
