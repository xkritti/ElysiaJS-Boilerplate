import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';

export const authController = new Elysia({ prefix: '/auth' })
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET || 'super-secret-key'
        })
    )
    .post(
        '/login',
        async ({ body, jwt }) => {
            // Mock login check
            if (body.username === 'admin' && body.password === 'password') {
                const token = await jwt.sign({
                    username: body.username,
                    role: 'admin'
                });
                return { success: true, token };
            }
            return { success: false, message: 'Invalid credentials' };
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
