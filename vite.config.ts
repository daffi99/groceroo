import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Populate process.env for local Node execution
  if (env.DATABASE_URL) process.env.DATABASE_URL = env.DATABASE_URL;
  if (env.PANTRY_PIN) process.env.PANTRY_PIN = env.PANTRY_PIN;

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'local-api-handler',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url || '';
            let apiModule = '';
            if (url.startsWith('/api/sync')) apiModule = '/api/sync.ts';
            else if (url.startsWith('/api/search-image')) apiModule = '/api/search-image.ts';

            if (apiModule) {
              try {
                // Ensure env vars are set
                process.env.DATABASE_URL = env.DATABASE_URL || process.env.DATABASE_URL;
                process.env.PANTRY_PIN = env.PANTRY_PIN || process.env.PANTRY_PIN;
                process.env.PEXELS_API_KEY = env.PEXELS_API_KEY || env.VITE_PEXELS_API_KEY || process.env.PEXELS_API_KEY;

                // Load handler dynamically via Vite SSR loader
                const { default: handler } = await server.ssrLoadModule(apiModule);

                // Read request body if POST
                let bodyData: any = undefined;
                if (req.method === 'POST' || req.method === 'PUT') {
                  const buffers = [];
                  for await (const chunk of req) {
                    buffers.push(chunk);
                  }
                  const rawBody = Buffer.concat(buffers).toString('utf-8');
                  try {
                    bodyData = JSON.parse(rawBody);
                  } catch {
                    bodyData = rawBody;
                  }
                }

                // Attach Vercel compatibility helpers
                (req as any).body = bodyData;
                (req as any).query = Object.fromEntries(
                  new URL(url, 'http://localhost').searchParams
                );

                (res as any).status = function (statusCode: number) {
                  res.statusCode = statusCode;
                  return res;
                };
                (res as any).json = function (jsonBody: any) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(jsonBody));
                  return res;
                };

                await handler(req as any, res as any);
              } catch (err: any) {
                console.error(`[Local API Error ${apiModule}]:`, err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message }));
              }
              return;
            }
            next();
          });
        },
      },
    ],
    server: {
      host: true,
      port: 5173,
    },
  };
});
