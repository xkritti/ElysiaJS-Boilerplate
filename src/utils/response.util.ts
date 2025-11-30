export class AppError extends Error {
    public statusCode: number;
    public details?: any;

    constructor(message: string, statusCode: number = 500, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

const createSuccessResponse = (data: any, statusCode: number = 200, message: string = 'Success') => {
    return {
        success: true,
        statusCode,
        message,
        data,
        timestamp: new Date().toISOString()
    };
};

const createErrorResponse = (message: string, statusCode: number = 500, error?: any) => {
    return {
        success: false,
        statusCode,
        message,
        data: error || null,
        timestamp: new Date().toISOString()
    };
};

// Alias for Business Logic Failures (Non-System Errors)
// Use this when you want to return a "failure" state without throwing an exception.
export const fail = createErrorResponse;
export const success = createSuccessResponse;

