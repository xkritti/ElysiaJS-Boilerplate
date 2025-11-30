import { Elysia } from 'elysia';
import { jwtConfig } from '../config/jwt.config';
import { AppError } from '../utils/response.util';

export const authGuard = (app: Elysia) => app
  .use(jwtConfig)
  .onBeforeHandle(async ({ request, jwt, set, headers }: any) => {
    const authHeader = headers['authorization'] || request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      throw new AppError('Missing or invalid Authorization header', set.status);
    }

    const token = authHeader.slice(7);

    try {
      const payload = await jwt.verify(token);
      console.log('🔒 AuthGuard Payload:', payload);

      if (!payload) {
        set.status = 401;
        throw new AppError('Invalid Token', set.status);
      }
    } catch (error) {
      console.error('🔒 AuthGuard Error:', error);
      set.status = 401;
      throw new AppError('Token verification failed', set.status);
    }
  });
