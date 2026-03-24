/**
 * Caixa Secreta – Catálogo e carrinho com finalização via WhatsApp
 * Número WhatsApp: 5511918535361
 *
 * ESTRUTURA DO SCRIPT:
 * 1. Dados (PRODUTOS, PRODUTOS_PROMO, constantes)
 * 2. Estado (carrinho, categoria, ordenação, busca, filtros)
 * 3. Formatação e DOM
 * 4. Categorias e abas
 * 5. Procuras (mais vendidos)
 * 6. Produtos (filtros, ordenação, cards, busca, mais vendidos)
 * 7. Carrinho (CRUD, contador header, animação)
 * 8. Modal (frete, Pix, WhatsApp)
 * 9. Promoção relâmpago
 * 10. Menu móvel
 * 11. Inicialização e planilha
 */

// ========== 1. DADOS DOS PRODUTOS ==========
// Edite aqui para adicionar ou alterar produtos. Use imagens da pasta imagens/
const PRODUTOS = [
  {
    id: 'vibrador-pincel',
    nome: 'Vibrador em Formato de Pincel com 8 Modos de Vibração',
    preco: 89.9,
    imagem: 'imagens/Vibradores/Vibrador em Formato de pincel com 8 Modos de Vibração.png',
    categoria: 'Vibradores'
  },
  {
    id: 'vibrador-magesty',
    nome: 'Magesty Vibrador de Calcinha 9 Modos de Pulsação Controle Via APP',
    preco: 129.9,
    imagem: 'imagens/Vibradores/Magesty Vibrador de Calcinha 9 Modos de Pulsação Controle Via APP .png',
    categoria: 'Vibradores'
  },
  {
    id: 'basebal-bat',
    nome: 'Basebal Bat Vibrador com Aparência Realística com 10 Modos Vai e Vem e Vibração',
    preco: 119.9,
    imagem: 'imagens/Vibradores/Basebal Bat Vibrador com Aparência Realística com 10 Modos Vai e Vem e Vibração.png',
    categoria: 'Vibradores'
  },
  {
    id: 'bullet-vibratorio',
    nome: 'Bullet Vibratório com 10 Modos de Vibração Recarregável e Controle por Aplicativo',
    preco: 79.9,
    imagem: 'imagens/Vibradores/Bullet Vibratório com 10 Modos de Vibração Recarregável e Controle por Aplicativo.png',
    categoria: 'Vibradores'
  },
  {
    id: 'estimulador-porquinho',
    nome: 'Estimulador Feminino Porquinho com 10 Modos de Ondas de Pressão',
    preco: 69.9,
    imagem: 'imagens/Vibradores/Estimulador Feminino Porquinho com 10 Modos de Ondas de Pressão.png',
    categoria: 'Vibradores'
  },
  {
    id: 'mini-toy-varinha',
    nome: 'Mini Toy Vibrador Varinha Mágica com 20 Modos de Vibrações e 8 Níveis e Velocidade',
    preco: 99.9,
    imagem: 'imagens/Vibradores/Mini Toy Vibrador Varinha Mágica com 20 Modos de Vibrações e 8 Níveis e Velocidade.png',
    categoria: 'Vibradores'
  },
  {
    id: 'sophie-rosa',
    nome: 'Sophie Vibrador Formato de Rosa com 10 Modos de Vibração, Vai e Vem e Pulsação',
    preco: 109.9,
    imagem: 'imagens/Vibradores/Sophie Vibrador Formato de Rosa com 10 Modos de Vibracao, Vai e Vem e Pulsacao.png',
    categoria: 'Vibradores'
  },
  {
    id: 'ponto-g-30',
    nome: 'Vibrador Ponto G com 30 Modos de Vibração',
    preco: 129.9,
    imagem: 'imagens/Vibradores/Vibrador Ponto G com 30 Modos de Vibração.png',
    categoria: 'Vibradores'
  },
  {
    id: 'ponto-g-linguagem',
    nome: 'Vibrador Ponto G com Estimulador de Clitóris Língua com 10 Modos de Vibração e Aquecimento',
    preco: 149.9,
    imagem: 'imagens/Vibradores/Vibrador Ponto G com Estimulador de Clitóris Língua com 10 Modos de Vibração e Aquecimento.png',
    categoria: 'Vibradores'
  },
  {
    id: '001',
    nome: 'Vibrador Ponto G em Formato de Golfinho em ABS',
    preco: 30,
    imagem: 'imagens/Vibradores/001 - Vibrador Ponto G em Formato de Golfinho em ABS.png',
    categoria: 'Vibradores'
  },
  {
    id: 'vibrador-rotativo',
    nome: 'Vibrador Rotativo Vai e Vem com 36 Nível de Pulsação e Estimulador',
    preco: 139.9,
    imagem: 'imagens/Vibradores/Vibrador Rotativo Vai e Vem com 36 Nível de Pulsação e Estimulador.png',
    categoria: 'Vibradores'
  },
  {
    id: 'kuloko-gel',
    nome: 'Kuloko Gel Dessensibilizante e Excitante Anal Linha Brasileirinhos 15g',
    preco: 49.9,
    imagem: 'imagens/Comesticos/Kuloko Gel Dessensibilizante e Excitante Anal Linha Brasileirinhos 15g.png',
    categoria: 'Comesticos'
  },
  {
    id: 'xana-loka-gel',
    nome: 'Xana Loka Gel Excitante Feminino Linha Brasileirinhos 15g',
    preco: 49.9,
    imagem: 'imagens/Comesticos/Xana Loka Gel Excitante Feminino Linha Brasileirinhos 15g.png',
    categoria: 'Comesticos'
  },
  {
    id: 'chabata',
    nome: 'Chabata',
    preco: 79.9,
    imagem: 'imagens/Fetiche_Sado/Chabata.png',
    categoria: 'Fetiche_Sado'
  },
  {
    id: 'chicote',
    nome: 'Chicote',
    preco: 89.9,
    imagem: 'imagens/Fetiche_Sado/Chicote.png',
    categoria: 'Fetiche_Sado'
  },
  {
    id: 'corda',
    nome: 'Corda',
    preco: 59.9,
    imagem: 'imagens/Fetiche_Sado/Corda.png',
    categoria: 'Fetiche_Sado'
  },
  {
    id: 'kit-sado',
    nome: 'Kit Sado',
    preco: 149.9,
    imagem: 'imagens/Fetiche_Sado/Kit Sado.png',
    categoria: 'Fetiche_Sado'
  },
  {
    id: 'sado',
    nome: 'Sado',
    preco: 99.9,
    imagem: 'imagens/Fetiche_Sado/Sado.png',
    categoria: 'Fetiche_Sado'
  },
  {
    id: 'lingerie-branco-fio',
    nome: 'Lingerie Branco Fio (Frente e Costas)',
    preco: 129.9,
    imagens: ['imagens/Lingerie/branco fio1.png', 'imagens/Lingerie/brancio fio2.png'],
    categoria: 'Lingerie'
  },
  {
    id: 'lingerie-parte',
    nome: 'Lingerie Parte (Frente e Costas)',
    preco: 99.9,
    imagens: ['imagens/Lingerie/parte1.webp', 'imagens/Lingerie/parte2.webp'],
    categoria: 'Lingerie'
  },
  {
    id: 'lingerie-pluz',
    nome: 'Lingerie Pluz (Frente e Costas)',
    preco: 99.9,
    imagens: ['imagens/Lingerie/pluz1.webp', 'imagens/Lingerie/pluz2.webp'],
    categoria: 'Lingerie'
  },
  {
    id: 'lingerie-hl074-rosa',
    nome: 'Lingerie Rosa Claro com Branco',
    preco: 79.9,
    imagem: 'imagens/Lingerie/HL074-U-Rosa-Claro-com-Branco_1-.webp',
    categoria: 'Lingerie'
  },
  {
    id: 'lingerie-hl074-vermelho',
    nome: 'Lingerie Vermelho com Preto',
    preco: 79.9,
    imagem: 'imagens/Lingerie/HL074-U-Vermelho-com-Preto_1-.webp',
    categoria: 'Lingerie'
  },
  {
    id: 'lingerie-hl680-vermelho',
    nome: 'Lingerie Vermelho',
    preco: 99.9,
    imagem: 'imagens/Lingerie/HL680-P-Vermelho_1.webp',
    categoria: 'Lingerie'
  },
  {
    id: 'lingerie-hl680-preto',
    nome: 'Lingerie Preto',
    preco: 99.9,
    imagem: 'imagens/Lingerie/HL680-U-Preto_2.webp',
    categoria: 'Lingerie'
  },
  {
    id: 'lingerie-hl717-pink',
    nome: 'Lingerie Pink',
    preco: 94.9,
    imagem: 'imagens/Lingerie/HL717-U-Pink_1-removebg-preview.png',
    categoria: 'Lingerie'
  },
  {
    id: 'lingerie-hl717-preto',
    nome: 'Lingerie Preto HL717',
    preco: 94.9,
    imagem: 'imagens/Lingerie/HL717-U-Preto_2-removebg-preview.png',
    categoria: 'Lingerie'
  },
  {
    id: 'lingerie-hl772-azul',
    nome: 'Lingerie Azul',
    preco: 94.9,
    imagem: 'imagens/Lingerie/HL772-U-Azul_1.webp',
    categoria: 'Lingerie'
  },
  {
    id: 'lingerie-hl772-vermelho',
    nome: 'Lingerie Vermelho HL772',
    preco: 94.9,
    imagem: 'imagens/Lingerie/HL772-U-Vermelho_2.webp',
    categoria: 'Lingerie'
  }
];

const WHATSAPP_NUMERO = '5511918535361';
/** Incrementar ao alterar a planilha para o navegador não usar CSV em cache. */
const VERSAO_PLANILHA_PRODUTOS = '10';
const MOSTRAR_PROMO_RELAMPAGO = false;

// ========== PROMOÇÃO RELÂMPAGO ==========
// Data/hora em que a promoção termina (edite aqui: ano, mês-1, dia, hora, min, seg)
const PROMO_FIM = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
PROMO_FIM.setHours(23, 59, 59, 999);

// Produtos da promoção (carregados automaticamente via planilha_ofertas.csv)
let PRODUTOS_PROMO = [];

// ========== ESTADO ==========
let carrinho = JSON.parse(localStorage.getItem('caixasecreta_carrinho')) || [];
let categoriaAtiva = 'todos';
let ordenacaoAtiva = localStorage.getItem('caixasecreta_ordenacao') || 'mais_vendidos';
let buscaTexto = '';
let ultimoAdicionadoId = null;

// ========== FORMATAÇÃO ==========
function formatarPreco(valor) {
  return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
}

// ========== DOM ==========
const produtosGrid = document.getElementById('produtos-grid');
const categoriaTabs = document.querySelector('.categoria-tabs');
const carrinhoLista = document.getElementById('carrinho-lista');
const carrinhoVazio = document.getElementById('carrinho-vazio');
const carrinhoTotalWrap = document.getElementById('carrinho-total-wrap');
const carrinhoSubtotal = document.getElementById('carrinho-subtotal');
const carrinhoTotal = document.getElementById('carrinho-total');
const btnFinalizarWhatsApp = document.getElementById('btn-finalizar-whatsapp');

// Frete: compras >= 120 = grátis para SP. Valor por região/UF (em R$)
const FRETE_MINIMO_GRATIS = 120;
const FRETE_POR_UF = {
  SP: 15, RJ: 18, MG: 18, ES: 18,
  PR: 20, SC: 20, RS: 20,
  DF: 22, GO: 22, MT: 22, MS: 22,
  BA: 24, CE: 24, PE: 24, RN: 24, PB: 24, AL: 24, SE: 24, MA: 24, PI: 24,
  AC: 26, AM: 26, AP: 26, PA: 26, RO: 26, RR: 26, TO: 26
};
const FRETE_PADRAO = 25; // UF não mapeada
const DESCONTO_PIX = 0.05; // 5%

// ========== CATEGORIAS ==========
function obterCategorias() {
  const base = ['Vibradores', 'Comesticos', 'Fetiche_Sado', 'Lingerie', 'Acessorios'];
  const cats = new Set(PRODUTOS.map(function (p) { return p.categoria; }));
  const lista = base.slice();
  cats.forEach(function (c) {
    if (c && lista.indexOf(c) < 0) lista.push(c);
  });
  return ['todos', ...lista];
}

function renderizarAbas() {
  if (!categoriaTabs) return;
  const categorias = obterCategorias();
  const labels = { todos: 'Todos', Vibradores: 'Vibradores', Lingerie: 'Lingerie', Acessorios: 'Acessórios', 'Linha Premium': 'Linha Premium', Fetiche_Sado: 'Fetiche & Sado', Comesticos: 'Cosméticos', Comestiveis: 'Comestíveis' };
  categoriaTabs.innerHTML = categorias.map(cat => `
    <button type="button" class="categoria-tab" data-categoria="${cat}" role="tab">
      ${labels[cat] || cat}
    </button>
  `).join('');

  categoriaTabs.querySelectorAll('.categoria-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      categoriaAtiva = btn.dataset.categoria;
      categoriaTabs.querySelectorAll('.categoria-tab').forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      renderizarProdutos();
    });
  });

  const primeiro = categoriaTabs.querySelector('.categoria-tab');
  if (primeiro) primeiro.classList.add('ativo');
}

// ========== PROCURAS (mais procurado) ==========
function getProcuras() {
  try {
    return JSON.parse(localStorage.getItem('caixasecreta_procuras')) || {};
  } catch (e) { return {}; }
}

function incrementarProcura(id) {
  const p = getProcuras();
  p[id] = (p[id] || 0) + 1;
  localStorage.setItem('caixasecreta_procuras', JSON.stringify(p));
}

// ========== PRODUTOS ==========
function produtosFiltrados() {
  let lista = categoriaAtiva === 'todos' ? PRODUTOS.slice() : PRODUTOS.filter(p => p.categoria === categoriaAtiva);
  if (buscaTexto) {
    const termo = buscaTexto.trim().toLowerCase();
    lista = lista.filter(p =>
      (p.nome && p.nome.toLowerCase().indexOf(termo) >= 0) ||
      (p.categoria && p.categoria.toLowerCase().indexOf(termo) >= 0)
    );
  }
  return lista;
}

function precoNumerico(produto) {
  const p = produto.preco;
  if (typeof p === 'number' && !Number.isNaN(p)) return p;
  const n = parseFloat(String(p).replace(',', '.'));
  return Number.isNaN(n) ? 0 : n;
}

function ordenarProdutos(lista) {
  const procuras = getProcuras();
  const copia = lista.slice();
  switch (ordenacaoAtiva) {
    case 'menor_preco':
      return copia.sort((a, b) => precoNumerico(a) - precoNumerico(b));
    case 'maior_preco':
      return copia.sort((a, b) => precoNumerico(b) - precoNumerico(a));
    case 'mais_vendidos':
      return copia.sort((a, b) => (procuras[b.id] || 0) - (procuras[a.id] || 0) || precoNumerico(a) - precoNumerico(b));
    case 'data_lancamento':
      return copia.sort((a, b) => PRODUTOS.indexOf(a) - PRODUTOS.indexOf(b));
    case 'melhor_desconto':
      return copia.sort((a, b) => (procuras[b.id] || 0) - (procuras[a.id] || 0) || precoNumerico(a) - precoNumerico(b));
    default:
      return copia.sort((a, b) => (procuras[b.id] || 0) - (procuras[a.id] || 0) || precoNumerico(a) - precoNumerico(b));
  }
}

function urlImagem(src) {
  try { return encodeURI(src); } catch (e) { return src; }
}

function escaparHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getTopMaisVendidosIds(n) {
  const procuras = getProcuras();
  return PRODUTOS.map(p => ({ id: p.id, count: procuras[p.id] || 0 }))
    .sort((a, b) => b.count - a.count)
    .filter(x => x.count > 0)
    .slice(0, n)
    .map(x => x.id);
}

function montarCardProduto(p, opts) {
  opts = opts || {};
  const fallbackPadrao = fallbackImagemGenericoCategoria(p.categoria);
  const imgs = (p.imagens && p.imagens.length ? p.imagens : [p.imagem]).filter(function (src) { return src; });
  const imgHtml = imgs.length ? imgs.map((src, i) =>
    '<img src="' + urlImagem(src) + '" data-fallback="' + urlImagem(fallbackPadrao) + '" alt="' + (p.nome + ' ' + (i === 0 ? '(frente)' : '(costas)')) + '" loading="lazy" decoding="async" onerror="if(this.dataset.fallback&&this.dataset.fallback!==this.getAttribute(\'src\')){this.setAttribute(\'src\',this.dataset.fallback);return;}this.style.display=\'none\';this.parentElement.style.background=\'var(--fundo)\'">'
  ).join('') : '<div class="produto-img-placeholder"></div>';
  const topIds = opts.topMaisVendidosIds || [];
  const selos = [];
  if (p.maisVendido || topIds.indexOf(p.id) >= 0) selos.push('<span class="produto-selo mais-vendido">Mais vendido</span>');
  if (p.desconto != null && p.desconto > 0) selos.push('<span class="produto-selo desconto">' + p.desconto + '% OFF</span>');
  const selosHtml = selos.length ? '<div class="produto-selos">' + selos.join('') + '</div>' : '';
  const msgWhatsApp = encodeURIComponent('Olá! Gostaria de mais informações sobre: ' + p.nome);
  const linkWhatsApp = 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + msgWhatsApp;
  const descHtml = p.descricao
    ? '<p class="produto-descricao">' + escaparHtml(p.descricao) + '</p>'
    : '';
  return (
    '<article class="produto-card" data-id="' + p.id + '">' +
      selosHtml +
      '<div class="produto-img-wrap ' + (imgs.length > 1 ? 'produto-img-wrap--dupla' : '') + '">' + imgHtml + '</div>' +
      '<div class="produto-info">' +
        '<h3 class="produto-nome">' + p.nome + '</h3>' +
        descHtml +
        '<p class="produto-preco">' + formatarPreco(p.preco) + '</p>' +
        '<div class="produto-botoes">' +
          '<button type="button" class="btn btn-carrinho" data-id="' + p.id + '">Adicionar ao carrinho</button>' +
          '<a href="' + linkWhatsApp + '" target="_blank" rel="noopener" class="btn btn-whatsapp-card">WhatsApp</a>' +
        '</div>' +
      '</div>' +
    '</article>'
  );
}

function renderizarProdutos() {
  if (!produtosGrid) return;
  const topIds = getTopMaisVendidosIds(5);
  const lista = ordenarProdutos(produtosFiltrados());
  produtosGrid.innerHTML = lista.map(p => montarCardProduto(p, { topMaisVendidosIds: topIds })).join('');

  produtosGrid.querySelectorAll('.btn-carrinho').forEach(btn => {
    btn.addEventListener('click', () => adicionarAoCarrinho(btn.dataset.id));
  });
}

function renderizarMaisVendidos() {
  const grid = document.getElementById('mais-vendidos-grid');
  if (!grid) return;
  const topIds = getTopMaisVendidosIds(6);
  if (topIds.length === 0) {
    grid.innerHTML = '<p class="mais-vendidos-vazio">Nenhuma compra ainda. Seja o primeiro a adicionar ao carrinho!</p>';
    return;
  }
  const produtos = topIds.map(id => PRODUTOS.find(p => p.id === id)).filter(Boolean);
  grid.innerHTML = produtos.map(p => montarCardProduto(p, { topMaisVendidosIds: topIds })).join('');
  grid.querySelectorAll('.btn-carrinho').forEach(btn => {
    btn.addEventListener('click', () => adicionarAoCarrinho(btn.dataset.id));
  });
}

function soAceitaTextoBusca(val) {
  return String(val).replace(/[^a-zA-ZáàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ\s]/g, '').trim();
}

function configurarBusca() {
  const input = document.getElementById('busca-produtos');
  const msgEl = document.getElementById('busca-msg');
  if (!input) return;
  input.addEventListener('input', function () {
    var val = this.value;
    var filtrado = soAceitaTextoBusca(val);
    if (val !== filtrado) {
      this.value = filtrado;
      if (msgEl) { msgEl.textContent = 'Use apenas letras na busca.'; msgEl.className = 'busca-msg busca-msg-aviso'; }
    } else {
      if (msgEl) { msgEl.textContent = ''; msgEl.className = 'busca-msg'; }
    }
    buscaTexto = filtrado;
    renderizarProdutos();
  });
  input.addEventListener('paste', function (e) {
    setTimeout(function () {
      var val = input.value;
      var filtrado = soAceitaTextoBusca(val);
      if (val !== filtrado) {
        input.value = filtrado;
        if (msgEl) { msgEl.textContent = 'Use apenas letras na busca.'; msgEl.className = 'busca-msg busca-msg-aviso'; }
      }
      buscaTexto = filtrado;
      renderizarProdutos();
    }, 0);
  });
}

// ========== CARRINHO ==========
function adicionarAoCarrinho(id) {
  const produto = PRODUTOS.find(p => p.id === id);
  if (!produto) return;
  incrementarProcura(id);
  ultimoAdicionadoId = id;
  const img = (produto.imagens && produto.imagens[0]) || produto.imagem;
  const item = carrinho.find(i => i.id === id);
  if (item) item.quantidade += 1;
  else carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, imagem: img, quantidade: 1 });
  salvarCarrinho();
  renderizarCarrinho();
  renderizarMaisVendidos();
  updateContadorCarrinho();
}

function updateContadorCarrinho() {
  const el = document.getElementById('nav-carrinho-count');
  if (!el) return;
  const total = carrinho.reduce((acc, i) => acc + i.quantidade, 0);
  el.textContent = total;
  el.classList.remove('pulse');
  el.offsetHeight;
  el.classList.add('pulse');
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter(i => i.id !== id);
  salvarCarrinho();
  renderizarCarrinho();
}

function alterarQuantidade(id, delta) {
  const item = carrinho.find(i => i.id === id);
  if (!item) return;
  item.quantidade += delta;
  if (item.quantidade < 1) removerDoCarrinho(id);
  else {
    salvarCarrinho();
    renderizarCarrinho();
  }
}

function salvarCarrinho() {
  localStorage.setItem('caixasecreta_carrinho', JSON.stringify(carrinho));
}

function totalCarrinho() {
  return carrinho.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
}

function renderizarCarrinho() {
  if (!carrinhoLista) return;
  carrinhoLista.innerHTML = '';
  if (carrinho.length === 0) {
    if (carrinhoVazio) carrinhoVazio.hidden = false;
    if (carrinhoTotalWrap) carrinhoTotalWrap.hidden = true;
    return;
  }
  if (carrinhoVazio) carrinhoVazio.hidden = true;
  if (carrinhoTotalWrap) carrinhoTotalWrap.hidden = false;
  const subtotal = totalCarrinho();
  if (carrinhoSubtotal) carrinhoSubtotal.textContent = formatarPreco(subtotal);
  if (carrinhoTotal) carrinhoTotal.textContent = formatarPreco(subtotal);
  var freteEl = document.getElementById('carrinho-frete');
  if (freteEl) freteEl.textContent = 'Calculado no checkout';

  carrinho.forEach(item => {
    const div = document.createElement('div');
    div.className = 'carrinho-item' + (ultimoAdicionadoId === item.id ? ' adicionado' : '');
    if (ultimoAdicionadoId === item.id) ultimoAdicionadoId = null;
    div.innerHTML = `
      <img class="carrinho-item-img" src="${urlImagem(item.imagem)}" alt="" onerror="this.style.display='none'">
      <div class="carrinho-item-detalhes">
        <p class="carrinho-item-nome">${item.nome}</p>
        <p class="carrinho-item-preco">${formatarPreco(item.preco)} un.</p>
      </div>
      <div class="carrinho-item-qtd">
        <button type="button" aria-label="Diminuir quantidade" data-id="${item.id}" data-delta="-1">−</button>
        <span>${item.quantidade}</span>
        <button type="button" aria-label="Aumentar quantidade" data-id="${item.id}" data-delta="1">+</button>
      </div>
      <button type="button" class="carrinho-item-remover" data-id="${item.id}" aria-label="Remover">Remover</button>
    `;
    carrinhoLista.appendChild(div);
  });

  carrinhoLista.querySelectorAll('[data-id]').forEach(btn => {
    const id = btn.dataset.id;
    if (btn.classList.contains('carrinho-item-remover')) {
      btn.addEventListener('click', () => removerDoCarrinho(id));
    } else if (btn.dataset.delta) {
      btn.addEventListener('click', () => alterarQuantidade(id, parseInt(btn.dataset.delta, 10)));
    }
  });
}

// ========== MODAL CHECKOUT (Cadastro + Frete + WhatsApp) ==========
let freteCalculado = null;
let enderecoCep = null;

const modalCheckout = document.getElementById('modal-checkout');
const formCheckout = document.getElementById('form-checkout');
const cadastroNome = document.getElementById('cadastro-nome');
const cadastroTelefone = document.getElementById('cadastro-telefone');
const cadastroCep = document.getElementById('cadastro-cep');
const btnCalcularFrete = document.getElementById('btn-calcular-frete');
const cepMsg = document.getElementById('cep-msg');
const cepEndereco = document.getElementById('cep-endereco');
const resumoFrete = document.getElementById('resumo-frete');
const modalSubtotal = document.getElementById('modal-subtotal');
const modalFrete = document.getElementById('modal-frete');
const modalTotal = document.getElementById('modal-total');
const btnConfirmarPedido = document.getElementById('btn-confirmar-pedido');

function salvarCliente(nome, whatsapp, cep) {
  try {
    localStorage.setItem('cliente', JSON.stringify({ nome: nome, whatsapp: whatsapp, cep: cep }));
  } catch (e) {}
}

function obterClienteSalvo() {
  try {
    var s = localStorage.getItem('cliente');
    return s ? JSON.parse(s) : null;
  } catch (e) { return null; }
}

function abrirCheckout() {
  if (carrinho.length === 0) return;
  freteCalculado = null;
  enderecoCep = null;
  if (modalSubtotal) modalSubtotal.textContent = formatarPreco(totalCarrinho());
  if (resumoFrete) resumoFrete.hidden = false;
  if (modalFrete) modalFrete.textContent = '–';
  if (cepMsg) { cepMsg.textContent = ''; cepMsg.className = 'form-msg'; }
  if (cepEndereco) cepEndereco.textContent = '';
  limparErrosCheckout();
  var cliente = obterClienteSalvo();
  if (formCheckout) {
    formCheckout.reset();
    if (cliente) {
      if (cadastroNome && cliente.nome) cadastroNome.value = cliente.nome;
      if (cadastroTelefone && cliente.whatsapp) cadastroTelefone.value = formatarTelefone(cliente.whatsapp);
      if (cadastroCep && cliente.cep) cadastroCep.value = formatarCep(cliente.cep);
    }
    var pixRadio = formCheckout.querySelector('input[name="pagamento"][value="Pix"]');
    if (pixRadio) pixRadio.checked = true;
  }
  atualizarTotalModal();
  setConfirmarPedidoLoading(false);
  if (modalCheckout) {
    modalCheckout.classList.add('ativo');
    modalCheckout.setAttribute('aria-hidden', 'false');
  }
}

function fecharCheckout() {
  if (modalCheckout) {
    modalCheckout.classList.remove('ativo');
    modalCheckout.setAttribute('aria-hidden', 'true');
  }
  setConfirmarPedidoLoading(false);
}

function setConfirmarPedidoLoading(loading) {
  if (!btnConfirmarPedido) return;
  var texto = btnConfirmarPedido.querySelector('.btn-confirmar-texto');
  if (texto) texto.textContent = loading ? 'Enviando...' : 'Confirmar pedido';
  btnConfirmarPedido.disabled = loading;
}

function limparErrosCheckout() {
  ['checkout-erro-nome', 'checkout-erro-telefone'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

function formatarTelefone(v) {
  var n = String(v).replace(/\D/g, '');
  if (n.length <= 2) return n ? '(' + n : '';
  if (n.length <= 7) return '(' + n.slice(0, 2) + ') ' + n.slice(2);
  return '(' + n.slice(0, 2) + ') ' + n.slice(2, 7) + '-' + n.slice(7, 11);
}

function calcularFreteValor(uf) {
  const subtotal = totalCarrinho();
  if (subtotal >= FRETE_MINIMO_GRATIS) return 0;
  const valor = FRETE_POR_UF[uf] != null ? FRETE_POR_UF[uf] : FRETE_PADRAO;
  return valor;
}

function formatarCep(v) {
  const n = v.replace(/\D/g, '');
  return n.length > 5 ? n.slice(0, 5) + '-' + n.slice(5, 8) : n;
}

function buscarCep() {
  const cep = cadastroCep.value.replace(/\D/g, '');
  if (cep.length !== 8) {
    if (cepMsg) { cepMsg.textContent = 'CEP deve ter 8 dígitos.'; cepMsg.className = 'form-msg erro'; }
    return;
  }
  if (cepMsg) { cepMsg.textContent = 'Buscando...'; cepMsg.className = 'form-msg'; }
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(r => r.json())
    .then(data => {
      if (data.erro) {
        if (cepMsg) { cepMsg.textContent = 'CEP não encontrado.'; cepMsg.className = 'form-msg erro'; }
        if (cepEndereco) cepEndereco.textContent = '';
        return;
      }
      enderecoCep = data;
      const uf = data.uf || '';
      const cidade = data.localidade || '';
      const bairro = data.bairro || '';
      if (cepMsg) { cepMsg.textContent = 'CEP encontrado!'; cepMsg.className = 'form-msg ok'; }
      if (cepEndereco) cepEndereco.textContent = `${bairro}, ${cidade} - ${uf}`;

      freteCalculado = calcularFreteValor(uf);
      if (resumoFrete) resumoFrete.hidden = false;
      if (modalFrete) modalFrete.textContent = freteCalculado === 0 ? 'Grátis' : formatarPreco(freteCalculado);
      atualizarTotalModal();
    })
    .catch(() => {
      if (cepMsg) { cepMsg.textContent = 'Erro ao buscar CEP. Tente de novo.'; cepMsg.className = 'form-msg erro'; }
    });
}

function totalAPagar(subtotal, frete, ehPix) {
  const bruto = subtotal + (frete !== null ? frete : 0);
  return ehPix ? bruto * (1 - DESCONTO_PIX) : bruto;
}

function atualizarTotalModal() {
  if (!modalTotal) return;
  const subtotal = totalCarrinho();
  const frete = freteCalculado !== null ? freteCalculado : 0;
  const ehPix = formCheckout && formCheckout.querySelector('input[name="pagamento"]:checked')?.value === 'Pix';
  const total = totalAPagar(subtotal, frete, ehPix);
  modalTotal.textContent = formatarPreco(total) + (ehPix ? ' (5% OFF no Pix)' : '');
}

/** Monta a mensagem do pedido (texto puro). Formato: Pedido - Caixa Secreta, Cliente, WhatsApp, CEP, Produtos, Subtotal, Frete, Desconto Pix (se Pix), Total, Forma de pagamento. */
function montarMensagemPedido(nome, whatsapp, cep, formaPagamento) {
  const subtotal = totalCarrinho();
  const frete = freteCalculado !== null ? freteCalculado : 0;
  const ehPix = formaPagamento === 'Pix';
  const totalBruto = subtotal + frete;
  const descontoPix = ehPix ? totalBruto * DESCONTO_PIX : 0;
  const total = totalBruto - descontoPix;

  var linhas = [
    'Pedido - Caixa Secreta',
    '',
    'Cliente: ' + nome,
    'WhatsApp: ' + whatsapp,
    'CEP: ' + (cep || ''),
    '',
    'Produtos:',
    ''
  ];
  carrinho.forEach(function (i) {
    linhas.push(i.quantidade + 'x ' + i.nome + ' - ' + formatarPreco(i.preco));
  });
  linhas.push('');
  linhas.push('Subtotal: ' + formatarPreco(subtotal));
  linhas.push('Frete: ' + (frete === 0 ? 'Grátis' : formatarPreco(frete)));
  if (ehPix && descontoPix > 0) {
    linhas.push('');
    linhas.push('Desconto Pix: -' + formatarPreco(descontoPix));
  }
  linhas.push('');
  linhas.push('Total: ' + formatarPreco(total));
  linhas.push('');
  linhas.push('Forma de pagamento: ' + formaPagamento);
  return linhas.join('\n');
}

/** Abre o link do WhatsApp em nova aba com a mensagem codificada. */
function enviarPedidoWhatsApp(mensagem) {
  var url = 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(mensagem);
  window.open(url, '_blank', 'noopener,noreferrer');
}

function validarCheckout() {
  limparErrosCheckout();
  var ok = true;
  var nome = cadastroNome ? cadastroNome.value.trim() : '';
  var telefone = cadastroTelefone ? cadastroTelefone.value.replace(/\D/g, '') : '';
  var errosNome = document.getElementById('checkout-erro-nome');
  var errosTelefone = document.getElementById('checkout-erro-telefone');
  if (!nome) {
    if (errosNome) { errosNome.textContent = 'Informe o nome completo.'; ok = false; }
  }
  if (telefone.length < 10 || telefone.length > 11) {
    if (errosTelefone) { errosTelefone.textContent = 'Informe um WhatsApp válido (10 ou 11 dígitos).'; ok = false; }
  }
  if (freteCalculado === null) {
    if (cepMsg) { cepMsg.textContent = 'Informe o CEP e clique em Calcular frete.'; cepMsg.className = 'form-msg erro'; ok = false; }
  }
  return ok;
}

if (btnFinalizarWhatsApp) {
  btnFinalizarWhatsApp.addEventListener('click', function (e) {
    e.preventDefault();
    abrirCheckout();
  });
}

var btnFecharCheckout = document.getElementById('modal-checkout-fechar');
if (btnFecharCheckout) btnFecharCheckout.addEventListener('click', fecharCheckout);
if (modalCheckout) {
  modalCheckout.addEventListener('click', function (e) {
    if (e.target === modalCheckout) fecharCheckout();
  });
}

if (cadastroCep) {
  cadastroCep.addEventListener('input', function () { cadastroCep.value = formatarCep(cadastroCep.value); });
}
if (cadastroTelefone) {
  cadastroTelefone.addEventListener('input', function () {
    cadastroTelefone.value = formatarTelefone(cadastroTelefone.value);
  });
}
if (btnCalcularFrete) btnCalcularFrete.addEventListener('click', buscarCep);

if (formCheckout) {
  formCheckout.querySelectorAll('input[name="pagamento"]').forEach(function (radio) {
    radio.addEventListener('change', atualizarTotalModal);
  });
  formCheckout.addEventListener('submit', function (e) {
    e.preventDefault();
    if (carrinho.length === 0) return;
    if (!validarCheckout()) return;
    var nome = cadastroNome.value.trim();
    var whatsapp = cadastroTelefone.value.replace(/\D/g, '');
    if (whatsapp.length < 10) whatsapp = cadastroTelefone.value;
    var cep = cadastroCep ? cadastroCep.value.trim() : '';
    var pagamento = formCheckout.querySelector('input[name="pagamento"]:checked');
    if (!pagamento) return;
    salvarCliente(nome, whatsapp, cep);
    var mensagem = montarMensagemPedido(nome, whatsapp, cep, pagamento.value);
    setConfirmarPedidoLoading(true);
    enviarPedidoWhatsApp(mensagem);
    fecharCheckout();
    setTimeout(function () { setConfirmarPedidoLoading(false); }, 500);
  });
}

// ========== PROMOÇÃO RELÂMPAGO: COUNTDOWN E LISTA ==========
let promoRotacaoIndex = 0;
let promoRotacaoTimer = null;

function atualizarCountdown() {
  const elDias = document.getElementById('promo-dias');
  const elHoras = document.getElementById('promo-horas');
  const elMin = document.getElementById('promo-min');
  const elSeg = document.getElementById('promo-seg');
  if (!elDias || !elHoras || !elMin || !elSeg) return;

  const agora = new Date();
  const fim = new Date(PROMO_FIM);
  if (agora >= fim) {
    elDias.textContent = '00';
    elHoras.textContent = '00';
    elMin.textContent = '00';
    elSeg.textContent = '00';
    return;
  }
  const diff = fim - agora;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seg = Math.floor((diff % (1000 * 60)) / 1000);
  const pad = (n) => String(n).padStart(2, '0');
  elDias.textContent = pad(dias);
  elHoras.textContent = pad(horas);
  elMin.textContent = pad(min);
  elSeg.textContent = pad(seg);
}

function qtdItensPromoVisivel() {
  if (window.innerWidth >= 1024) return 4;
  return 3;
}

function obterVitrinePromo() {
  const total = PRODUTOS_PROMO.length;
  if (total === 0) return [];
  const qtd = qtdItensPromoVisivel();
  if (total <= qtd) return PRODUTOS_PROMO.slice();
  const inicio = promoRotacaoIndex % total;
  const lista = [];
  for (let i = 0; i < qtd; i += 1) {
    lista.push(PRODUTOS_PROMO[(inicio + i) % total]);
  }
  return lista;
}

function iniciarRotacaoPromo() {
  if (promoRotacaoTimer) {
    clearInterval(promoRotacaoTimer);
    promoRotacaoTimer = null;
  }
  const total = PRODUTOS_PROMO.length;
  const qtd = qtdItensPromoVisivel();
  if (total <= qtd) return;
  promoRotacaoTimer = setInterval(function () {
    promoRotacaoIndex = (promoRotacaoIndex + 1) % total;
    renderizarPromo();
  }, 6000);
}

function renderizarPromo() {
  const el = document.getElementById('promo-produtos');
  if (!el) return;
  if (PRODUTOS_PROMO.length === 0) {
    el.innerHTML = '<p class="promo-vazio">Sem itens em promoção relâmpago no momento. Ative produtos na planilha de ofertas.</p>';
    if (promoRotacaoTimer) {
      clearInterval(promoRotacaoTimer);
      promoRotacaoTimer = null;
    }
    return;
  }
  const vitrine = obterVitrinePromo();
  el.innerHTML = vitrine.map(p => `
    <div class="promo-item" data-id="${p.id}">
      <div class="promo-item-img-wrap">
        <img src="${p.imagem}" alt="${p.nome}" onerror="this.parentElement.style.background='var(--fundo)'">
      </div>
      <div class="promo-item-info">
        <p class="promo-item-nome">${p.nome}</p>
        ${p.descricao ? `<p class="promo-item-desc">${p.descricao}</p>` : ''}
        ${p.descontoPix ? `<span class="promo-item-badge">${p.descontoPix}% OFF</span>` : ''}
        <div class="promo-item-precos">
          ${p.precoDe ? `<span class="promo-item-de">De ${formatarPreco(p.precoDe)}</span>` : ''}
          <span class="promo-item-pix">${formatarPreco(p.precoPix)} no pix</span>
          ${p.parcelas ? `<span class="promo-item-parcela">${p.parcelas}</span>` : ''}
        </div>
      </div>
      <button type="button" class="promo-item-btn" data-id="${p.id}">Adicionar ao carrinho</button>
    </div>
  `).join('');

  el.querySelectorAll('.promo-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = PRODUTOS_PROMO.find(x => x.id === btn.dataset.id);
      if (!p) return;
      const item = carrinho.find(i => i.id === p.id);
      if (item) item.quantidade += 1;
      else carrinho.push({ id: p.id, nome: p.nome, preco: p.precoPix, imagem: p.imagem, quantidade: 1 });
      salvarCarrinho();
      renderizarCarrinho();
    });
  });
  iniciarRotacaoPromo();
}

// ========== MENU MÓVEL ==========
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const aberto = navList.classList.toggle('ativo');
    navToggle.setAttribute('aria-expanded', aberto);
  });

  document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('ativo');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ========== INICIALIZAÇÃO ==========
// Título de ofertas conforme o dia (Domingou, Segundou, Terçou, Quartou, Quintou, Sextou, Sabadou)
function atualizarTituloOfertas() {
  const el = document.getElementById('titulo-ofertas');
  if (!el) return;
  const dias = ['DOMINGOU', 'SEGUNDOU', 'TERÇOU', 'QUARTOU', 'QUINTOU', 'SEXTOU', 'SABADOU'];
  const dia = new Date().getDay();
  el.textContent = dias[dia] + ' de ofertas';
}

// Normaliza id para comparação (ex.: 1 e "001" batem)
function normalizarIdSite(val) {
  if (val == null) return '';
  const s = String(val).trim();
  if (/^\d+$/.test(s)) return s.padStart(3, '0');
  return s;
}

function normalizarDiaSemana(val) {
  const s = String(val == null ? '' : val).trim().toLowerCase();
  const mapa = {
    segunda: 'SEGUNDA',
    terca: 'TERCA',
    terça: 'TERCA',
    quarta: 'QUARTA',
    quinta: 'QUINTA',
    sexta: 'SEXTA',
    sabado: 'SABADO',
    sábado: 'SABADO',
    domingo: 'DOMINGO'
  };
  return mapa[s] || String(val == null ? '' : val).trim().toUpperCase();
}

function diaSemanaHoje() {
  const dias = ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];
  return dias[new Date().getDay()];
}

function valorBooleano(v) {
  const s = String(v == null ? '' : v).trim().toLowerCase();
  return s === '1' || s === 'sim' || s === 'true' || s === 'yes' || s === 'y';
}

function statusAtivo(v) {
  const s = String(v == null ? '' : v).trim().toLowerCase();
  if (!s) return true;
  return s !== 'inativo' && s !== 'inactive' && s !== '0' && s !== 'false' && s !== 'nao' && s !== 'não';
}

function parseCsvSemicolon(texto) {
  const linhas = String(texto || '').split(/\r?\n/).filter(function (l) { return l && l.trim(); });
  if (linhas.length < 2) return [];
  const headers = linhas[0].split(';').map(function (h) { return h.trim(); });
  return linhas.slice(1).map(function (linha) {
    const cols = linha.split(';');
    const item = {};
    headers.forEach(function (h, i) { item[h] = (cols[i] || '').trim(); });
    return item;
  });
}

/**
 * Planilhas do repositório são UTF-8. Decodificar como Latin-1/Windows-1252
 * quebra acentos (ex.: Comestível -> Comestï¿½vel). Só usa fallback se UTF-8
 * tiver muitos caracteres de substituição (U+FFFD).
 */
async function lerTextoComFallbackEncoding(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('Falha ao carregar: ' + url);
  const buf = await r.arrayBuffer();
  const utf8 = new TextDecoder('utf-8').decode(buf);
  const ruins = (utf8.match(/\uFFFD/g) || []).length;
  if (ruins === 0 || ruins < utf8.length * 0.01) return utf8;
  const win1252 = new TextDecoder('windows-1252').decode(buf);
  const ruins1252 = (win1252.match(/\uFFFD/g) || []).length;
  return ruins1252 < ruins ? win1252 : utf8;
}

function textoSeguro(v) {
  return String(v == null ? '' : v).replace(/\uFFFD/g, '').trim();
}

function parsePrecoPlanilha(v) {
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v == null ? '' : v).replace(',', '.'));
  return Number.isNaN(n) ? 0 : n;
}

function normalizarCaminhoImagem(caminho) {
  const src = textoSeguro(caminho);
  if (!src) return '';
  if (/^https?:\/\//i.test(src)) return src;
  const normalizado = src.replace(/\\/g, '/');
  const idx = normalizado.toLowerCase().indexOf('/imagens/');
  if (idx >= 0) return normalizado.slice(idx + 1);
  return normalizado;
}

const FALLBACK_IMAGEM_VIBRADORES = {
  '1': 'imagens/Vibradores/001 - Vibrador Ponto G em Formato de Golfinho em ABS.png',
  '2': 'imagens/Vibradores/Basebal Bat Vibrador com Aparência Realística com 10 Modos Vai e Vem e Vibração.png',
  '3': 'imagens/Vibradores/Bullet Vibratório com 10 Modos de Vibração Recarregável e Controle por Aplicativo.png',
  '4': 'imagens/Vibradores/Estimulador Feminino Porquinho com 10 Modos de Ondas de Pressão.png',
  '5': 'imagens/Vibradores/Lilo Vibrador Varinha Mágica com 10 Modos de Vibrações .png',
  '6': 'imagens/Vibradores/Lipstick Vibe Vibrador em Formato de Batom Vibração.png',
  '7': 'imagens/Vibradores/Magesty Vibrador de Calcinha 9 Modos de Pulsação Controle Via APP.png',
  '8': 'imagens/Vibradores/Mini Toy Vibrador Varinha Mágica com 20 Modos de Vibrações e 8 Níveis e Velocidade.png',
  '9': 'imagens/Vibradores/Pretty Love Abner Bullet Wireless Via Bluetooth e 12 Modos de Vibração.png',
  '10': 'imagens/Vibradores/Sophie Vibrador Formato de Rosa com 10 Modos de Vibracao, Vai e Vem e Pulsacao.png',
  '11': 'imagens/Vibradores/Vibrador Bullet Hot Flowers.png',
  '12': 'imagens/Vibradores/Vibrador em Formato de pincel com 8 Modos de Vibração.png',
  '13': 'imagens/Vibradores/Female Vibrator Vibrador Ponto G com 30 Modos de Vibração.png',
  '14': 'imagens/Vibradores/Vibrador Ponto G com Estimulador de Clitóris Língua com 10 Modos de Vibração e Aquecimento.png',
  '15': 'imagens/Vibradores/Vibrador Recarregável com Glande e Estimulador Clitoriano Coelho com 12 Modos de Vibração.png'
};

/** Nomes UTF-8 oficiais (ids numéricos da planilha); evita exibir ? se o CSV vier com encoding errado. */
const NOME_PLANILHA_VIBRADORES_ID = {
  '1': 'Vibrador Ponto G em Formato de Golfinho em ABS',
  '2': 'Basebal Bat Vibrador com Aparência Realística com 10 Modos Vai e Vem e Vibração',
  '3': 'Bullet Vibratório com 10 Modos de Vibração Recarregável e Controle por Aplicativo',
  '4': 'Estimulador Feminino Porquinho com 10 Modos de Ondas de Pressão',
  '5': 'Lilo Vibrador Varinha Mágica com 10 Modos de Vibrações',
  '6': 'Lipstick Vibe Vibrador em Formato de Batom Vibração',
  '7': 'Magesty Vibrador de Calcinha 9 Modos de Pulsação Controle Via APP',
  '8': 'Mini Toy Vibrador Varinha Mágica com 20 Modos de Vibrações e 8 Níveis e Velocidade',
  '9': 'Pretty Love Abner Bullet Wireless Via Bluetooth e 12 Modos de Vibração',
  '10': 'Sophie Vibrador Formato de Rosa com 10 Modos de Vibracao, Vai e Vem e Pulsacao',
  '11': 'Vibrador Bullet Hot Flowers',
  '12': 'Vibrador em Formato de pincel com 8 Modos de Vibração',
  '13': 'Female Vibrator Vibrador Ponto G com 30 Modos de Vibração',
  '14': 'Vibrador Ponto G com Estimulador de Clitóris Língua com 10 Modos de Vibração e Aquecimento',
  '15': 'Vibrador Recarregável com Glande e Estimulador Clitoriano Coelho com 12 Modos de Vibração'
};

const FALLBACK_IMAGEM_COMESTICOS = {
  'kuloko gel dessensibilizante e excitante anal linha brasileirinhos 15g': 'imagens/Comesticos/Kuloko Gel Dessensibilizante e Excitante Anal Linha Brasileirinhos 15g.png',
  'xana loka gel excitante feminino linha brasileirinhos 15g': 'imagens/Comesticos/Xana Loka Gel Excitante Feminino Linha Brasileirinhos 15g.png',
  'calcinha comestivel yummy 1 unidade': 'imagens/Comesticos/Calcinha Comestível Yummy 1 Unidade.png',
  'aromatizante bucal power black ice spray 18ml hot flowers': 'imagens/Comesticos/Aromatizante Bucal Power Black Ice Spray 18ml Hot Flowers.png',
  'maxx babaloo caneta comestivel bala liquida em gel 20g': 'imagens/Comesticos/Maxx_Babaloo_Caneta_Comestível_Bala_Líquida_em_Gel_20g.png',
  'karamela tapa sexo comestivel formato coracao': 'imagens/Comesticos/Karamela Tapa Sexo Comestível Formato Coração.png',
  'gel termico beijavel yummy 15ml': 'imagens/Comesticos/Gel Térmico Beijável Yummy 15ml.png',
  'sedenta por garganta profunda dessensibilizante oral extra forte 18ml': 'imagens/Comesticos/Sedenta_por_Garganta_Profunda_Dessensibilizante_Oral_Extra_Forte_18ml.png',
  'gel adstringente sempre virgem 25g': 'imagens/Comesticos/Gel Adstringente Sempre Virgem 25g.png',
  '50 tons de liberdade bolinha com oleo de massagem corporal esquenta e esfria 3 unidades': 'imagens/Comesticos/50 Tons de Liberdade Bolinha com Óleo de Massagem Corporal Esquenta e Esfria 3 Unidades.png',
  'uisquenta bolinhas em capsula 3 unidades': 'imagens/Comesticos/Uisquenta Bolinhas em Cápsula 3 Unidades.png',
  'power honey energia e disposicao suplemento alimentar liquido unissex 1 unidade 10g': 'imagens/Comesticos/Power Honey Energia e Disposição Suplemento Alimentar Liquido Unissex 1 unidade 10g.png',
  'hot ball xana loka esquenta esfria e vibra': 'imagens/Comesticos/Hot Ball Xana Loka Esquenta Esfria e Vibra.png',
  'cliv intt dessensibilizante anal 17g': 'imagens/Comesticos/Cliv Intt Dessensibilizante Anal 17g .png',
  'love lub lapilove lubrificante corporal beijavel 60g': 'imagens/Comesticos/Love Lub LapiLove Lubrificante Corporal Beijável 60g.png',
  'babasoul sexy hidratante beijavel 280ml': 'imagens/Comesticos/Babasoul Sexy Hidratante Beijável 280ml.png',
  'vibration gel excitante que vibra power sabor mel 17ml': 'imagens/Comesticos/Vibration Gel Excitante que Vibra Power Sabor Mel 17ml.png',
  'vibration gel excitante que vibra sabor chiclete 17ml': 'imagens/Comesticos/Vibration Gel Excitante que Vibra Sabor Chiclete 17ml.png',
  "babalub lubrificante beijavel a base d'agua 50ml": 'imagens/Comesticos/Babalub_Lubrificante_Beijável_à_Base_d_Água_50ml.png',
  'gel clitoriano aquece pulsa e vibra 17g linha deborah secco': 'imagens/Comesticos/Gel Clitoriano Aquece Pulsa e Vibra 17g Linha Deborah Secco.png',
  'blow girl gel aromatizante beijavel para virilha 320ml': 'imagens/Comesticos/Blow Girl Gel Aromatizante Beijável Para Virilha 320ml.png',
  'lis-in gel dessensibilizante anal 30g': 'imagens/Comesticos/LIS-In Gel Dessensibilizante Anal 30g.png'
};

const FALLBACK_IMAGEM_ACESSORIOS = {
  'vela beijavel algodao doce hot para massagem 50g': 'imagens/Acessorios/Vela Beijável Algodão Doce Hot para Massagem 50g.png',
  'fogo da paixao vela de massagem beijavel com glitter 20g': 'imagens/Acessorios/Fogo da Paixão Vela de Massagem Beijável com Glitter 20g.png',
  'funny egg masturbador masculino formato vagina em cyberskin': 'imagens/Acessorios/Funny Egg Masturbador Masculino Formato Vagina em Cyberskin.png'
};

const FALLBACK_IMAGEM_COMESTICOS_ID = {
  'kuloko-gel': 'imagens/Comesticos/Kuloko Gel Dessensibilizante e Excitante Anal Linha Brasileirinhos 15g.png',
  'xana-loka-gel': 'imagens/Comesticos/Xana Loka Gel Excitante Feminino Linha Brasileirinhos 15g.png',
  'calcinha-comestivel-yummy': 'imagens/Comesticos/Calcinha Comestível Yummy 1 Unidade.png',
  'aromatizante-bucal-power-black-ice': 'imagens/Comesticos/Aromatizante Bucal Power Black Ice Spray 18ml Hot Flowers.png',
  'maxx-babaloo-caneta-a': 'imagens/Comesticos/Maxx_Babaloo_Caneta_Comestível_Bala_Líquida_em_Gel_20g.png',
  'maxx-babaloo-caneta-b': 'imagens/Comesticos/Maxx_Babaloo_Caneta_Comestível_Bala_Líquida_em_Gel_20g.png',
  'karamela-tapa-sexo-comestivel': 'imagens/Comesticos/Karamela Tapa Sexo Comestível Formato Coração.png',
  'gel-termico-beijavel-yummy': 'imagens/Comesticos/Gel Térmico Beijável Yummy 15ml.png',
  'sedenta-garganta-profunda': 'imagens/Comesticos/Sedenta_por_Garganta_Profunda_Dessensibilizante_Oral_Extra_Forte_18ml.png',
  'gel-adstringente-sempre-virgem': 'imagens/Comesticos/Gel Adstringente Sempre Virgem 25g.png',
  '50-tons-liberdade-bolinha': 'imagens/Comesticos/50 Tons de Liberdade Bolinha com Óleo de Massagem Corporal Esquenta e Esfria 3 Unidades.png',
  'uisquenta-bolinhas-capsula': 'imagens/Comesticos/Uisquenta Bolinhas em Cápsula 3 Unidades.png',
  'power-honey-10g': 'imagens/Comesticos/Power Honey Energia e Disposição Suplemento Alimentar Liquido Unissex 1 unidade 10g.png',
  'hot-ball-xana-loka': 'imagens/Comesticos/Hot Ball Xana Loka Esquenta Esfria e Vibra.png',
  'cliv-intt-dessensibilizante-anal': 'imagens/Comesticos/Cliv Intt Dessensibilizante Anal 17g .png',
  'love-lub-lapilove': 'imagens/Comesticos/Love Lub LapiLove Lubrificante Corporal Beijável 60g.png',
  'babasoul-sexy-hidratante': 'imagens/Comesticos/Babasoul Sexy Hidratante Beijável 280ml.png',
  'vibration-gel-power-mel': 'imagens/Comesticos/Vibration Gel Excitante que Vibra Power Sabor Mel 17ml.png',
  'vibration-gel-chiclete': 'imagens/Comesticos/Vibration Gel Excitante que Vibra Sabor Chiclete 17ml.png',
  'babalub-lubrificante-beijavel': 'imagens/Comesticos/Babalub_Lubrificante_Beijável_à_Base_d_Água_50ml.png',
  'gel-clitoriano-deborah-secco': 'imagens/Comesticos/Gel Clitoriano Aquece Pulsa e Vibra 17g Linha Deborah Secco.png',
  'blow-girl-virilha-320ml': 'imagens/Comesticos/Blow Girl Gel Aromatizante Beijável Para Virilha 320ml.png',
  'lis-in-gel-30g': 'imagens/Comesticos/LIS-In Gel Dessensibilizante Anal 30g.png'
};

const FALLBACK_IMAGEM_ACESSORIOS_ID = {
  'vela-beijavel-algodao-doce-50g': 'imagens/Acessorios/D_NQ_NP_894200-MLB89127477520_082025-O-removebg-preview.png',
  'fogo-da-paixao-vela-20g': 'imagens/Acessorios/Fogo_da_Paixão_Vela_de_Massagem_Beijável_com_Glitter_20g-removebg-preview.png',
  'funny-egg-masturbador': 'imagens/Acessorios/Funny Egg Masturbador Masculino Formato Vagina em Cyberskin.png'
};

const FALLBACK_CATEGORIA_PADRAO = {
  Comesticos: 'imagens/Comesticos/Aromatizante Bucal Power Black Ice Spray 18ml Hot Flowers.png',
  Acessorios: 'imagens/Acessorios/Funny Egg Masturbador Masculino Formato Vagina em Cyberskin.png',
  Vibradores: 'imagens/Vibradores/001 - Vibrador Ponto G em Formato de Golfinho em ABS.png',
  Lingerie: 'imagens/Lingerie/HL074-U-Rosa-Claro-com-Branco_1-.webp',
  Fetiche_Sado: 'imagens/Fetiche_Sado/Chabata.png'
};

function chaveNomeProduto(v) {
  return String(v == null ? '' : v)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugBasico(v) {
  return chaveNomeProduto(v).replace(/'/g, '').replace(/\s+/g, '-');
}

function fallbackImagemPorCategoriaEId(categoria, idOriginal, nomeOriginal) {
  const idSlug = slugBasico(idOriginal);
  const nomeSlug = slugBasico(nomeOriginal);
  if (categoria === 'Comesticos') {
    return FALLBACK_IMAGEM_COMESTICOS_ID[idSlug] ||
      FALLBACK_IMAGEM_COMESTICOS_ID[nomeSlug] ||
      FALLBACK_IMAGEM_COMESTICOS[chaveNomeProduto(nomeOriginal)] ||
      '';
  }
  if (categoria === 'Acessorios') {
    return FALLBACK_IMAGEM_ACESSORIOS_ID[idSlug] ||
      FALLBACK_IMAGEM_ACESSORIOS_ID[nomeSlug] ||
      FALLBACK_IMAGEM_ACESSORIOS[chaveNomeProduto(nomeOriginal)] ||
      '';
  }
  return '';
}

function fallbackImagemGenericoCategoria(categoria) {
  return FALLBACK_CATEGORIA_PADRAO[categoria] || '';
}

function normalizarCategoriaProduto(v) {
  const raw = String(v == null ? '' : v).trim();
  if (!raw) return 'Vibradores';
  const slug = raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' e ')
    .replace(/[^a-z0-9]+/g, '');
  if (slug === 'comesticos' || slug === 'cosmeticos') return 'Comesticos';
  if (slug === 'fetichesado') return 'Fetiche_Sado';
  if (slug === 'vibradores') return 'Vibradores';
  if (slug === 'lingerie') return 'Lingerie';
  if (slug === 'acessorios' || slug === 'acessorio') return 'Acessorios';
  const legacy = ['Comesticos', 'Fetiche_Sado', 'Vibradores', 'Lingerie', 'Acessorios'];
  if (legacy.indexOf(raw) >= 0) return raw;
  return raw || 'Vibradores';
}

function aplicarOfertasNosProdutos(ofertas) {
  const hoje = diaSemanaHoje();
  const idsOferta = new Set();

  PRODUTOS.forEach(function (p) {
    if (p.precoBase == null) p.precoBase = precoNumerico(p);
    p.preco = p.precoBase;
    if (p.desconto != null) delete p.desconto;
  });

  (ofertas || []).forEach(function (row) {
    const ativo = statusAtivo(row.ativo);
    if (!ativo) return;
    const tipo = String(row.tipo_oferta || '').trim().toUpperCase();
    const dia = normalizarDiaSemana(row.dia_semana);
    const id = normalizarIdSite(row.id_produto);
    if (!id) return;
    if (tipo === 'RELAMPAGO') {
      idsOferta.add(id);
      return;
    }
    if (tipo === 'DIA' && dia === hoje) {
      idsOferta.add(id);
    }
  });

  PRODUTOS.forEach(function (p) {
    if (!idsOferta.has(normalizarIdSite(p.id))) return;
    p.desconto = 20;
    const base = p.precoBase != null ? p.precoBase : precoNumerico(p);
    p.preco = Number((base * 0.8).toFixed(2));
  });
}

function montarProdutosPromoDaPlanilha(ofertas) {
  const lista = [];
  (ofertas || []).forEach(function (row) {
    const ativo = statusAtivo(row.ativo);
    const tipo = String(row.tipo_oferta || '').trim().toUpperCase();
    if (!ativo || tipo !== 'RELAMPAGO') return;
    const id = normalizarIdSite(row.id_produto);
    if (!id) return;
    const p = PRODUTOS.find(function (x) { return normalizarIdSite(x.id) === id; });
    if (!p) return;
    const imagem = (p.imagens && p.imagens.length ? p.imagens[0] : p.imagem) || '';
    const precoDe = p.precoBase != null ? p.precoBase : precoNumerico(p);
    const precoOferta = precoNumerico(p);
    if (precoOferta <= 0) return;
    lista.push({
      id: p.id,
      nome: p.nome,
      imagem: imagem,
      precoDe: precoDe,
      precoPix: precoOferta,
      descontoPix: 20,
      descricao: row.observacoes || ''
    });
  });
  PRODUTOS_PROMO = lista;
}

// Carrega dados da planilha (dados/produtos.json). Por id: atualiza ou adiciona produto com os valores da planilha.
async function carregarDadosPlanilha() {
  let mapaComesticosImg = {};
  let mapaDescricoesProduto = {};
  try {
    const rMap = await fetch('dados/comesticos_imagens.json');
    if (rMap.ok) mapaComesticosImg = await rMap.json();
  } catch (eMap) {}
  try {
    const rDesc = await fetch('dados/descricoes_produtos.json');
    if (rDesc.ok) mapaDescricoesProduto = await rDesc.json();
  } catch (eDesc) {}

  try {
    let linhas = [];
    try {
      const csv = await lerTextoComFallbackEncoding(
        'dados/planilha_atualizacao_produtos.csv?v=' + VERSAO_PLANILHA_PRODUTOS
      );
      linhas = parseCsvSemicolon(csv);
    } catch (eCsv) {}

    if (linhas.length === 0) {
      const rjson = await fetch('dados/produtos.json');
      if (!rjson.ok) return;
      const baseJson = await rjson.json();
      if (!Array.isArray(baseJson) || baseJson.length === 0) return;
      // Fallback: mantem compatibilidade quando so existir JSON.
      return;
    }

    const novos = [];
    for (const row of linhas) {
      const idOriginal = String(row.id == null ? '' : row.id).trim();
      const idPlanilha = normalizarIdSite(idOriginal);
      if (!idPlanilha) continue;
      if (!statusAtivo(row.status)) continue;

      const imagensLista = String(row.imagens == null ? '' : row.imagens)
        .split('|')
        .map(function (x) { return normalizarCaminhoImagem(x); })
        .filter(Boolean);
      let imagemUnica = normalizarCaminhoImagem(row.imagem);
      const categoria = normalizarCategoriaProduto(textoSeguro(row.categoria));
      if (categoria === 'Comesticos' && mapaComesticosImg[idOriginal]) {
        imagemUnica = normalizarCaminhoImagem(mapaComesticosImg[idOriginal]);
      }
      if (categoria === 'Vibradores' && (!imagemUnica || imagemUnica.indexOf('?') >= 0) && FALLBACK_IMAGEM_VIBRADORES[idOriginal]) {
        imagemUnica = FALLBACK_IMAGEM_VIBRADORES[idOriginal];
      }
      if (categoria === 'Comesticos' && (!imagemUnica || imagemUnica.indexOf('?') >= 0 || imagemUnica.indexOf('�') >= 0)) {
        imagemUnica = fallbackImagemPorCategoriaEId(categoria, idOriginal, row.nome) || imagemUnica;
      }
      if (categoria === 'Acessorios' && (!imagemUnica || imagemUnica.indexOf('?') >= 0 || imagemUnica.indexOf('�') >= 0)) {
        imagemUnica = fallbackImagemPorCategoriaEId(categoria, idOriginal, row.nome) || imagemUnica;
      }
      const preco = parsePrecoPlanilha(row.preco);

      const nomePlanilha = textoSeguro(row.nome) || idOriginal;
      const nomeFinal = NOME_PLANILHA_VIBRADORES_ID[idOriginal] || nomePlanilha;
      const item = {
        id: idOriginal,
        nome: nomeFinal,
        preco: preco > 0 ? preco : 0,
        categoria: categoria,
        maisVendido: valorBooleano(row.mais_vendido),
        status: textoSeguro(row.status) || 'ATIVO'
      };

      if (imagensLista.length > 0) item.imagens = imagensLista;
      else if (imagemUnica) item.imagem = imagemUnica;

      var descPlanilha = row.descricao != null ? textoSeguro(row.descricao) : '';
      var descJson = mapaDescricoesProduto[idOriginal] ? textoSeguro(mapaDescricoesProduto[idOriginal]) : '';
      if (descPlanilha) item.descricao = descPlanilha;
      else if (descJson) item.descricao = descJson;

      novos.push(item);
    }

    if (novos.length > 0) {
      PRODUTOS.splice(0, PRODUTOS.length, ...novos);
    }
  } catch (e) { /* mantém apenas PRODUTOS do script */ }
}

async function carregarPlanilhaOfertas() {
  try {
    const texto = await lerTextoComFallbackEncoding('dados/planilha_ofertas.csv');
    const ofertas = parseCsvSemicolon(texto);
    if (!ofertas.length) return;
    aplicarOfertasNosProdutos(ofertas);
    montarProdutosPromoDaPlanilha(ofertas);
  } catch (e) { /* sem ofertas, mantém preços padrão */ }
}

function configurarOrdenacao() {
  const select = document.getElementById('ordenar-por');
  if (!select) return;
  if (ordenacaoAtiva === 'procurado') ordenacaoAtiva = 'mais_vendidos';
  if (ordenacaoAtiva === 'barato') ordenacaoAtiva = 'menor_preco';
  select.value = ordenacaoAtiva;
  select.addEventListener('change', function () {
    ordenacaoAtiva = select.value;
    localStorage.setItem('caixasecreta_ordenacao', ordenacaoAtiva);
    renderizarProdutos();
  });
}

function init() {
  if (!MOSTRAR_PROMO_RELAMPAGO) {
    const secaoPromo = document.getElementById('promo-relampago');
    if (secaoPromo) secaoPromo.hidden = true;
    document.querySelectorAll('a[href="index.html#promo-relampago"], a[href="#promo-relampago"]').forEach(function (a) {
      a.style.display = 'none';
    });
  }

  atualizarTituloOfertas();
  renderizarAbas();
  configurarOrdenacao();
  configurarBusca();
  renderizarProdutos();
  renderizarMaisVendidos();
  renderizarCarrinho();
  if (MOSTRAR_PROMO_RELAMPAGO) {
    renderizarPromo();
    atualizarCountdown();
    setInterval(atualizarCountdown, 1000);
  }
  updateContadorCarrinho();
  if (MOSTRAR_PROMO_RELAMPAGO) {
    window.addEventListener('resize', function () {
      if (window.__promoResizeTimer) clearTimeout(window.__promoResizeTimer);
      window.__promoResizeTimer = setTimeout(function () {
        promoRotacaoIndex = 0;
        renderizarPromo();
      }, 180);
    });
  }
}

carregarDadosPlanilha().then(carregarPlanilhaOfertas).then(init);
