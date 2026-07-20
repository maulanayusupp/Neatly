import type { CompareReport } from '#shared/utils/json-compare'
import { compareJson } from '#shared/utils/json-compare'

export interface CompareSource {
  id: number
  text: string
}

type Status = 'idle' | 'success' | 'error'

const MIN_SOURCES = 2
const MAX_SOURCES = 4

/** Label for a source by position: 0 -> "A", 1 -> "B", … */
export function compareLabel(index: number): string {
  return String.fromCharCode(65 + index)
}

const EXAMPLE = [
  '{\n  "user": { "name": "Ann", "role": "admin" },\n  "active": true,\n  "tags": ["x", "y"]\n}',
  '{\n  "user": { "name": "Ann", "role": "admin" },\n  "active": true,\n  "tags": ["x", "y"]\n}',
  '{\n  "user": { "name": "Ann", "role": "guest" },\n  "active": false,\n  "tags": ["x", "z"]\n}',
]

/**
 * Shared store for the JSON compare tool: a dynamic set of 2–4 JSON inputs
 * plus the resulting diff report. Comparison runs entirely client-side.
 */
export function useJsonCompare() {
  const sources = useState<CompareSource[]>('jc:sources', () => [
    { id: 1, text: '' },
    { id: 2, text: '' },
  ])
  const nextId = useState<number>('jc:nextId', () => 3)
  const report = useState<CompareReport | null>('jc:report', () => null)
  const status = useState<Status>('jc:status', () => 'idle')
  const errors = useState<Record<number, string>>('jc:errors', () => ({}))

  const canAdd = computed(() => sources.value.length < MAX_SOURCES)
  const canRemove = computed(() => sources.value.length > MIN_SOURCES)

  function addSource() {
    if (!canAdd.value) return
    sources.value = [...sources.value, { id: nextId.value, text: '' }]
    nextId.value += 1
  }

  function removeSource(id: number) {
    if (!canRemove.value) return
    sources.value = sources.value.filter(source => source.id !== id)
    const { [id]: _removed, ...rest } = errors.value
    errors.value = rest
    reset()
  }

  function setText(id: number, text: string) {
    sources.value = sources.value.map(source =>
      source.id === id ? { ...source, text } : source,
    )
  }

  function reset() {
    report.value = null
    status.value = 'idle'
  }

  function clearAll() {
    sources.value = [
      { id: 1, text: '' },
      { id: 2, text: '' },
    ]
    nextId.value = 3
    errors.value = {}
    reset()
  }

  function loadExample() {
    sources.value = EXAMPLE.map((text, i) => ({ id: i + 1, text }))
    nextId.value = EXAMPLE.length + 1
    errors.value = {}
    reset()
  }

  function run() {
    const nextErrors: Record<number, string> = {}
    const parsed: { label: string, value: unknown }[] = []

    sources.value.forEach((source, index) => {
      if (!source.text.trim()) {
        nextErrors[source.id] = 'This input is empty.'
        return
      }
      try {
        parsed.push({ label: compareLabel(index), value: JSON.parse(source.text) })
      }
      catch (error) {
        nextErrors[source.id] = (error as Error).message
      }
    })

    errors.value = nextErrors

    if (Object.keys(nextErrors).length > 0) {
      report.value = null
      status.value = 'error'
      return
    }

    report.value = compareJson(parsed)
    status.value = 'success'
  }

  return {
    sources,
    report,
    status,
    errors,
    canAdd,
    canRemove,
    addSource,
    removeSource,
    setText,
    clearAll,
    loadExample,
    run,
  }
}
