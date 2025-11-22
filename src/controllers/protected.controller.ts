import { Elysia } from 'elysia';
import { authGuard } from '../guards/auth.guard';

export const protectedController = new Elysia({ prefix: '/protected' })
  .use(authGuard)
  .get('/', () => ({ message: 'You have access!' }), {
    isAuth: true,
    detail: {
      summary: 'Protected Route',
      tags: ['Protected'],
      security: [{ BearerAuth: [] }]
    }
  });
