import { Elysia, t } from 'elysia';
import { jwtConfig } from '../config/jwt.config';
import { fail } from '../utils/response.util';

export const authController = new Elysia({ prefix: '/auth' })
    .use(jwtConfig)
    .post(
        '/login',
        async ({ body, jwt, set }) => {
            // Mock login check
            if (body.username === 'admin' && body.password === 'password') {
                const token = await jwt.sign({
                    username: body.username,
                    role: 'admin'
                });
                return token;
            }

            // Business Logic Failure: Invalid Credentials
            set.status = 401;
            return fail('Invalid credentials', 401);
        },
        {
            body: t.Object({
                username: t.String(),
                password: t.String()
            }),
            detail: {
                tags: ['Auth'],
                summary: 'Login to get JWT'
            }
        }
    );
