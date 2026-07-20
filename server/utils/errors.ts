import type { ErrorLocation } from '#shared/types'

/**
 * Raised when user-provided code cannot be transformed (invalid syntax,
 * unparseable input, etc.). Carries an HTTP status so the API layer can map
 * it to a clean response, plus an optional source location.
 */
export class TransformError extends Error {
  readonly statusCode: number
  readonly location?: ErrorLocation

  constructor(message: string, statusCode = 422, location?: ErrorLocation) {
    super(message)
    this.name = 'TransformError'
    this.statusCode = statusCode
    this.location = location
  }
}

/** Extract a concise, user-facing message from an unknown thrown value. */
export function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'string' && error) return error
  return fallback
}

/** Convert a 0-based character offset into a 1-based line/column. */
export function offsetToLocation(code: string, offset: number): ErrorLocation {
  const upto = code.slice(0, Math.max(0, offset))
  const lastNewline = upto.lastIndexOf('\n')
  return {
    line: upto.split('\n').length,
    column: offset - lastNewline,
  }
}

/** Best-effort location for a JSON.parse failure. */
export function jsonErrorLocation(code: string, error: unknown): ErrorLocation | undefined {
  const message = error instanceof Error ? error.message : ''
  const lineCol = message.match(/line (\d+) column (\d+)/i)
  if (lineCol) {
    return { line: Number(lineCol[1]), column: Number(lineCol[2]) }
  }
  const position = message.match(/position (\d+)/i)
  if (position) {
    return offsetToLocation(code, Number(position[1]))
  }
  return undefined
}
