# Conceito de testes e segurança — Clube Caixa Secreta

## Escopo do site

Catálogo vitrine + carrinho local + checkout via WhatsApp (sem pagamento online nem API de pedidos).

---

## 1. Análise de segurança (resumo)

| Área | Risco | Situação |
|------|--------|----------|
| XSS (HTML injetado) | Baixo | React escapa texto; sem `dangerouslySetInnerHTML` |
| Manipulação de preço no carrinho | **Médio** → mitigado | Preços revalidados pelo catálogo em `cart-security.js` |
| Conta / pontos no `localStorage` | Médio (aceitável em demo) | Sem servidor; pontos desligados (`PONTOS_ATIVO = false`) |
| API `/api/frete` | Baixo | Só GET; CEP 8 dígitos; peso limitado |
| Arquivos `/extracao_pdf` | Baixo | Bloqueio de `..` e path absoluto |
| Busca `?q=` | Baixo | Query sanitizada e limitada a 80 caracteres |
| WhatsApp | Baixo | `encodeURIComponent` + limite de mensagem |

### Correções aplicadas

- Carrinho sincronizado com produtos **publicados** (preço/nome do JSON, não do `localStorage`).
- Checkout recalcula subtotal e valida itens antes do WhatsApp.
- Campos nome, cupom e busca sanitizados (tamanho + caracteres de controle).
- API de frete: validação de CEP origem, peso e resposta 405 em JSON.
- Testes automatizados (`npm test` no `frontend/`).

### Limitações (produção futura)

- Pedido não é gravado em servidor; confirmação é manual no WhatsApp.
- Com pontos ativos, será necessário backend para validar saldo.
- HTTPS e headers de segurança no host de produção (nginx/Vercel).

---

## 2. Fluxos críticos (checklist manual)

### Navegação

- [ ] Home carrega categorias do menu
- [ ] Cada `/categoria` lista só produtos publicados
- [ ] `/busca?q=` retorna resultados coerentes
- [ ] Rotas inexistentes voltam para `/`
- [ ] Atalhos `/sex-shop` → comestíveis, `/fetiche-sado` → sado

### Produto

- [ ] Card mostra foto, preço, tamanho/cores na descrição
- [ ] Lingeries/calcinhas/espartilhos: frente e verso quando existir
- [ ] Adicionar ao carrinho exibe toast

### Carrinho (`/carrinho`)

- [ ] Alterar quantidade (1–99)
- [ ] Remover item
- [ ] Subtotal = soma preço × quantidade do catálogo

### Checkout

- [ ] CEP 8 dígitos obrigatório
- [ ] Calcular frete (regiões SP + litoral/ABC)
- [ ] Frete grátis SP ≥ R$ 120
- [ ] Pix aplica desconto configurado
- [ ] Confirmar abre WhatsApp com resumo legível
- [ ] Carrinho adulterado no DevTools não reduz preço no pedido

### Conta (`/conta`)

- [ ] Cadastro com nome + WhatsApp
- [ ] Histórico local de pedidos (se usado)

---

Antes do push para o GitHub, use também: [checklist-pre-push-github.md](./checklist-pre-push-github.md).

---

## 3. Testes automatizados

```bash
cd frontend
npm install
npm test
```

| Arquivo | O que valida |
|---------|----------------|
| `src/lib/cart-security.test.js` | Quantidade, carrinho falso, sanitização |
| `src/lib/checkout-message.test.js` | Totais, Pix, desconto de pontos |

### Próximos testes sugeridos

- E2E com Playwright: fluxo carrinho → frete → WhatsApp (mock `window.open`)
- Snapshot do `catalogProducts.length` após importação
- Teste de `publishedProducts` não listar `published: false`

---

## 4. Regressão após importar planilha

1. `IMPORTAR-CATALOGO-CAIXA-SECRETA.bat`
2. `npm test`
3. Checklist seção 2 no celular (`http://IP:5173`)
4. Ctrl+F5 (cache de imagens `v=` em `catalog-ui.js`)

---

## 5. Classificação de severidade (uso interno)

- **Crítico**: pagamento ou PII exposto — não aplicável (sem gateway).
- **Alto**: preço manipulável no pedido — **mitigado** no cliente.
- **Médio**: conta/pontos falsos no `localStorage` — aceito até haver API.
- **Baixo**: abuso de cotação de frete — limitado por peso/CEP.

Documento vivo: atualizar quando houver backend ou login real.
