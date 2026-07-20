/**
 * Raised when user-provided code cannot be transformed (invalid syntax,
 * unparseable input, etc.). Carries an HTTP status so the API layer can map
 * it to a clean response.
 */
export class TransformError extends Error {
  readonly statusCode: number

  constructor(message: string, statusCode = 422) {
    super(message)
    this.name = 'TransformError'
    this.statusCode = statusCode
  }
}

/** Extract a concise, user-facing message from an unknown thrown value. */
export function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'string' && error) return error
  return fallback
}
