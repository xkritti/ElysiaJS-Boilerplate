import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { jwtConfig } from './config/jwt.config';
import { responseMiddleware } from './middlewares/response.middleware';
import { healthController } from './controllers/health.controller';
import { protectedController } from './controllers/protected.controller';
import { authController } from './controllers/auth.controller';

import { demoController } from './controllers/demo.controller';

const app = new Elysia()
  .use(cors())
  .use(jwtConfig)
  .use(swagger({
    documentation: {
      info: {
        title: 'Elysia Boilerplate API',
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
  .use(responseMiddleware)
  .group('/api', (app) => app
    .use(authController)
    .use(protectedController)
    .use(demoController)
    .use(healthController))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
