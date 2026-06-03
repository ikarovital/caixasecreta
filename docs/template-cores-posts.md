# Template de cores — posts de produtos (Clube Caixa Secreta)

Guia para criar artes (Instagram, Stories, WhatsApp Status, etc.) na **mesma tonalidade** do site novo (`frontend/`) e da identidade roxa/rosa da marca.

---

## 1. Paleta principal (use estes códigos)

| Nome | HEX | RGB | Uso no post |
|------|-----|-----|-------------|
| **Fundo profundo** | `#0D0618` | 13, 6, 24 | Fundo principal, base escura |
| **Fundo médio** | `#130824` | 19, 8, 36 | Variação de fundo, faixas |
| **Fundo card** | `#1A0B2E` | 26, 11, 46 | Blocos, molduras, área do produto |
| **Fundo elevado** | `#220F3B` | 34, 15, 59 | Destaques, bordas internas |
| **Roxo marca (CTA)** | `#6C2BD9` | 108, 43, 217 | Botões, preço, selos, linhas de destaque |
| **Texto principal** | `#FFFFFF` | 255, 255, 255 | Títulos e nomes de produto |
| **Texto secundário** | `rgba(255,255,255,0.70)` | — | Descrição curta, subtítulo |
| **Texto suave** | `rgba(255,255,255,0.45)` | — | Rodapé, avisos, “a partir de” |
| **Borda / vidro** | `rgba(255,255,255,0.10)` | — | Contorno de cards, separadores |
| **Overlay vidro** | `rgba(255,255,255,0.05)` | — | Faixa semi-transparente sobre o fundo |

### Acentos opcionais (harmonia com banners e site antigo)

Use com moderação (10–20% da arte), para não competir com o roxo `#6C2BD9`:

| Nome | HEX | Uso |
|------|-----|-----|
| **Rosa destaque** | `#FF4D8D` | Selo “novo”, coração, detalhe sensual |
| **Rosa suave** | `#E8A0B8` | Brilho, glow suave em volta do produto |
| **Roxo claro (texto sobre roxo)** | `#F3E8FF` | Texto em faixas muito escuras, se precisar de mais contraste |

---

## 2. Gradientes prontos (copiar no Canva / Figma / Photoshop)

### Fundo padrão de post (feed 1:1 ou 4:5)

```
linear-gradient(145deg, #0D0618 0%, #1A0B2E 45%, #220F3B 100%)
```

### Fundo com “glow” roxo (hero / destaque)

```
radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,43,217,0.35) 0%, transparent 70%),
linear-gradient(180deg, #0D0618 0%, #1A0B2E 100%)
```

### Faixa de preço ou CTA

```
linear-gradient(90deg, #6C2BD9 0%, #5A189A 100%)
```

*(O `#5A189A` é o roxo escuro do site estático — combina com `#6C2BD9`.)*

### Glow atrás do produto (recorte PNG)

- Cor: `#6C2BD9`
- Opacidade: 25–40%
- Desfoque (blur): alto (80–120 px em 1080 px de largura)
- Modo de mesclagem: “Tela” ou “Screen” (se o app tiver)

---

## 3. Regras rápidas de composição

### Fundo

- **Sempre escuro** (`#0D0618` → `#1A0B2E`). Evite fundo branco ou cinza claro — quebra a identidade do clube.
- Produto em PNG: preferir **fundo transparente** sobre o gradiente escuro + glow roxo leve.

### Texto

| Elemento | Cor | Peso sugerido |
|----------|-----|----------------|
| Nome do produto | `#FFFFFF` | Bold / SemiBold |
| Preço | `#6C2BD9` ou `#FFFFFF` em caixa roxa | Bold |
| Descrição (1 linha) | branco 70% | Regular |
| Selo (“5% Pix”, “Frete grátis”) | fundo `rgba(255,255,255,0.05)` + borda 10% branco | Medium |

### Tipografia (alinhada ao site)

| Uso | Fonte | Onde baixar |
|-----|-------|-------------|
| Título do post | **Montserrat** 600–700 | [Google Fonts](https://fonts.google.com/specimen/Montserrat) |
| Texto corrido / preço pequeno | **Inter** 400–500 | [Google Fonts](https://fonts.google.com/specimen/Inter) |

Tamanhos de referência em **1080×1080 px**:

- Título: 56–72 px  
- Subtítulo: 32–40 px  
- Preço: 48–64 px  
- Selo/chip: 24–28 px  

### Botões e chips (visual do site)

- **Botão primário:** fundo `#6C2BD9`, texto `#FFFFFF`, cantos arredondados ~16–20 px  
- **Chip / selo:** fundo `rgba(255,255,255,0.05)`, borda `1px solid rgba(255,255,255,0.10)`, texto branco 80%

### Bordas e cantos

- Cards e molduras: raio **20 px** (proporcional: ~2% da largura da arte)  
- Sombra “glow” (opcional): contorno roxo suave — equivalente ao site:  
  `0 0 0 1px rgba(108,43,217,0.35), 0 10px 35px rgba(108,43,217,0.22)`

---

## 4. Formatos e áreas seguras

| Formato | Tamanho (px) | Observação |
|---------|----------------|------------|
| Feed quadrado | 1080 × 1080 | Padrão catálogo |
| Feed retrato | 1080 × 1350 | Mais destaque vertical |
| Stories / Reels capa | 1080 × 1920 | Deixar ~120 px livres no topo e embaixo (UI do app) |
| WhatsApp Status | 1080 × 1920 | Mesmo que Stories |

**Área segura:** mantenha logo, preço e nome do produto no **centro 80%** da arte.

---

## 5. Modelos de post (combinações aprovadas)

### A — Produto em destaque

1. Fundo: gradiente **§2 fundo padrão**  
2. Glow roxo atrás do produto  
3. Nome em branco (Montserrat Bold)  
4. Preço em caixa `#6C2BD9` ou texto roxo grande  
5. Chip opcional: “Entrega discreta” com estilo vidro (§3)

### B — Promo / oferta

1. Mesmo fundo escuro  
2. Faixa superior ou diagonal em `#6C2BD9` com texto branco  
3. Acento **rosa `#FF4D8D`** só no selo (“-10%”, “Novidade”)  
4. Não usar mais de 2 cores de destaque além do branco

### C — Carrossel (capa + slides)

- **Capa:** gradiente + título Montserrat + logo pequena  
- **Slides internos:** fundo `#1A0B2E` fixo em todos para consistência  
- Último slide: CTA “Chamar no WhatsApp” — pode usar verde WhatsApp `#25D366` **somente no botão**, não no fundo

---

## 6. O que evitar

- Fundo branco, bege ou cinza claro dominante  
- Roxo muito claro ou lavanda como fundo inteiro (perde o contraste premium)  
- Mais de 3 cores fortes na mesma arte (roxo + rosa + verde + amarelo)  
- Texto escuro (`#333`) sobre fundo escuro — ilegível  
- Gradientes neon fora da família roxa (`#6C2BD9` / `#1A0B2E`)

---

## 7. Lista para colar no Canva (Paleta da marca)

Crie uma paleta “Clube Caixa Secreta” com estes HEX:

```
0D0618
130824
1A0B2E
220F3B
6C2BD9
FFFFFF
FF4D8D
E8A0B8
F3E8FF
```

---

## 8. Referência técnica no código

Cores oficiais do site novo estão em:

- `frontend/tailwind.config.js` — `brand.*`, `purpleGlow.500`
- `frontend/src/styles.css` — botões, vidro (`glass`), chips

Ao atualizar o site, **atualize este documento** se os HEX mudarem.

---

## 9. Checklist antes de publicar

- [ ] Fundo na faixa `#0D0618` – `#1A0B2E`  
- [ ] Destaque principal em `#6C2BD9` (no máximo 1 área forte)  
- [ ] Texto legível: branco ou branco 70%  
- [ ] Fonte: Montserrat (título) + Inter (corpo)  
- [ ] Produto com boa luz; glow roxo discreto se usar PNG  
- [ ] Logo/marca visível e discreta  
- [ ] Preview no celular (tela escura, brilho médio)

---

*Documento criado para apoio à criação de posts — Clube Caixa Secreta. Maio/2026.*
