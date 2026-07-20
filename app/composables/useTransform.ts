import type {
  LanguageId,
  TransformMode,
  TransformRequest,
  TransformResult,
  TransformStats,
} from '#shared/types'
import { detectLanguage } from '#shared/utils/detect'
import { DEFAULT_LANGUAGE } from '#shared/utils/languages'

type Status = 'idle' | 'loading' | 'success' | 'error'

/**
 * Shared editor store + transform orchestration.
 *
 * Backed by useState so every component (toolbar, panels, stats) reads and
 * mutates the same reactive state without prop drilling. The actual network
 * call is the only side effect and lives in `run()`.
 */
export function useTransform() {
  const input = useState<string>('nt:input', () => '')
  const output = useState<string>('nt:output', () => '')
  const mode = useState<TransformMode>('nt:mode', () => 'beautify')
  const language = useState<LanguageId>('nt:language', () => DEFAULT_LANGUAGE)
  const autoDetect = useState<boolean>('nt:auto', () => true)
  const indentSize = useState<number>('nt:indent', () => 2)
  const indentWithTabs = useState<boolean>('nt:tabs', () => false)
  const status = useState<Status>('nt:status', () => 'idle')
  const errorMessage = useState<string>('nt:error', () => '')
  const stats = useState<TransformStats | null>('nt:stats', () => null)

  /** Language actually used for transforming (respects auto-detect). */
  const effectiveLanguage = computed<LanguageId>(() =>
    autoDetect.value && input.value.trim()
      ? detectLanguage(input.value)
      : language.value,
  )

  const hasInput = computed(() => input.value.trim().length > 0)
  const hasOutput = computed(() => output.value.length > 0)
  const isLoading = computed(() => status.value === 'loading')

  function selectLanguage(id: LanguageId) {
    autoDetect.value = false
    language.value = id
  }

  function enableAutoDetect() {
    autoDetect.value = true
  }

  function setMode(next: TransformMode) {
    mode.value = next
  }

  function clear() {
    input.value = ''
    output.value = ''
    stats.value = null
    status.value = 'idle'
    errorMessage.value = ''
  }

  async function run() {
    if (!hasInput.value) {
      status.value = 'error'
      errorMessage.value = 'Paste some code or drop a file to get started.'
      return
    }

    status.value = 'loading'
    errorMessage.value = ''

    const payload: TransformRequest = {
      code: input.value,
      language: effectiveLanguage.value,
      mode: mode.value,
      options: {
        indentSize: indentSize.value,
        indentWithTabs: indentWithTabs.value,
      },
    }

    try {
      const result = await $fetch<TransformResult>('/api/transform', {
        method: 'POST',
        body: payload,
      })
      output.value = result.output
      stats.value = result.stats
      status.value = 'success'
    }
    catch (error) {
      output.value = ''
      stats.value = null
      status.value = 'error'
      errorMessage.value = extractErrorMessage(error)
    }
  }

  return {
    // state
    input,
    output,
    mode,
    language,
    autoDetect,
    indentSize,
    indentWithTabs,
    status,
    errorMessage,
    stats,
    // derived
    effectiveLanguage,
    hasInput,
    hasOutput,
    isLoading,
    // actions
    selectLanguage,
    enableAutoDetect,
    setMode,
    clear,
    run,
  }
}

function extractErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const maybe = error as { statusMessage?: string, data?: { statusMessage?: string, message?: string }, message?: string }
    return (
      maybe.data?.statusMessage
      || maybe.data?.message
      || maybe.statusMessage
      || maybe.message
      || 'Something went wrong while transforming your code.'
    )
  }
  return 'Something went wrong while transforming your code.'
}
