const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'dados', 'planilha_atualizacao_produtos.csv');
const desc =
  'Acenda o clima e transforme o momento. Vela beijável com aroma de algodão doce que derrete em óleo morno para massagem corporal — hidrata a pele e convida ao toque. Ideal para esquentar a relação e explorar novas sensações com leveza. Destaque: derrete em óleo para massagem, sabor beijável e momento íntimo.';
const lines = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n').split('\n');
if (!lines[0].includes('descricao')) {
  lines[0] = lines[0].trimEnd() + ';descricao';
}
const out = [lines[0]];
const targetCols = lines[0].split(';').length;
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) {
    out.push(line);
    continue;
  }
  const parts = line.split(';');
  if (parts.length >= targetCols) {
    out.push(line);
    continue;
  }
  if (line.startsWith('vela-beijavel-algodao-doce-50g;')) {
    out.push(line + ';' + desc);
  } else {
    out.push(line + ';');
  }
}
fs.writeFileSync(p, out.join('\n'), 'utf8');
