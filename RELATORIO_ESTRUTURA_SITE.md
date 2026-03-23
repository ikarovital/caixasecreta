# Relatório de Estrutura do Site — Caixa Secreta

**Loja online:** Caixa Secreta — produtos íntimos e sensuais  
**Contato:** WhatsApp (11) 91853-5361  
**Última atualização:** fevereiro de 2025  

---

## 1. Visão geral

O site é um **e-commerce estático** (HTML, CSS e JavaScript) com catálogo de produtos, carrinho, cálculo de frete por CEP, desconto de 5% no Pix e finalização do pedido via WhatsApp. Há integração com uma **planilha Excel** para atualizar produtos (id, nome, preço, categoria, imagens) e automação para gerar os dados do site a partir dessa planilha.

---

## 2. Estrutura de pastas e arquivos

```
caixasecreta/
├── index.html              # Página principal (catálogo, carrinho, promo, frete)
├── termos.html             # Página de Termos e Condições
├── style.css               # Estilos globais (tema claro, premium)
├── script.js               # Lógica: produtos, carrinho, frete, modal, planilha
├── package.json            # Scripts npm (atualizar-produtos, watch-planilha)
├── package-lock.json
├── RELATORIO_ESTRUTURA_SITE.md   # Este relatório
│
├── dados/
│   └── produtos.json       # Produtos gerados a partir da planilha (fonte secundária)
│
├── imagens/                # Assets visuais
│   ├── logo.jpg            # Logo no header
│   ├── banner.png          # Banner principal
│   ├── docs/
│   │   ├── Planilha_Produtos.xlsx   # Planilha de produtos (id, nome, preço, etc.)
│   │   └── LEIA-ME_Planilha_Produtos.txt
│   ├── Vibradores/         # Fotos dos vibradores
│   ├── Lingerie/           # Fotos de lingerie (alguns com frente e costas)
│   ├── Comesticos/
│   ├── Fetiche_Sado/
│   └── promocao relampago/  # Imagens da promoção relâmpago (opcional)
│
├── scripts/                # Automação Node.js
│   ├── planilha-to-json.js # Lê Planilha_Produtos.xlsx → dados/produtos.json
│   └── watch-planilha.js   # Observa a planilha e regera o JSON ao salvar
│
├── .github/
│   └── workflows/
│       └── atualizar-produtos.yml   # GitHub Action: ao subir planilha, gera produtos.json
│
└── node_modules/           # Dependências (xlsx, etc.)
```

---

## 3. Páginas

### 3.1 index.html (Página principal)

- **Título:** Caixa Secreta – Descubra seu desejo oculto  
- **Fontes:** Cormorant Garamond, Great Vibes, Montserrat, Nunito, Outfit (Google Fonts)  
- **Seções (em ordem):**

| Seção | ID | Descrição |
|-------|-----|-----------|
| Header | — | Logo, slogan, menu (Promoção Relâmpago, Ofertas, Carrinho, Frete, Lançamento, Termos) |
| Banner | `#inicio` | Imagem full-width (banner.png) |
| Promoção Relâmpago | `#promo-relampago` | Countdown, lista de produtos da promo, CTA WhatsApp |
| Ofertas (Catálogo) | `#catalogo` | Título dinâmico (ex.: “QUINTOU de ofertas”), abas de categoria, ordenação (Menor/Maior preço, Mais vendidos, etc.), grid de produtos |
| Carrinho | `#carrinho` | Lista de itens, subtotal, total, botão “Finalizar pedido” |
| Frete e Condições | `#frete` | Dois cards: Entrega (frete grátis SP ≥ R$ 120, prazo, embalagem discreta) e Pagamento (Pix 5%, cartão) |
| Lançamento | `#lancamento` | Texto sobre assinatura mensal em breve |
| Rodapé | — | WhatsApp, marca, link Termos e Condições |
| Modal Finalizar | `#modal-finalizar` | Nome, WhatsApp, CEP (ViaCEP), calcular frete, resumo (subtotal, frete, total com opção Pix 5%), forma de pagamento, “Confirmar e enviar para WhatsApp” |

### 3.2 termos.html

- **Título:** Termos e Condições — Caixa Secreta  
- Mesmo header/rodapé e estilo do site.  
- Conteúdo: 7 seções (Sobre a loja, Condições de venda, Formas de pagamento, Envio e entrega, Trocas e garantia, Privacidade, Contato WhatsApp).

---

## 4. Estrutura do CSS (style.css)

| Bloco | Função |
|-------|--------|
| `:root` | Variáveis (cores, fontes, raio, sombras): `--fundo`, `--roxo-medio`, `--fonte-logo-titulo`, etc. |
| Reset / body | Box-sizing, margens, scroll suave, fundo e tipografia base |
| Container | `.container` max-width 1100px, centralizado |
| **Header** | Sticky, logo (imagem + texto), nav, menu móvel (nav-toggle) |
| **Banner** | Largura total, `object-fit: contain`, overlay opcional |
| **Seções** | `.section`, `.section-title`, `.titulo-ofertas-dia` |
| **Promoção Relâmpago** | Cards, countdown, botão WhatsApp |
| **Catálogo** | Abas de categoria, ordenação (select), grid de produtos, cards (imagem única ou dupla frente/costas) |
| **Carrinho** | Lista de itens, resumo, botão finalizar |
| **Frete** | Grid de dois cards (Entrega, Pagamento) |
| **Lançamento** | Fundo em gradiente, texto centralizado |
| **Rodapé** | Links, WhatsApp, marca |
| **Modal Finalizar** | Overlay, formulário, resumo frete, radios Pix/Cartão |
| **Responsivo** | Media queries para mobile/tablet/desktop |

---

## 5. Estrutura do JavaScript (script.js)

### 5.1 Dados e constantes

- **PRODUTOS** — Array de produtos (id, nome, preco, imagem ou imagens[], categoria).  
- **PRODUTOS_PROMO** — Produtos da promoção relâmpago.  
- **PROMO_FIM** — Data/hora de fim da promo (countdown).  
- **WHATSAPP_NUMERO** — 5511918535361.  
- **Frete:** FRETE_MINIMO_GRATIS (120), FRETE_SP (15), FRETE_OUTROS (25), DESCONTO_PIX (0.05).

### 5.2 Estado (localStorage)

- `caixasecreta_carrinho` — Itens do carrinho.  
- `caixasecreta_ordenacao` — Ordenação escolhida (menor_preco, mais_vendidos, etc.).  
- `caixasecreta_procuras` — Contagem por id (para “Mais vendidos”).

### 5.3 Fluxos principais

1. **Inicialização**  
   - `carregarDadosPlanilha()` — Busca `dados/produtos.json` e mescla/atualiza PRODUTOS por id.  
   - `init()` — Atualiza título de ofertas, abas, ordenação, produtos, carrinho, promo, countdown.

2. **Catálogo**  
   - Abas por categoria (obterCategorias, renderizarAbas).  
   - Ordenação (ordenarProdutos: menor_preco, maior_preco, mais_vendidos, data_lancamento, melhor_desconto).  
   - Renderização dos cards (imagem única ou dupla), botão “Adicionar ao carrinho”.  
   - Incremento de “procuras” ao adicionar ao carrinho.

3. **Carrinho**  
   - Adicionar/remover/alterar quantidade, salvar no localStorage, renderizar lista e totais.  
   - Botão “Finalizar pedido” abre o modal.

4. **Modal Finalizar**  
   - Nome, WhatsApp, CEP; ViaCEP para endereço; cálculo de frete (SP/outros, grátis ≥ R$ 120).  
   - Resumo sempre visível: Subtotal, Frete, Total.  
   - Pix: total com 5% de desconto e atualização em tempo real ao trocar forma de pagamento.  
   - Montagem da mensagem para WhatsApp (itens, subtotal, frete, desconto Pix se aplicável, total, forma de pagamento) e abertura do link do WhatsApp.

5. **Promoção Relâmpago**  
   - Countdown (dias, horas, min, seg) até PROMO_FIM.  
   - Lista de PRODUTOS_PROMO; botão para adicionar ao carrinho ou falar no WhatsApp.

6. **Título de ofertas**  
   - Texto dinâmico por dia da semana (ex.: “QUINTOU de ofertas”).

---

## 6. Integração com a planilha

- **Arquivo:** `imagens/docs/Planilha_Produtos.xlsx`  
- **Colunas:** id, nome, preço (ou “Preço”), categoria, imagem, imagem_costa.  
- **Geração do JSON:** `npm run atualizar-produtos` → lê a planilha e gera `dados/produtos.json`.  
- **No site:** Ao carregar a página, o script faz `fetch('dados/produtos.json')` e, por id, atualiza ou adiciona itens em PRODUTOS (nome, preço, categoria, imagens).  
- **Automação:**  
  - **Local:** `npm run watch-planilha` — observa a planilha e regera o JSON ao salvar.  
  - **GitHub:** workflow `atualizar-produtos.yml` — em push em `imagens/docs/` (ou execução manual), gera `produtos.json` e faz commit/push.

---

## 7. Regras de negócio resumidas

- **Frete:** Compras ≥ R$ 120 em SP = grátis; caso contrário SP R$ 15, demais R$ 25.  
- **Pix:** 5% de desconto sobre (subtotal + frete); total exibido e enviado no WhatsApp já com desconto.  
- **Produtos:** Podem ter `imagem` (uma) ou `imagens` (frente e costas, ex.: lingerie).  
- **Ordenação:** Menor preço, Maior preço, Mais vendidos (por “procuras”), Data de lançamento, Melhor desconto.

---

## 8. Tecnologias

- **Front-end:** HTML5, CSS3, JavaScript (ES5-style no script principal).  
- **Fontes:** Google Fonts.  
- **APIs:** ViaCEP (consulta CEP).  
- **Build/automação:** Node.js, npm, xlsx; GitHub Actions.

Este documento descreve a estrutura atual do site Caixa Secreta para uso interno e manutenção.
