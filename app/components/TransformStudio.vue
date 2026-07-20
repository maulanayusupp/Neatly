<script setup lang="ts">
const store = useTransform()

function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault()
    store.run()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="studio">
    <StudioToolbar class="studio__toolbar" />

    <div class="studio__grid">
      <InputPanel class="studio__panel" />
      <OutputPanel class="studio__panel" />
    </div>

    <StatsBar />

    <p class="studio__hint">
      Tip: press
      <kbd>⌘</kbd><kbd>Enter</kbd>
      (or <kbd>Ctrl</kbd><kbd>Enter</kbd>) to run.
    </p>
  </div>
</template>

<style scoped lang="scss">
.studio {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.studio__toolbar {
  padding: spacing(4);
  @include card;
}

.studio__grid {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('lg') {
    grid-template-columns: 1fr 1fr;
  }
}

.studio__panel {
  height: 60vh;
  min-height: 380px;
  max-height: 720px;
}

.studio__hint {
  text-align: center;
  color: var(--color-text-subtle);
  font-size: $text-xs;

  kbd {
    display: inline-block;
    padding: 1px 6px;
    margin-inline: 1px;
    border-radius: $radius-xs;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    font-family: $font-mono;
    font-size: 0.72rem;
    color: var(--color-text-muted);
  }
}
</style>
