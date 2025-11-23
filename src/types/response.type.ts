export interface ApiResponse<T = any> {
    success: boolean;
    code: number;
    message: string;
    data?: T;
    error?: any;
    timestamp: string;
}