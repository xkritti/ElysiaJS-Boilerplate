import { Elysia, t } from 'elysia';
import { AppError, fail, success } from '../utils/response.util';

export const demoController = new Elysia({ prefix: '/demo' })

    /**
     * 1. Standard Success Response (Auto-wrapped)
     * Return: { success: true, code: 200, message: 'Success', data: { ... }, timestamp: ... }
     */
    .get('/standard', () => {
        return {
            id: 1,
            name: 'John Doe',
            role: 'User'
        };
    }, {
        detail: { summary: 'Auto-wrapped Data' }
    })

    /**
     * 2. Custom Success Message
     * Use createSuccessResponse helper
     */
    .get('/custom-msg', ({ set }) => {
        set.status = 200;
        return success({
            id: 1,
            name: 'John Doe',
            role: 'User'
        }, 200, 'User status updated successfully');
    }, {
        detail: { summary: 'Custom Message & Code' }
    })

    /**
     * 3. Standard Error (Throw AppError)
     * Return: { success: false, code: 400, message: '...', error: null, timestamp: ... }
     */
    .get('/error', ({ set }) => {
        // Logic check...
        const isValid = false;
        if (!isValid) {
            set.status = 400;
            throw new AppError('Invalid input parameter provided', set.status);
        }
    }, {
        detail: { summary: 'Throw AppError (No Details)' }
    })

    /**
     * 4. Error with Details
     * Return: { ..., error: { field: 'email', reason: '...' } }
     */
    .get('/error-details', ({ set }) => {
        set.status = 422;
        throw new AppError('Validation Failed', set.status, {
            invalidFields: [
                { field: 'email', reason: 'Invalid format' },
                { field: 'password', reason: 'Too short' }
            ]
        });
    }, {
        detail: { summary: 'Throw AppError with Details' }
    })

    /**
     * 5. Validation Error (Automatic)
     * Elysia validates schema, Middleware catches and formats it.
     */
    .post('/validate', ({ body }) => {
        return body;
    }, {
        body: t.Object({
            username: t.String(),
            age: t.Number({ minimum: 18 })
        }),
        detail: { summary: 'Validation Error Test' }
    })

    /**
     * 6. Unexpected Error (500)
     * Middleware catches unknown errors as INTERNAL_SERVER_ERROR
     */
    .get('/panic', () => {
        throw new Error('Database connection failed');
    }, {
        detail: { summary: 'Unexpected Error' }
    });
