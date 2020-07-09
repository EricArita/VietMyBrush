import { mongoDatabase, logger } from './server/core';
import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import { bootstrapClient } from './client/bootstrap-client';
import { bootstrapServer } from './server/bootstrap-server';
import { config } from '@app/config';

(async () => {
  const server = express(feathers());

  logger.info(`[Server] Initialize mongo ...`);
  // 1. connect to mongo
  await mongoDatabase.startDatabase(config.database.connectionString);

  // 2. bootstrap server
  await bootstrapServer({ server });

  // 3. bootstrap client (nextjs);
  await bootstrapClient({ server });

  // 4. setup error handler
  server.use(express.notFound()).use(express.errorHandler({ logger }));

  // 5. start server
  const port = parseInt(process.env.PORT ? process.env.PORT : '', 10) || 3000;
  await server.listen(port);

  logger.info(`[Server] Server listens on port ${port} ...`);
})();
