import type {
  TransformOptions,
  TransformRequest,
  TransformResult,
  TransformStats,
} from '#shared/types'
import { beautify } from './beautify.service'
import { minify } from './minify.service'
import { TransformError } from '../utils/errors'

const DEFAULT_OPTIONS: TransformOptions = {
  indentSize: 2,
  indentWithTabs: false,
}

/** Clamp/normalise user-supplied options into a safe range. */
function resolveOptions(options?: Partial<TransformOptions>): TransformOptions {
  const indentSize = Number(options?.indentSize ?? DEFAULT_OPTIONS.indentSize)
  return {
    indentSize: Number.isFinite(indentSize)
      ? Math.min(Math.max(Math.trunc(indentSize), 1), 8)
      : DEFAULT_OPTIONS.indentSize,
    indentWithTabs: Boolean(options?.indentWithTabs ?? DEFAULT_OPTIONS.indentWithTabs),
  }
}

function computeStats(input: string, output: string): TransformStats {
  const inputBytes = byteLength(input)
  const outputBytes = byteLength(output)
  const savedBytes = inputBytes - outputBytes
  return {
    inputBytes,
    outputBytes,
    savedBytes,
    savedPercent: inputBytes === 0 ? 0 : (savedBytes / inputBytes) * 100,
    inputLines: countLines(input),
    outputLines: countLines(output),
  }
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).length
}

function countLines(value: string): number {
  if (!value) return 0
  return value.split('\n').length
}

/**
 * Core entry point: run a beautify or minify transform and attach size stats.
 */
export async function runTransform(request: TransformRequest): Promise<TransformResult> {
  const code = request.code
  if (!code.trim()) {
    throw new TransformError('There is nothing to transform — the input is empty.', 400)
  }

  const options = resolveOptions(request.options)
  const output = request.mode === 'minify'
    ? await minify(code, request.language)
    : beautify(code, request.language, options)

  return {
    output,
    language: request.language,
    mode: request.mode,
    stats: computeStats(code, output),
  }
}
