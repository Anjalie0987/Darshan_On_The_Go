export interface ApiResponse<T> {
  success: boolean;
  timestamp: string;
  requestId?: string;
  data?: T;
  error?: {
    code: number;
    message: string;
    details?: any;
  };
}
