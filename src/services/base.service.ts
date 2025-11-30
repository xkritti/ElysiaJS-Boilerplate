import { ApiResponse } from '../types/response.type';

export class BaseService {
    constructor(protected readonly serviceName: string = 'BaseService') { }

    /**
     * Log a message with the service name context
     */
    protected log(message: string, data?: any): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${this.serviceName}] ${message}`;

        if (data) {
            console.log(logMessage, data);
        } else {
            console.log(logMessage);
        }
    }

    /**
     * Centralized error handling
     * Throws an error to be caught by the controller or global handler
     */
    protected handleError(message: string, error?: unknown): never {
        console.error(`[${this.serviceName}] Error: ${message}`, error);

        if (error instanceof Error) {
            throw new Error(`${message}: ${error.message}`);
        }

        throw new Error(`${message}: ${String(error)}`);
    }

    /**
     * Standardized Success Response
     */
    protected successResponse<T>(data: T, message: string = 'Success', code: number = 200): ApiResponse<T> {
        return {
            success: true,
            code,
            message,
            data,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Standardized Error Response
     * Use this when you want to return an error object instead of throwing
     */
    protected responseError(message: string, code: number = 400, errorDetails?: any): ApiResponse<null> {
        this.log(message, errorDetails);

        let errorObj = errorDetails;
        if (errorDetails instanceof Error) {
            errorObj = {
                message: errorDetails.message,
            };
        }

        return {
            success: false,
            code,
            message,
            error: errorObj,
            timestamp: new Date().toISOString()
        };
    }
}
