/**
 * Represents an HTTP error returned from the API. Includes the
 * status code to allow callers to handle specific conditions.
 */
export class HttpError extends Error {
  /** HTTP status code returned by the server. */
  status: number;
  userMessage?: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
