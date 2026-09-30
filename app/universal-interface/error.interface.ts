export interface errorResponse {
  data: {
    success: boolean;
    message: string;
    errors: string;
    statusCode: number;
  };
}
