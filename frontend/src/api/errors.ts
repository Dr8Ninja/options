const messages: Record<number, string> = {
  401: "Sign in to continue.",
  403: "This action is not available. Refresh the page before trying again.",
  404: "This item is not available.",
  409: "This item changed. Refresh and review it before trying again.",
  412: "A newer version is available. Your changes have not been saved.",
  429: "Too many requests. Please wait before trying again.",
  503: "The service is temporarily unavailable. Please try again later.",
};
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly requestId?: string,
  ) {
    super(
      messages[status] ??
        "The request could not be completed. Please try again.",
    );
    this.name = "ApiError";
  }
}
export function errorFromResponse(response: Response) {
  const candidate = response.headers.get("X-Request-ID");
  return new ApiError(
    response.status,
    candidate && uuid.test(candidate) ? candidate : undefined,
  );
}
export function safeError(error: unknown) {
  return error instanceof ApiError ? error : new ApiError(0);
}
