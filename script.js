/**
 * Caixa Secreta – Catálogo e carrinho com finalização via WhatsApp
 * Número WhatsApp: 5511918535361
 */

// ========== DADOS DOS PRODUTOS ==========
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
    imagem: 'imagens/Vibradores/Magesty Vibrador de Calcinha 9 Modos de Pulsação Controle Via APP.png',
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
  }
];

const WHATSAPP_NUMERO = '5511918535361';

// ========== ESTADO ==========
let carrinho = JSON.parse(localStorage.getItem('caixasecreta_carrinho')) || [];
let categoriaAtiva = 'todos';

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
const carrinhoTotal = document.getElementById('carrinho-total');
const btnFinalizarWhatsApp = document.getElementById('btn-finalizar-whatsapp');

// ========== CATEGORIAS ==========
function obterCategorias() {
  const cats = new Set(PRODUTOS.map(p => p.categoria));
  return ['todos', ...Array.from(cats)];
}

function renderizarAbas() {
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

// ========== PRODUTOS ==========
function produtosFiltrados() {
  if (categoriaAtiva === 'todos') return PRODUTOS;
  return PRODUTOS.filter(p => p.categoria === categoriaAtiva);
}

function renderizarProdutos() {
  const lista = produtosFiltrados();
  produtosGrid.innerHTML = lista.map(p => `
    <article class="produto-card" data-id="${p.id}">
      <div class="produto-img-wrap">
        <img src="${p.imagem}" alt="${p.nome}" loading="lazy" onerror="this.parentElement.style.background='var(--roxo-escuro)'">
      </div>
      <div class="produto-info">
        <h3 class="produto-nome">${p.nome}</h3>
        <p class="produto-preco">${formatarPreco(p.preco)}</p>
        <button type="button" class="btn btn-carrinho" data-id="${p.id}">Adicionar ao carrinho</button>
      </div>
    </article>
  `).join('');

  produtosGrid.querySelectorAll('.btn-carrinho').forEach(btn => {
    btn.addEventListener('click', () => adicionarAoCarrinho(btn.dataset.id));
  });
}

// ========== CARRINHO ==========
function adicionarAoCarrinho(id) {
  const produto = PRODUTOS.find(p => p.id === id);
  if (!produto) return;
  const item = carrinho.find(i => i.id === id);
  if (item) item.quantidade += 1;
  else carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, imagem: produto.imagem, quantidade: 1 });
  salvarCarrinho();
  renderizarCarrinho();
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
  carrinhoLista.innerHTML = '';
  if (carrinho.length === 0) {
    carrinhoVazio.hidden = false;
    carrinhoTotalWrap.hidden = true;
    return;
  }
  carrinhoVazio.hidden = true;
  carrinhoTotalWrap.hidden = false;
  carrinhoTotal.textContent = formatarPreco(totalCarrinho());

  carrinho.forEach(item => {
    const div = document.createElement('div');
    div.className = 'carrinho-item';
    div.innerHTML = `
      <img class="carrinho-item-img" src="${item.imagem}" alt="" onerror="this.style.display='none'">
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

// ========== WHATSAPP ==========
function montarMensagemPedido() {
  const linhas = ['*Pedido Caixa Secreta*', ''];
  carrinho.forEach(i => {
    linhas.push(`• ${i.nome}`);
    linhas.push(`  ${i.quantidade}x ${formatarPreco(i.preco)}`);
  });
  linhas.push('');
  linhas.push(`*Total: ${formatarPreco(totalCarrinho())}*`);
  return encodeURIComponent(linhas.join('\n'));
}

function finalizarViaWhatsApp(e) {
  e.preventDefault();
  if (carrinho.length === 0) return;
  const texto = montarMensagemPedido();
  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`;
  window.open(url, '_blank', 'noopener,noreferrer');
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
btnFinalizarWhatsApp.addEventListener('click', finalizarViaWhatsApp);
renderizarAbas();
renderizarProdutos();
renderizarCarrinho();
