<script setup lang="ts">
const props = defineProps<{
  id: number
  label: string
  text: string
  error?: string
  removable: boolean
}>()

const emit = defineEmits<{
  update: [text: string]
  remove: []
}>()

const toast = useToast()

const model = computed({
  get: () => props.text,
  set: value => emit('update', value),
})

const byteCount = computed(() => new TextEncoder().encode(props.text).length)

async function loadFile(file: File) {
  try {
    emit('update', await readFileAsText(file))
    toast.success(`Loaded ${file.name}`)
  }
  catch {
    toast.error('Could not read that file.')
  }
}
</script>

<template>
  <section class="compare-card" :class="{ 'has-error': error }">
    <header class="compare-card__header">
      <span class="compare-card__label">JSON {{ label }}</span>
      <div class="compare-card__actions">
        <span v-if="error" class="compare-card__badge is-error">
          <BaseIcon name="alert" :size="13" /> Invalid
        </span>
        <button
          v-if="removable"
          class="compare-card__remove"
          type="button"
          :aria-label="`Remove JSON ${label}`"
          @click="emit('remove')"
        >
          <BaseIcon name="x" :size="16" />
        </button>
      </div>
    </header>

    <div class="compare-card__body">
      <CodeEditor
        v-model="model"
        language="json"
        :aria-label="`JSON ${label} input`"
        placeholder="Paste JSON here or drop a .json file…"
        @file="loadFile"
      />
    </div>

    <footer class="compare-card__footer">
      <span v-if="error" class="compare-card__error">{{ error }}</span>
      <span v-else class="compare-card__hint">JSON</span>
      <span class="compare-card__bytes">{{ formatBytes(byteCount) }}</span>
    </footer>
  </section>
</template>

<style scoped lang="scss">
.compare-card {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 340px;
  @include card;
  overflow: hidden;
  transition: border-color $transition-fast;

  &.has-error {
    border-color: var(--color-danger);
  }
}

.compare-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: spacing(2.5) spacing(3);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

.compare-card__label {
  font-size: $text-sm;
  font-weight: 700;
  color: var(--color-text);
}

.compare-card__actions {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
}

.compare-card__badge {
  display: inline-flex;
  align-items: center;
  gap: spacing(1);
  padding: spacing(0.5) spacing(2);
  border-radius: $radius-pill;
  font-size: $text-xs;
  font-weight: 700;

  &.is-error {
    color: var(--color-danger);
    background: var(--color-danger-soft);
  }
}

.compare-card__remove {
  @include button-reset;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: $radius-sm;
  color: var(--color-text-subtle);
  transition: color $transition-fast, background-color $transition-fast;

  &:hover {
    color: var(--color-danger);
    background: var(--color-danger-soft);
  }
}

.compare-card__body {
  flex: 1;
  min-height: 0;
}

.compare-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: spacing(2);
  padding: spacing(2) spacing(3);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-2);
  font-size: $text-xs;
}

.compare-card__hint {
  color: var(--color-text-subtle);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.compare-card__error {
  color: var(--color-danger);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.compare-card__bytes {
  color: var(--color-text-subtle);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}
</style>
