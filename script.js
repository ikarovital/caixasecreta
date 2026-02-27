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
    id: 'ponto-g-golfinho',
    nome: 'Vibrador Ponto G em Formato de Golfinho em ABS',
    preco: 89.9,
    imagem: 'imagens/Vibradores/Vibrador Ponto G em Formato de Golfinho em ABS.png',
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

// ========== PROMOÇÃO RELÂMPAGO ==========
// Data/hora em que a promoção termina (edite aqui: ano, mês-1, dia, hora, min, seg)
const PROMO_FIM = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
PROMO_FIM.setHours(23, 59, 59, 999);

// Produtos da promoção: coloque as imagens em imagens/promocao relampago/ e adicione aqui
const PRODUTOS_PROMO = [
  // Exemplo (descomente e edite quando tiver imagens):
  // { id: 'promo-1', nome: 'Nome do produto', imagem: 'imagens/promocao relampago/sua-imagem.png', precoDe: 50, precoPix: 37.50, descontoPix: 25, parcelas: '10x de R$ 3,75 sem juros' }
];

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
const carrinhoSubtotal = document.getElementById('carrinho-subtotal');
const carrinhoTotal = document.getElementById('carrinho-total');
const btnFinalizarWhatsApp = document.getElementById('btn-finalizar-whatsapp');

// Frete: compras >= 120 = grátis. Abaixo: SP = R$ 15, demais = R$ 25
const FRETE_MINIMO_GRATIS = 120;
const FRETE_SP = 15;
const FRETE_OUTROS = 25;

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
  produtosGrid.innerHTML = lista.map(p => {
    const imgs = p.imagens && p.imagens.length ? p.imagens : [p.imagem];
    const imgHtml = imgs.map((src, i) =>
      `<img src="${src}" alt="${p.nome} ${i === 0 ? '(frente)' : '(costas)'}" loading="lazy" onerror="this.parentElement.style.background='var(--fundo)'">`
    ).join('');
    return `
    <article class="produto-card" data-id="${p.id}">
      <div class="produto-img-wrap ${imgs.length > 1 ? 'produto-img-wrap--dupla' : ''}">
        ${imgHtml}
      </div>
      <div class="produto-info">
        <h3 class="produto-nome">${p.nome}</h3>
        <p class="produto-preco">${formatarPreco(p.preco)}</p>
        <button type="button" class="btn btn-carrinho" data-id="${p.id}">Adicionar ao carrinho</button>
      </div>
    </article>
  `;
  }).join('');

  produtosGrid.querySelectorAll('.btn-carrinho').forEach(btn => {
    btn.addEventListener('click', () => adicionarAoCarrinho(btn.dataset.id));
  });
}

// ========== CARRINHO ==========
function adicionarAoCarrinho(id) {
  const produto = PRODUTOS.find(p => p.id === id);
  if (!produto) return;
  const img = (produto.imagens && produto.imagens[0]) || produto.imagem;
  const item = carrinho.find(i => i.id === id);
  if (item) item.quantidade += 1;
  else carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, imagem: img, quantidade: 1 });
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
  const subtotal = totalCarrinho();
  if (carrinhoSubtotal) carrinhoSubtotal.textContent = formatarPreco(subtotal);
  if (carrinhoTotal) carrinhoTotal.textContent = formatarPreco(subtotal);

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

// ========== MODAL CADASTRO + FRETE + WHATSAPP ==========
let freteCalculado = null;
let enderecoCep = null;

const modalFinalizar = document.getElementById('modal-finalizar');
const formFinalizar = document.getElementById('form-finalizar');
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

function abrirModalFinalizar() {
  if (carrinho.length === 0) return;
  freteCalculado = null;
  enderecoCep = null;
  if (modalSubtotal) modalSubtotal.textContent = formatarPreco(totalCarrinho());
  if (resumoFrete) resumoFrete.hidden = true;
  if (cepMsg) { cepMsg.textContent = ''; cepMsg.className = 'form-msg'; }
  if (cepEndereco) cepEndereco.textContent = '';
  if (formFinalizar) formFinalizar.reset();
  if (modalFinalizar) {
    modalFinalizar.classList.add('ativo');
    modalFinalizar.setAttribute('aria-hidden', 'false');
  }
}

function fecharModalFinalizar() {
  if (modalFinalizar) {
    modalFinalizar.classList.remove('ativo');
    modalFinalizar.setAttribute('aria-hidden', 'true');
  }
}

function calcularFreteValor(uf) {
  const subtotal = totalCarrinho();
  if (subtotal >= FRETE_MINIMO_GRATIS) return 0;
  return uf === 'SP' ? FRETE_SP : FRETE_OUTROS;
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
      if (modalTotal) modalTotal.textContent = formatarPreco(totalCarrinho() + freteCalculado);
    })
    .catch(() => {
      if (cepMsg) { cepMsg.textContent = 'Erro ao buscar CEP. Tente de novo.'; cepMsg.className = 'form-msg erro'; }
    });
}

function montarMensagemPedidoCompleta(nome, telefone, pagamento) {
  const subtotal = totalCarrinho();
  const frete = freteCalculado !== null ? freteCalculado : 0;
  const total = subtotal + frete;
  const linhas = ['*Pedido Caixa Secreta*', '', `*Nome:* ${nome}`, `*WhatsApp:* ${telefone}`];
  if (enderecoCep) {
    linhas.push(`*Endereço:* ${enderecoCep.logradouro || ''} ${enderecoCep.bairro || ''}, ${enderecoCep.localidade || ''} - ${enderecoCep.uf || ''}, CEP ${cadastroCep.value}`);
  }
  linhas.push('');
  carrinho.forEach(i => {
    linhas.push(`• ${i.nome}`);
    linhas.push(`  ${i.quantidade}x ${formatarPreco(i.preco)}`);
  });
  linhas.push('');
  linhas.push(`*Subtotal:* ${formatarPreco(subtotal)}`);
  linhas.push(`*Frete:* ${frete === 0 ? 'Grátis' : formatarPreco(frete)}`);
  linhas.push(`*Total:* ${formatarPreco(total)}`);
  linhas.push(`*Forma de pagamento:* ${pagamento}`);
  return encodeURIComponent(linhas.join('\n'));
}

btnFinalizarWhatsApp.addEventListener('click', (e) => {
  e.preventDefault();
  abrirModalFinalizar();
});

document.getElementById('modal-fechar').addEventListener('click', fecharModalFinalizar);
if (modalFinalizar) {
  modalFinalizar.addEventListener('click', (e) => { if (e.target === modalFinalizar) fecharModalFinalizar(); });
}

if (cadastroCep) {
  cadastroCep.addEventListener('input', () => { cadastroCep.value = formatarCep(cadastroCep.value); });
}
if (btnCalcularFrete) btnCalcularFrete.addEventListener('click', buscarCep);

if (formFinalizar) {
  formFinalizar.addEventListener('submit', (e) => {
    e.preventDefault();
    if (carrinho.length === 0) return;
    const nome = cadastroNome.value.trim();
    const telefone = cadastroTelefone.value.trim();
    const pagamento = formFinalizar.querySelector('input[name="pagamento"]:checked');
    if (!nome || !telefone) {
      alert('Preencha nome e WhatsApp.');
      return;
    }
    if (freteCalculado === null) {
      alert('Informe o CEP e clique em Calcular frete.');
      return;
    }
    if (!pagamento) {
      alert('Escolha a forma de pagamento (Pix ou Cartão de crédito).');
      return;
    }
    const texto = montarMensagemPedidoCompleta(nome, telefone, pagamento.value);
    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    fecharModalFinalizar();
  });
}

// ========== PROMOÇÃO RELÂMPAGO: COUNTDOWN E LISTA ==========
function atualizarCountdown() {
  const agora = new Date();
  const fim = new Date(PROMO_FIM);
  if (agora >= fim) {
    document.getElementById('promo-dias').textContent = '00';
    document.getElementById('promo-horas').textContent = '00';
    document.getElementById('promo-min').textContent = '00';
    document.getElementById('promo-seg').textContent = '00';
    return;
  }
  const diff = fim - agora;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seg = Math.floor((diff % (1000 * 60)) / 1000);
  const pad = (n) => String(n).padStart(2, '0');
  document.getElementById('promo-dias').textContent = pad(dias);
  document.getElementById('promo-horas').textContent = pad(horas);
  document.getElementById('promo-min').textContent = pad(min);
  document.getElementById('promo-seg').textContent = pad(seg);
}

function renderizarPromo() {
  const el = document.getElementById('promo-produtos');
  if (!el) return;
  if (PRODUTOS_PROMO.length === 0) {
    el.innerHTML = '<p class="promo-vazio">Em breve: coloque imagens na pasta <strong>imagens/promocao relampago</strong> e adicione os produtos no script.js (PRODUTOS_PROMO).</p>';
    return;
  }
  el.innerHTML = PRODUTOS_PROMO.map(p => `
    <div class="promo-item" data-id="${p.id}">
      <div class="promo-item-img-wrap">
        <img src="${p.imagem}" alt="${p.nome}" onerror="this.parentElement.style.background='var(--fundo)'">
      </div>
      <div class="promo-item-info">
        <p class="promo-item-nome">${p.nome}</p>
        ${p.descricao ? `<p class="promo-item-desc">${p.descricao}</p>` : ''}
        ${p.descontoPix ? `<span class="promo-item-badge">${p.descontoPix}% OFF no PIX</span>` : ''}
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

atualizarTituloOfertas();
renderizarAbas();
renderizarProdutos();
renderizarCarrinho();
renderizarPromo();
atualizarCountdown();
setInterval(atualizarCountdown, 1000);
