export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: string | string[];
  public readonly path?: string;

  constructor(statusCode: number, message: string, details?: string | string[], path?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    this.path = path;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  public static fromResponse(statusCode: number, data: unknown): ApiError {
    const errorData = data as ApiErrorResponse;
    const message = Array.isArray(errorData?.message)
      ? errorData.message.join(', ')
      : errorData?.message || 'An unexpected API error occurred.';

    return new ApiError(
      statusCode,
      message,
      errorData?.message,
      errorData?.path
    );
  }
}
