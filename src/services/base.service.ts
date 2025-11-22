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
     */
    protected handleError(message: string, error: unknown): never {
        console.error(`[${this.serviceName}] Error: ${message}`, error);

        if (error instanceof Error) {
            throw error;
        }

        throw new Error(`${message}: ${String(error)}`);
    }
}
