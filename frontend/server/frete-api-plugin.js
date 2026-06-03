import { calcularFreteCorreios } from './correios-frete.js';

const CEP_ORIGEM_DEFAULT = '01310100';

export function freteApiPlugin() {
  return {
    name: 'frete-api',
    configureServer(server) {
      server.middlewares.use('/api/frete', async (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: 'Método não permitido.' }));
          return;
        }

        try {
          const url = new URL(req.url || '', 'http://localhost');
          const cepDestino = (url.searchParams.get('cepDestino') || url.searchParams.get('cep') || '')
            .replace(/\D/g, '');
          let cepOrigem = (url.searchParams.get('cepOrigem') || CEP_ORIGEM_DEFAULT).replace(/\D/g, '');
          if (cepOrigem.length !== 8) cepOrigem = CEP_ORIGEM_DEFAULT;
          const pesoRaw = Number(String(url.searchParams.get('peso') || '0.5').replace(',', '.'));
          const peso = Number.isFinite(pesoRaw) ? Math.min(30, Math.max(0.1, pesoRaw)) : 0.5;

          if (cepDestino.length !== 8) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: 'CEP de destino inválido.' }));
            return;
          }

          const options = await calcularFreteCorreios({
            cepOrigem,
            cepDestino,
            pesoKg: peso
          });

          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              ok: true,
              cepOrigem,
              cepDestino,
              peso: Number(peso),
              options,
              referencia: 'https://www2.correios.com.br/sistemas/precosPrazos/'
            })
          );
        } catch (e) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              ok: false,
              error: e?.message || 'Falha ao consultar Correios.'
            })
          );
        }
      });
    },
    configurePreviewServer(server) {
      this.configureServer(server);
    }
  };
}
