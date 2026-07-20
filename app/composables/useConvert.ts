import type { ConvertFormat, ConvertResult } from '#shared/types'

type Status = 'idle' | 'loading' | 'success' | 'error'

const EXAMPLE = '{\n  "team": "Neatly",\n  "members": [\n    { "name": "Ann", "role": "admin" },\n    { "name": "Bob", "role": "editor" }\n  ],\n  "active": true\n}'

/** Shared store for the format converter (JSON / YAML / CSV / XML). */
export function useConvert() {
  const input = useState<string>('cv:input', () => '')
  const output = useState<string>('cv:output', () => '')
  const from = useState<ConvertFormat>('cv:from', () => 'json')
  const to = useState<ConvertFormat>('cv:to', () => 'yaml')
  const indentSize = useState<number>('cv:indent', () => 2)
  const status = useState<Status>('cv:status', () => 'idle')
  const errorMessage = useState<string>('cv:error', () => '')

  const hasInput = computed(() => input.value.trim().length > 0)
  const isLoading = computed(() => status.value === 'loading')

  function reset() {
    output.value = ''
    status.value = 'idle'
    errorMessage.value = ''
  }

  function swap() {
    const prevFrom = from.value
    from.value = to.value
    to.value = prevFrom
    // Feed the previous output back in so round-tripping is one click.
    if (output.value) {
      input.value = output.value
    }
    reset()
  }

  function clear() {
    input.value = ''
    reset()
  }

  function loadExample() {
    from.value = 'json'
    to.value = 'yaml'
    input.value = EXAMPLE
    reset()
  }

  async function run() {
    if (!hasInput.value) {
      status.value = 'error'
      errorMessage.value = 'Paste some data or load an example to convert.'
      return
    }
    status.value = 'loading'
    errorMessage.value = ''

    try {
      const result = await $fetch<ConvertResult>('/api/convert', {
        method: 'POST',
        body: { code: input.value, from: from.value, to: to.value, options: { indentSize: indentSize.value } },
      })
      output.value = result.output
      status.value = 'success'
    }
    catch (error) {
      output.value = ''
      status.value = 'error'
      errorMessage.value = extractMessage(error)
    }
  }

  return {
    input,
    output,
    from,
    to,
    indentSize,
    status,
    errorMessage,
    hasInput,
    isLoading,
    swap,
    clear,
    loadExample,
    run,
  }
}

function extractMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const e = error as { statusMessage?: string, data?: { statusMessage?: string, message?: string }, message?: string }
    return e.data?.statusMessage || e.data?.message || e.statusMessage || e.message || 'Conversion failed.'
  }
  return 'Conversion failed.'
}
