
export interface ApiResponse {
  ok?: boolean;
  message?: string;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  data?: any;
}
