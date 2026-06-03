import https from 'node:https';

const SERVICOS = [
  { codigo: '04510', nome: 'PAC' },
  { codigo: '04014', nome: 'SEDEX' }
];

const CORREIOS_URL = 'https://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx';

function parseCorreiosXml(xml) {
  const options = [];
  const blocks = xml.split(/<cServico>/i).slice(1);
  for (const block of blocks) {
    const codigo = (block.match(/<Codigo>\s*(\d+)\s*<\/Codigo>/i) || [])[1];
    const valorRaw = (block.match(/<Valor>\s*([^<]+)\s*<\/Valor>/i) || [])[1];
    const prazo = (block.match(/<PrazoEntrega>\s*(\d+)\s*<\/PrazoEntrega>/i) || [])[1];
    const erro = (block.match(/<Erro>\s*(\d+)\s*<\/Erro>/i) || [])[1];
    if (erro && erro !== '0') continue;
    const valor = Number(String(valorRaw || '').replace(',', '.'));
    if (!Number.isFinite(valor) || valor <= 0) continue;
    const meta = SERVICOS.find((s) => s.codigo === codigo);
    options.push({
      codigo,
      nome: meta?.nome || `Serviço ${codigo}`,
      valor: Math.round(valor * 100) / 100,
      prazo: prazo ? Number(prazo) : null
    });
  }
  return options;
}

function fetchCorreios(query) {
  return new Promise((resolve, reject) => {
    const url = `${CORREIOS_URL}?${query}`;
    const req = https.get(url, { timeout: 12000 }, (res) => {
      let body = '';
      res.on('data', (c) => {
        body += c;
      });
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('timeout'));
    });
  });
}

export async function calcularFreteCorreios({ cepOrigem, cepDestino, pesoKg }) {
  const peso = Math.min(30, Math.max(0.3, Number(pesoKg) || 0.5));
  const servicos = SERVICOS.map((s) => s.codigo).join(',');
  const params = new URLSearchParams({
    nCdEmpresa: '',
    sDsSenha: '',
    nCdServico: servicos,
    sCepOrigem: cepOrigem.replace(/\D/g, ''),
    sCepDestino: cepDestino.replace(/\D/g, ''),
    nVlPeso: String(peso),
    nCdFormato: '1',
    nVlComprimento: '20',
    nVlAltura: '10',
    nVlLargura: '15',
    nVlDiametro: '0',
    sCdMaoPropria: 'n',
    sCdAvisoRecebimento: 'n',
    nVlValorDeclarado: '0'
  });

  const xml = await fetchCorreios(params.toString());
  const options = parseCorreiosXml(xml);
  if (!options.length) {
    throw new Error('Nenhuma cotação retornada pelos Correios.');
  }
  return options.sort((a, b) => a.valor - b.valor);
}
