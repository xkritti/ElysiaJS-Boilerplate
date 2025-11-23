import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { healthController } from './controllers/health.controller';
// import { protectedController } from './controllers/protected.controller';
import { authController } from './controllers/auth.controller';
import { qrController } from './controllers/qr.controller';
import { cryptoController } from './controllers/crypto.controller';

const app = new Elysia()
  .use(cors())
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'super-secret-key'
    })
  )
  .use(swagger({
    documentation: {
      info: {
        title: 'Elysia TNXTO API',
        version: '1.0.0'
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  }))
  .group('/api', (app) => app
    .use(authController)
    // .use(protectedController)
    .use(qrController)
    .use(cryptoController)
    .use(healthController))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
