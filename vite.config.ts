import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import type { ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/* ───────────────────────────────────────────────────────────────
   Dev-only plugin: serves /api/* routes using the Vercel-style
   serverless handlers in the api/ directory so that login,
   signup, vendor endpoints etc. work during `npm run dev`.
   ─────────────────────────────────────────────────────────────── */
function loadDotEnv(root: string) {
  try {
    const content = fs.readFileSync(path.resolve(root, '.env'), 'utf-8');
    for (const line of content.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq < 0) continue;
      const k = t.slice(0, eq).trim();
      const v = t.slice(eq + 1).trim();
      if (!process.env[k]) process.env[k] = v;
    }
  } catch { /* .env missing – ignore */ }
}

function apiDevPlugin(): any {
  return {
    name: 'api-dev-server',
    configureServer(server: ViteDevServer) {
      const root = server.config.root;
      loadDotEnv(root);

      server.middlewares.use(async (req: any, res: any, next: any) => {
        const parsed = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
        if (!parsed.pathname.startsWith('/api/')) return next();

        const apiPath = parsed.pathname.slice(5); // strip "/api/"
        const handlerFile = path.resolve(root, 'api', `${apiPath}.ts`);
        if (!fs.existsSync(handlerFile)) return next();

        try {
          // ── Parse JSON body for mutating methods ──
          let body: any = {};
          if (['POST', 'PATCH', 'PUT'].includes(req.method || '')) {
            body = await new Promise((resolve) => {
              let raw = '';
              req.on('data', (c: Buffer) => { raw += c.toString(); });
              req.on('end', () => {
                try { resolve(JSON.parse(raw)); } catch { resolve({}); }
              });
            });
          }

          // ── Populate query map ──
          const query: Record<string, string> = {};
          parsed.searchParams.forEach((v, k) => { query[k] = v; });

          // ── Vercel-compat shims ──
          req.body = body;
          req.query = query;

          let _status = 200;
          res.status = (code: number) => { _status = code; return res; };
          res.json = (data: any) => {
            res.statusCode = _status;
            if (!res.headersSent) res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };

          // ── Load handler through Vite SSR (handles TS + imports) ──
          const mod = await server.ssrLoadModule(handlerFile);
          await mod.default(req, res);
        } catch (err: any) {
          console.error(`[API ${parsed.pathname}]`, err?.message || err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Internal server error' }));
          }
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [tailwindcss(), react(), apiDevPlugin()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              'vendor-icons': ['lucide-react'],
              'vendor-charts': ['recharts'],
            }
          }
        }
      }
    };
});
