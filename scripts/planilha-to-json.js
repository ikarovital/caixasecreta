/**
 * Lê imagens/docs/Planilha_Produtos.xlsx e gera dados/produtos.json.
 * Colunas esperadas: id, nome, preco, categoria, imagem, imagem_costa
 * Rode: npm run atualizar-produtos
 */

const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const raiz = path.join(__dirname, '..');
const planilhaPath = path.join(raiz, 'imagens', 'docs', 'Planilha_Produtos.xlsx');
const saidaPath = path.join(raiz, 'dados', 'produtos.json');

if (!fs.existsSync(planilhaPath)) {
  console.warn('Aviso: Planilha_Produtos.xlsx não encontrada em imagens/docs/. Gerando produtos.json vazio.');
  fs.writeFileSync(saidaPath, '[]', 'utf8');
  process.exit(0);
}

const workbook = XLSX.readFile(planilhaPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

// Normaliza para comparação (remove acentos, lowercase)
function normalizarCol(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\u0300-\u036f/g, '');
}

const col = (obj, key) => {
  const keyNorm = normalizarCol(key);
  const k = Object.keys(obj).find((x) => x && normalizarCol(x) === keyNorm);
  return k != null ? (obj[k] != null ? String(obj[k]).trim() : '') : '';
};

// Mantém id como texto; se for só número, pad (1 -> "001") para bater com imagens 001.png
function normalizarId(val) {
  const s = String(val).trim();
  if (!s) return '';
  if (/^\d+$/.test(s)) return s.padStart(3, '0');
  return s;
}

const produtos = [];
for (const row of rows) {
  const id = normalizarId(col(row, 'id'));
  if (!id) continue;

  const nome = col(row, 'nome');
  const precoRaw = col(row, 'preco') || col(row, 'preço');
  // Aceita número (10), texto "10,00" ou "R$ 10,00"
  const precoStr = String(precoRaw).replace(/\s/g, '').replace(/R\$/gi, '').replace(',', '.').trim();
  const preco = parseFloat(precoStr) || 0;
  const categoria = col(row, 'categoria');
  const imagem = col(row, 'imagem');
  const imagemCosta = col(row, 'imagem_costa');

  const item = { id };
  if (nome) item.nome = nome;
  if (preco > 0) item.preco = preco;
  if (categoria) item.categoria = categoria;
  if (imagem) {
    if (imagemCosta) {
      item.imagens = [imagem, imagemCosta];
    } else {
      item.imagem = imagem;
    }
  } else if (imagemCosta) {
    item.imagem = imagemCosta;
  }

  produtos.push(item);
}

fs.writeFileSync(saidaPath, JSON.stringify(produtos, null, 2), 'utf8');
console.log('Produtos gerados:', produtos.length, '-> dados/produtos.json');
