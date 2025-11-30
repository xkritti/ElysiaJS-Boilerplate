import { Elysia } from 'elysia';
import { AppError, fail, success } from '../utils/response.util';

export const responseMiddleware = (app: Elysia) => app
    .onError(({ code, error, set }) => {
        console.error('❌ Global Error:', error);

        // 1. Handle Custom AppError
        if (error instanceof AppError) {
            set.status = error.statusCode;
            return fail(error.message, error.statusCode, error.details);
        }

        // 2. Handle Elysia Validation Errors
        if (code === 'VALIDATION') {
            set.status = 400;
            return fail('Validation Error', 400, error.all);
        }

        // 3. Handle Not Found
        if (code === 'NOT_FOUND') {
            set.status = 404;
            return fail('Resource not found', 404);
        }

        // 4. Handle Default Errors
        const status = typeof set.status === 'number' ? set.status : 500;
        const errorMessage = (error as any).message || 'Internal Server Error';
        return fail(errorMessage, status, process.env.NODE_ENV === 'development' ? error : undefined);
    })
    .onAfterHandle(({ response, set }) => {
        // 1. Skip native responses
        if (response instanceof Response || response instanceof Blob) return response;

        // 2. Check if already formatted
        if (typeof response === 'object' && response !== null) {
            if ('success' in response && 'statusCode' in response && 'timestamp' in response) {
                return response;
            }
        }

        // Helper to get numeric status
        const getStatus = (status: number | string | undefined): number => {
            return typeof status === 'number' ? status : 200;
        };

        const statusCode = getStatus(set.status);

        // 3. Handle Empty/Null (204)
        if (response === null || response === undefined) {
            return success(null, statusCode);
        }

        // 4. Auto-wrap data
        return success(response, statusCode);
    });
