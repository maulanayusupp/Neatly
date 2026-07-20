import type { ConvertRequest, ConvertResult } from '#shared/types'
import { isConvertFormat } from '#shared/utils/formats'
import { convert } from '../services/convert.service'
import { TransformError } from '../utils/errors'

/**
 * POST /api/convert
 * Convert a snippet between JSON, YAML, CSV and XML.
 */
export default defineEventHandler(async (event): Promise<ConvertResult> => {
  const body = await readBody<Partial<ConvertRequest>>(event)
  const { maxInputBytes } = useRuntimeConfig(event)

  const code = typeof body?.code === 'string' ? body.code : ''
  const from = typeof body?.from === 'string' ? body.from : ''
  const to = typeof body?.to === 'string' ? body.to : ''

  if (!code.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'There is nothing to convert — the input is empty.' })
  }
  if (!isConvertFormat(from) || !isConvertFormat(to)) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported source or target format.' })
  }
  if (new TextEncoder().encode(code).length > maxInputBytes) {
    throw createError({
      statusCode: 413,
      statusMessage: `Input is too large (max ${Math.round(maxInputBytes / 1024 / 1024)} MB).`,
    })
  }

  const indent = Math.min(Math.max(Math.trunc(Number(body?.options?.indentSize ?? 2)) || 2, 1), 8)

  try {
    const output = convert(from, to, code, indent)
    return { output, from, to, outputBytes: new TextEncoder().encode(output).length }
  }
  catch (error) {
    if (error instanceof TransformError) {
      throw createError({ statusCode: error.statusCode, statusMessage: error.message })
    }
    throw createError({ statusCode: 500, statusMessage: 'Unexpected error while converting.' })
  }
})
