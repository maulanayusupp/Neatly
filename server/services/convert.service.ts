import { dump as yamlDump, load as yamlLoad } from 'js-yaml'
import Papa from 'papaparse'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import type { ConvertFormat } from '#shared/types'
import { TransformError, toErrorMessage } from '../utils/errors'

const XML_OPTS = { ignoreAttributes: false, attributeNamePrefix: '@_' }

/** Parse source text of a given format into a plain JS value. */
function parse(format: ConvertFormat, code: string): unknown {
  switch (format) {
    case 'json':
      return JSON.parse(code)

    case 'yaml':
      return yamlLoad(code)

    case 'csv': {
      const result = Papa.parse(code.trim(), {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      })
      if (result.errors.length > 0) {
        throw new TransformError(`Invalid CSV: ${result.errors[0]!.message}`)
      }
      return result.data
    }

    case 'xml':
      return new XMLParser(XML_OPTS).parse(code)
  }
}

/** Serialize a JS value into the target format. */
function serialize(format: ConvertFormat, value: unknown, indent: number): string {
  switch (format) {
    case 'json':
      return `${JSON.stringify(value, null, indent)}\n`

    case 'yaml':
      return yamlDump(value, { indent, lineWidth: -1, noRefs: true })

    case 'csv':
      return serializeCsv(value)

    case 'xml':
      return serializeXml(value, indent)
  }
}

function serializeCsv(value: unknown): string {
  const rows = Array.isArray(value)
    ? value
    : value && typeof value === 'object'
      ? [value]
      : null
  if (!rows) {
    throw new TransformError('CSV output needs an array of rows (or a single object).')
  }
  return Papa.unparse(rows as object[])
}

function serializeXml(value: unknown, indent: number): string {
  const builder = new XMLBuilder({
    ...XML_OPTS,
    format: true,
    indentBy: ' '.repeat(indent),
  })
  const root = Array.isArray(value)
    ? { root: { item: value } }
    : { root: value }
  return builder.build(root)
}

/**
 * Convert `code` from one data format to another via a plain JS intermediate.
 * Throws {@link TransformError} on invalid input or impossible conversions.
 */
export function convert(
  from: ConvertFormat,
  to: ConvertFormat,
  code: string,
  indent: number,
): string {
  let value: unknown
  try {
    value = parse(from, code)
  }
  catch (error) {
    if (error instanceof TransformError) throw error
    throw new TransformError(`Invalid ${from.toUpperCase()}: ${toErrorMessage(error, 'could not parse input')}`)
  }

  try {
    return serialize(to, value, indent)
  }
  catch (error) {
    if (error instanceof TransformError) throw error
    throw new TransformError(`Could not produce ${to.toUpperCase()}: ${toErrorMessage(error, 'unsupported structure')}`)
  }
}
