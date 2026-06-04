import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { freteApiPlugin } from './server/frete-api-plugin.js';
import { createPwaPlugin } from './pwa.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXTRACAO_ROOT = path.resolve(__dirname, '../dados/extracao_pdf');

function serveExtracaoPdf() {
  const serve = (req, res, next) => {
    const raw = (req.url || '').split('?')[0];
    let rel = decodeURIComponent(raw.replace(/^\/extracao_pdf\/?/, ''));
    rel = rel.replace(/\\/g, '/');
    if (!rel || rel.includes('..') || rel.startsWith('/')) {
      next();
      return;
    }
    const file = path.normalize(path.join(EXTRACAO_ROOT, rel));
    if (!file.startsWith(EXTRACAO_ROOT + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      next();
      return;
    }
    const ext = path.extname(file).toLowerCase();
    const types = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
    res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  };

  return {
    name: 'serve-extracao-pdf',
    configureServer(server) {
      server.middlewares.use('/extracao_pdf', serve);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/extracao_pdf', serve);
    }
  };
}

export default defineConfig({
  plugins: [react(), serveExtracaoPdf(), freteApiPlugin(), createPwaPlugin(VitePWA)],
  server: {
    port: 5173,
    strictPort: true,
    fs: { allow: [path.resolve(__dirname, '..')] }
  }
});
