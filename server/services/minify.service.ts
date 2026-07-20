import { minify as terserMinify } from 'terser'
import CleanCSS from 'clean-css'
import { minify as htmlMinify } from 'html-minifier-terser'
import { minify as xmlMinify } from 'minify-xml'
import type { LanguageId } from '#shared/types'
import { TransformError, toErrorMessage } from '../utils/errors'

/**
 * Minify (compress) a snippet for the given language.
 * Throws {@link TransformError} on invalid input.
 */
export async function minify(code: string, language: LanguageId): Promise<string> {
  switch (language) {
    case 'javascript':
      return minifyJs(code)
    case 'css':
      return minifyCss(code)
    case 'html':
      return minifyHtml(code)
    case 'json':
      return minifyJson(code)
    case 'xml':
      return minifyXml(code)
  }
}

async function minifyJs(code: string): Promise<string> {
  try {
    const result = await terserMinify(code, {
      compress: true,
      mangle: true,
    })
    return result.code ?? ''
  }
  catch (error) {
    throw new TransformError(
      `Could not minify JavaScript: ${toErrorMessage(error, 'invalid syntax')}`,
    )
  }
}

function minifyCss(code: string): string {
  const output = new CleanCSS({ level: 2, returnPromise: false }).minify(code)
  if (output.errors.length > 0) {
    throw new TransformError(`Could not minify CSS: ${output.errors[0]}`)
  }
  return output.styles
}

async function minifyHtml(code: string): Promise<string> {
  try {
    return await htmlMinify(code, {
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      minifyCSS: true,
      minifyJS: true,
      useShortDoctype: true,
    })
  }
  catch (error) {
    throw new TransformError(
      `Could not minify HTML: ${toErrorMessage(error, 'invalid markup')}`,
    )
  }
}

function minifyJson(code: string): string {
  try {
    return JSON.stringify(JSON.parse(code))
  }
  catch (error) {
    throw new TransformError(
      `Invalid JSON: ${toErrorMessage(error, 'could not parse input')}`,
    )
  }
}

function minifyXml(code: string): string {
  try {
    return xmlMinify(code, {
      removeComments: true,
      collapseWhitespaceInTags: true,
      collapseEmptyElements: true,
    })
  }
  catch (error) {
    throw new TransformError(
      `Could not minify XML: ${toErrorMessage(error, 'invalid document')}`,
    )
  }
}
