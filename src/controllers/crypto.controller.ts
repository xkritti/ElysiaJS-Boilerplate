import { Elysia } from 'elysia';
import { authGuard } from '../guards/auth.guard';

export const cryptoController = new Elysia({ prefix: '/crypto' })
  .use(authGuard)
  .get('/', () => ({ message: 'You have access!' }), {
    isAuth: true,
    detail: {
      summary: 'Crypto Route',
      tags: ['Crypto'],
      security: [{ BearerAuth: [] }]
    }
  });