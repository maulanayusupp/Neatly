<script setup lang="ts">
const store = useTransform()
const {
  mode,
  language,
  autoDetect,
  effectiveLanguage,
  indentSize,
  indentWithTabs,
  isLoading,
  hasInput,
} = store

const indentOptions = [
  { label: '2', size: 2, tabs: false },
  { label: '4', size: 4, tabs: false },
  { label: 'Tab', size: 2, tabs: true },
]

function isIndentActive(option: { size: number, tabs: boolean }) {
  return option.tabs
    ? indentWithTabs.value
    : !indentWithTabs.value && indentSize.value === option.size
}

function applyIndent(option: { size: number, tabs: boolean }) {
  indentWithTabs.value = option.tabs
  indentSize.value = option.size
}

const runLabel = computed(() => (mode.value === 'minify' ? 'Minify' : 'Beautify'))

const toast = useToast()

async function share() {
  if (!hasInput.value) {
    toast.error('Add some code before sharing.')
    return
  }
  const url = await buildShareUrl(store.getShareState())
  if (!url) {
    toast.error('Input is too large to share as a link.')
    return
  }
  if (await copyText(url)) {
    window.history.replaceState(null, '', url)
    toast.success('Share link copied to clipboard')
  }
}
</script>

<template>
  <div class="toolbar">
    <div class="toolbar__group toolbar__group--primary">
      <ModeSwitch v-model="mode" />
      <LanguageTabs
        :language="language"
        :auto="autoDetect"
        :detected="effectiveLanguage"
        @select="store.selectLanguage"
        @auto="store.enableAutoDetect"
      />
    </div>

    <div class="toolbar__group toolbar__group--actions">
      <div v-if="mode === 'beautify'" class="toolbar__indent" role="group" aria-label="Indentation">
        <span class="toolbar__indent-label">Indent</span>
        <button
          v-for="option in indentOptions"
          :key="option.label"
          type="button"
          class="toolbar__indent-btn"
          :class="{ 'is-active': isIndentActive(option) }"
          @click="applyIndent(option)"
        >
          {{ option.label }}
        </button>
      </div>

      <BaseButton variant="secondary" icon="share" :disabled="!hasInput" @click="share">
        Share
      </BaseButton>

      <BaseButton
        variant="primary"
        size="lg"
        :icon="mode"
        :loading="isLoading"
        :disabled="!hasInput"
        @click="store.run"
      >
        {{ runLabel }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: spacing(3) spacing(4);
}

.toolbar__group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: spacing(3);
}

.toolbar__group--actions {
  margin-left: auto;
}

.toolbar__indent {
  display: inline-flex;
  align-items: center;
  gap: spacing(1);
  padding: spacing(1) spacing(1) spacing(1) spacing(3);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  background: var(--color-surface);
}

.toolbar__indent-label {
  font-size: $text-xs;
  font-weight: 600;
  color: var(--color-text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-right: spacing(1);
}

.toolbar__indent-btn {
  @include button-reset;

  min-width: 2rem;
  padding: spacing(1.5) spacing(2);
  border-radius: $radius-sm;
  font-size: $text-sm;
  font-weight: 600;
  color: var(--color-text-muted);
  transition: color $transition-fast, background-color $transition-fast;

  &:hover {
    color: var(--color-text);
    background: var(--color-surface-2);
  }

  &.is-active {
    color: var(--color-primary);
    background: var(--color-brand-soft);
  }
}
</style>
