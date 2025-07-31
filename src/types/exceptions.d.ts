export interface BackendError {
  timestamp: number;
  status: number;
  error: string;
  path: string;
}