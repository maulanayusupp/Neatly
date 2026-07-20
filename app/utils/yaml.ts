import { dump, load } from 'js-yaml'

export type YamlResult =
  | { ok: true, value: unknown, formatted: string }
  | { ok: false, message: string, line: number, column: number }

/** Validate + pretty-print YAML, returning an error location on failure. */
export function validateYaml(input: string): YamlResult {
  if (!input.trim())
    return { ok: true, value: undefined, formatted: '' }
  try {
    const value = load(input)
    return {
      ok: true,
      value,
      formatted: value === undefined ? '' : dump(value, { indent: 2, lineWidth: -1, noRefs: true }),
    }
  }
  catch (error) {
    const e = error as { reason?: string, message?: string, mark?: { line: number, column: number } }
    return {
      ok: false,
      message: e.reason || e.message || 'Invalid YAML',
      line: e.mark ? e.mark.line + 1 : 1,
      column: e.mark ? e.mark.column + 1 : 1,
    }
  }
}
