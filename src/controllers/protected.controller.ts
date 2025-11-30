import { Elysia } from 'elysia';
import { authGuard } from '../guards/auth.guard';
import { AppError } from '../utils/response.util';

export const protectedController = new Elysia({ prefix: '/protected' })
  .use(authGuard)
  .get('/', () => ({ user: 'admin', role: 'super-user' }), {
    detail: {
      summary: 'Protected Route',
      tags: ['Protected'],
      security: [{ BearerAuth: [] }]
    }
  })
  .get('/error', () => {
    throw new AppError('This is a custom error', 400, {
      error: 'CUSTOM_ERROR',
      message: 'This is a custom error',
      details: 'error details'
    });
  }, {
    detail: {
      summary: 'Test Error Response',
      tags: ['Protected'],
      security: [{ BearerAuth: [] }]
    }
  });
