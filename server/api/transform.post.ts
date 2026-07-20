import type { TransformRequest } from '#shared/types'
import { isLanguageId } from '#shared/utils/languages'
import { runTransform } from '../services/transform.service'
import { TransformError } from '../utils/errors'

/**
 * POST /api/transform
 * Beautify or minify a code snippet. All heavy lifting lives in the
 * transform service; this handler only validates and maps errors.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<TransformRequest>>(event)
  const { maxInputBytes } = useRuntimeConfig(event)

  const code = typeof body?.code === 'string' ? body.code : ''
  const language = typeof body?.language === 'string' ? body.language : ''
  const mode = body?.mode

  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'Field "code" is required.' })
  }
  if (!isLanguageId(language)) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported or missing language.' })
  }
  if (mode !== 'beautify' && mode !== 'minify') {
    throw createError({ statusCode: 400, statusMessage: 'Mode must be "beautify" or "minify".' })
  }
  if (new TextEncoder().encode(code).length > maxInputBytes) {
    throw createError({
      statusCode: 413,
      statusMessage: `Input is too large (max ${Math.round(maxInputBytes / 1024 / 1024)} MB).`,
    })
  }

  try {
    return await runTransform({ code, language, mode, options: body?.options })
  }
  catch (error) {
    if (error instanceof TransformError) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.message,
        data: error.location ? { location: error.location } : undefined,
      })
    }
    throw createError({ statusCode: 500, statusMessage: 'Unexpected error while transforming code.' })
  }
})
