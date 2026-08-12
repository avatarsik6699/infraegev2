export type ApiErrorKind =
  "aborted" | "http" | "protocol" | "timeout" | "transport";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(
    kind: ApiErrorKind,
    message: string,
    options?: { cause?: unknown; status?: number },
  ) {
    super(message, { cause: options?.cause });
    this.name = "ApiError";
    this.kind = kind;
    this.status = options?.status;
  }
}

export function normalizeApiFailure(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return new ApiError("timeout", "API request timed out", { cause: error });
  }
  if (error instanceof DOMException && error.name === "AbortError") {
    return new ApiError("aborted", "API request was aborted", { cause: error });
  }
  return new ApiError("transport", "API request failed", { cause: error });
}
