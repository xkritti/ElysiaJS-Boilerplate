import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';

export const authGuard = new Elysia({ name: 'auth-guard' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'super-secret-key'
    })
  )
  .macro(({ onBeforeHandle }) => ({
    isAuth(enabled: boolean) {
      if (!enabled) return;

      onBeforeHandle(async ({ request, jwt, error, set }: { request: Request; jwt: any; error: any; set: any }) => {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          set.status = 401;
          return { success: false, message: 'Missing or invalid Authorization header' };
        }

        const token = authHeader.slice(7);
        const payload = await jwt.verify(token);

        if (!payload) {
          set.status = 401;
          return { success: false, message: 'Invalid Token' };
        }
      });
    }
  }));
