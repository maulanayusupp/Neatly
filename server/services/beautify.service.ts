import jsBeautify from 'js-beautify'
import type { LanguageId, TransformOptions } from '#shared/types'
import { TransformError, toErrorMessage } from '../utils/errors'

const { js: beautifyJs, css: beautifyCss, html: beautifyHtml } = jsBeautify

/** Build the shared js-beautify option object from Neatly options. */
function baseOptions(options: TransformOptions) {
  return {
    indent_size: options.indentSize,
    indent_with_tabs: options.indentWithTabs,
    end_with_newline: true,
    preserve_newlines: true,
    max_preserve_newlines: 2,
  }
}

/**
 * Beautify (pretty-print / unminify) a snippet for the given language.
 * Throws {@link TransformError} on invalid input.
 */
export function beautify(
  code: string,
  language: LanguageId,
  options: TransformOptions,
): string {
  const base = baseOptions(options)

  switch (language) {
    case 'javascript':
      return beautifyJs(code, { ...base, space_after_anon_function: true })

    case 'css':
      return beautifyCss(code, base)

    case 'html':
      return beautifyHtml(code, {
        ...base,
        indent_inner_html: true,
        wrap_line_length: 0,
      })

    case 'xml':
      return beautifyHtml(code, {
        ...base,
        indent_inner_html: true,
        wrap_line_length: 0,
        unformatted: [],
        content_unformatted: [],
      })

    case 'json':
      return beautifyJson(code, options)
  }
}

function beautifyJson(code: string, options: TransformOptions): string {
  let parsed: unknown
  try {
    parsed = JSON.parse(code)
  }
  catch (error) {
    throw new TransformError(
      `Invalid JSON: ${toErrorMessage(error, 'could not parse input')}`,
    )
  }
  const indent = options.indentWithTabs ? '\t' : options.indentSize
  return `${JSON.stringify(parsed, null, indent)}\n`
}
