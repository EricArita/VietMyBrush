import express, { Application } from '@feathersjs/express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import favicon from 'serve-favicon';
import compress from 'compression';
import helmet from 'helmet';
import { logger, rootLocation } from './core';
import { bootstrapModules } from './bootstrap-modules';
import admin from 'firebase-admin';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import applicationHook from './application.hooks';
import { config } from '@app/config';
import { readdir } from 'fs-extra';
import { merge } from 'lodash';
import i18next from 'i18next';
import i18nextExpress from 'i18next-express-middleware';
import i18nextBackend from 'i18next-node-fs-backend';
import socketio from '@feathersjs/socketio';
import cronjobs from './cronjobs';

export const bootstrapServer = async ({ server }: { server: Application<any> }) => {
  logger.info(`[Server] Bootstrapping...`);
  i18next
    .use(i18nextExpress.LanguageDetector)
    .use(i18nextBackend)
    .init({
      ns: ['translation'],
      fallbackNS: 'translation',
      fallbackLng: 'en',
      preload: ['en', 'vn'],
      backend: {
        loadPath: 'dist/server/locales/{{lng}}/{{ns}}.json',
      },
    });

  server
    .configure(express.rest())
    .use(helmet())
    .use(compress())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(favicon(path.join(process.cwd(), `${rootLocation}/client/static/favicon.ico`)))
    .use(cookieParser())
    .use(
      cors({
        origin(_origin, callback) {
          // if (config.web.cors.whitelistUrls.indexOf(origin) !== -1 || !origin) {
          //   callback(null, true);
          // } else {
          //   callback(new Error('Not allowed by CORS'));
          // }
          callback(null, true);
        },
      }),
    )
    .use('/upload', express.static(path.join(__dirname, '../../upload')))
    .use('/temp/attachment', express.static(path.join(__dirname, '../../temp/attachment')))
    .use(i18nextExpress.handle(i18next))
    .use(i18nextExpress.handle(i18next))
    .configure(
      socketio((io) => {
        io.on('connection', (socket) => {
          // clients.push(socket);

          // socket.on('end', () => {
          //   // Could also splice the array below, but it still works.
          //   delete clients[clients.indexOf(socket)];
          // });
          socket.join('fbchat');
          socket.join('mail');
          // socket.emit('messages', { text: 'A client connected!' });
          // socket.on('my other event', (data) => {
          //   // tslint:disable-next-line:no-console
          //   console.log(data);
          // });
        });
      }),
    );
  // global hooks
  server.hooks(applicationHook);

  cronjobs.startAll(() => {
    if ((server as any).io) {
      (server as any).io.to('email').emit('messages', { text: 'New message!' });
    }
  });
  // add authorization to feathers
  server.use(async (req: any, _res, next) => {
    req.feathers.authorization = req.headers.authorization;
    req.feathers.translate = req.t;
    req.feathers.io = (server as any).io;
    next();
  });

  // add swagger documents
  let swaggerDocument = YAML.load(`${rootLocation}/server/swagger.yaml`);
  const moduleNames = await readdir(`${rootLocation}/server/modules`);
  for (const module of moduleNames) {
    try {
      const moduleSwaggerDocument = YAML.load(`${rootLocation}/server/modules/${module}/${module}.swagger.yaml`);
      swaggerDocument = merge(swaggerDocument, moduleSwaggerDocument);
    } catch (error) {
      logger.error(error.message);
    }
  }
  server.use(config.web.api.docsJson, async (_req, res) => {
    res.status(200).json(swaggerDocument);
  });
  server.use(config.web.api.docsUrl, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // bootstrap modules
  await bootstrapModules({ server });

  // init firebase-admin
  logger.info(`[Server] Initialize firebase.....`);
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebase.serviceAccount['project_id'],
      clientEmail: config.firebase.serviceAccount['client_email'],
      privateKey: config.firebase.serviceAccount['private_key'],
    }),
    databaseURL: config.firebase.databaseURL,
  });
};
