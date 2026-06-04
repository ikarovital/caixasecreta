/** Opções do vite-plugin-pwa — importadas em vite.config.js */
export const PWA_THEME_COLOR = '#6C2BD9';
export const PWA_BACKGROUND_COLOR = '#0D0618';

/** Nomes dos caches runtime (Workbox). Bump sufixo ao mudar estratégia. */
export const PWA_CACHE = {
  static: 'ccs-static-v1',
  pages: 'ccs-pages-v1',
  images: 'ccs-images-v1'
};

const GET_ONLY = ({ request }) => request.method === 'GET';

/** Produção: domínio próprio na raiz (clubecaixasecreta.com.br). */
export const pwaManifest = {
  name: 'Clube Caixa Secreta',
  short_name: 'Caixa Secreta',
  description: 'Loja oficial Clube Caixa Secreta',
  lang: 'pt-BR',
  dir: 'ltr',
  display: 'standalone',
  orientation: 'portrait',
  theme_color: PWA_THEME_COLOR,
  background_color: PWA_BACKGROUND_COLOR,
  start_url: '/',
  scope: '/',
  icons: [
    {
      src: '/icons/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/icons/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/icons/icon-512-maskable.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable'
    }
  ]
};

export function createPwaPlugin(VitePWA) {
  return VitePWA({
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    includeAssets: ['icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png'],
    manifest: pwaManifest,
    devOptions: {
      enabled: false,
      type: 'module'
    },
    workbox: {
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [/^\/api\//, /^\/extracao_pdf\//],
      globPatterns: ['**/*.{js,css,html,woff2}'],
      globIgnores: ['**/importados/**', '**/imagens/**', '**/*.map'],
      runtimeCaching: [
        {
          urlPattern: ({ url, request }) =>
            GET_ONLY({ request }) &&
            /\.(?:js|css|woff2?)$/i.test(url.pathname),
          handler: 'CacheFirst',
          options: {
            cacheName: PWA_CACHE.static,
            expiration: {
              maxEntries: 80,
              maxAgeSeconds: 60 * 60 * 24 * 30
            }
          }
        },
        {
          urlPattern: ({ request }) => GET_ONLY({ request }) && request.mode === 'navigate',
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: PWA_CACHE.pages,
            expiration: {
              maxEntries: 32,
              maxAgeSeconds: 60 * 60 * 24 * 7
            }
          }
        },
        {
          urlPattern: ({ url, request }) =>
            GET_ONLY({ request }) &&
            (url.pathname.startsWith('/importados/') ||
              url.pathname.startsWith('/imagens/')),
          handler: 'NetworkFirst',
          options: {
            cacheName: PWA_CACHE.images,
            networkTimeoutSeconds: 10,
            expiration: {
              maxEntries: 120,
              maxAgeSeconds: 60 * 60 * 24 * 14
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    }
  });
}
