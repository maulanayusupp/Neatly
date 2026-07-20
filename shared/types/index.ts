/**
 * Shared domain types for Neatly.
 * Auto-imported in both the Nuxt app and the Nitro server.
 */

/** Languages Neatly can beautify and minify. */
export type LanguageId = 'javascript' | 'css' | 'html' | 'json' | 'xml'

/** The two directions a transform can run. */
export type TransformMode = 'beautify' | 'minify'

/** Formatting options (mostly relevant for the beautify direction). */
export interface TransformOptions {
  /** Number of spaces per indentation level. */
  indentSize: number
  /** Use tab characters instead of spaces. */
  indentWithTabs: boolean
}

/** Payload sent from the client to the transform endpoint. */
export interface TransformRequest {
  code: string
  language: LanguageId
  mode: TransformMode
  options?: Partial<TransformOptions>
}

/** Before/after size metrics for a transform. */
export interface TransformStats {
  inputBytes: number
  outputBytes: number
  /** Positive = bytes saved (minify), negative = bytes added (beautify). */
  savedBytes: number
  /** Signed percentage change relative to the input size. */
  savedPercent: number
  inputLines: number
  outputLines: number
  /** Gzipped size of the output, in bytes. */
  gzipBytes: number
}

/** 1-based location of a syntax error within the input. */
export interface ErrorLocation {
  line: number
  column: number
}

/** Data formats supported by the converter. */
export type ConvertFormat = 'json' | 'yaml' | 'csv' | 'xml'

export interface ConvertRequest {
  code: string
  from: ConvertFormat
  to: ConvertFormat
  options?: { indentSize?: number }
}

export interface ConvertResult {
  output: string
  from: ConvertFormat
  to: ConvertFormat
  outputBytes: number
}

/** Successful transform response. */
export interface TransformResult {
  output: string
  language: LanguageId
  mode: TransformMode
  stats: TransformStats
}
