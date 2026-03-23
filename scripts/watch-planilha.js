/**
 * Observa a planilha e gera dados/produtos.json sempre que ela for salva.
 * Rode: npm run watch-planilha
 * Deixe rodando enquanto edita a planilha; o site (ao recarregar) verá os dados atualizados.
 */

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const raiz = path.join(__dirname, '..');
const planilhaPath = path.join(raiz, 'imagens', 'docs', 'Planilha_Produtos.xlsx');
const pastaDocs = path.join(raiz, 'imagens', 'docs');

function gerar() {
  const child = spawn('node', [path.join(__dirname, 'planilha-to-json.js')], {
    cwd: raiz,
    stdio: 'inherit'
  });
  child.on('close', (code) => {
    if (code === 0) console.log('[watch] dados/produtos.json atualizado.');
  });
}

if (!fs.existsSync(pastaDocs)) {
  console.error('Pasta imagens/docs não encontrada.');
  process.exit(1);
}

console.log('Observando a planilha. Salve o arquivo para atualizar o JSON.');
console.log('Arquivo:', planilhaPath);
console.log('Ctrl+C para parar.\n');

gerar();

fs.watch(pastaDocs, (event, filename) => {
  if (filename && (filename.endsWith('.xlsx') || filename.endsWith('.xls'))) {
    console.log('\n[watch] Planilha alterada, gerando JSON...');
    gerar();
  }
});
