<script setup lang="ts">
const props = withDefaults(defineProps<{
  forwardLabel: string
  backwardLabel: string
  placeholder: string
  example?: string
  convert: (text: string, mode: 'forward' | 'backward') => string
}>(), {
  example: '',
})

const toast = useToast()
const input = ref('')
const mode = ref<'forward' | 'backward'>('forward')
const copied = ref(false)

const output = computed(() => {
  if (!input.value) return { text: '', error: '' }
  try {
    return { text: props.convert(input.value, mode.value), error: '' }
  }
  catch (error) {
    return { text: '', error: (error as Error).message || 'Could not convert the input.' }
  }
})

async function copy() {
  if (output.value.text && await copyText(output.value.text)) {
    copied.value = true
    toast.success('Copied to clipboard')
    setTimeout(() => (copied.value = false), 1600)
  }
}

function swap() {
  mode.value = mode.value === 'forward' ? 'backward' : 'forward'
  if (output.value.text) input.value = output.value.text
}
</script>

<template>
  <div class="conv">
    <div class="conv__modes">
      <button
        type="button"
        class="conv__mode"
        :class="{ 'is-active': mode === 'forward' }"
        @click="mode = 'forward'"
      >{{ forwardLabel }}</button>
      <button
        type="button"
        class="conv__mode"
        :class="{ 'is-active': mode === 'backward' }"
        @click="mode = 'backward'"
      >{{ backwardLabel }}</button>
      <button type="button" class="conv__swap" aria-label="Swap" @click="swap">
        <BaseIcon name="refresh" :size="16" />
      </button>
      <BaseButton
        v-if="example"
        size="sm"
        variant="ghost"
        icon="sparkles"
        class="conv__example"
        @click="input = example"
      >
        {{ $t('common.example') }}
      </BaseButton>
    </div>

    <div class="conv__grid">
      <label class="conv__field">
        <span class="conv__label">Input</span>
        <textarea v-model="input" class="conv__area" :placeholder="placeholder" spellcheck="false" />
      </label>
      <div class="conv__field">
        <span class="conv__label">Output</span>
        <div class="conv__out" :class="{ 'has-error': output.error }">
          <p v-if="output.error" class="conv__error">{{ output.error }}</p>
          <pre v-else class="conv__area conv__area--out">{{ output.text }}</pre>
          <button v-if="output.text" type="button" class="conv__copy" @click="copy">
            <BaseIcon :name="copied ? 'check' : 'copy'" :size="15" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.conv {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.conv__modes {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: spacing(1);
  padding: spacing(1);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
}

.conv__mode {
  @include button-reset;
  padding: spacing(2) spacing(4);
  border-radius: $radius-sm;
  font-size: $text-sm;
  font-weight: 600;
  color: var(--color-text-muted);

  &.is-active {
    color: var(--color-text);
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
  }
}

.conv__swap {
  @include button-reset;
  display: inline-flex;
  padding: spacing(2);
  color: var(--color-primary);
}

.conv__example {
  margin-left: spacing(2);
}

.conv__grid {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('md') {
    grid-template-columns: 1fr 1fr;
  }
}

.conv__field {
  display: flex;
  flex-direction: column;
  gap: spacing(2);
}

.conv__label {
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.conv__area {
  width: 100%;
  min-height: 220px;
  margin: 0;
  padding: spacing(4);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: $font-mono;
  font-size: $text-sm;
  line-height: 1.6;
  resize: vertical;
  white-space: pre-wrap;
  word-break: break-all;

  &:focus { outline: none; border-color: var(--color-primary); }
}

.conv__out {
  position: relative;
  min-height: 220px;
}

.conv__area--out {
  min-height: 220px;
  overflow: auto;
  @include custom-scrollbar;
}

.conv__error {
  padding: spacing(4);
  border-radius: $radius-md;
  border: 1px solid var(--color-danger);
  background: var(--color-danger-soft);
  color: var(--color-danger);
  font-size: $text-sm;
  font-weight: 600;
}

.conv__copy {
  @include button-reset;
  position: absolute;
  top: spacing(2);
  right: spacing(2);
  padding: spacing(2);
  border-radius: $radius-sm;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text-muted);

  &:hover { color: var(--color-primary); }
}
</style>
