import { Application } from '@feathersjs/express';
import next from 'next';
import routes from './routes';
import { setCookie, clearCookie } from './core';
import { logger } from '@app/core';
import { bootstrapModules } from './bootstrap-modules';
import { authenticate } from './core/authenticate';
export const bootstrapClient = async ({ server }: { server: Application<any> }) => {
  logger.info(`[Client] Bootstrapping...`);
  bootstrapModules({ routes });

  const dev = process.env.NODE_ENV !== 'production';
  const nextApp = next({ dev, dir: dev ? './src/client' : './dist/client' });
  const handler = routes.getRequestHandler(nextApp);
  await nextApp.prepare();

  server.get('/_next/*', (req, res) => {
    return handler(req, res);
  });
  server.get('/static/*', (req, res) => {
    return handler(req, res);
  });
  server.post('/auth/login', setCookie);
  server.get('/auth/logout', clearCookie);
  server.use(authenticate);

  server.use(handler);
};
