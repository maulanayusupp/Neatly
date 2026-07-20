<script setup lang="ts">
const { toasts, dismiss } = useToast()

const iconFor = (kind: string) =>
  kind === 'success' ? 'check' : kind === 'error' ? 'alert' : 'sparkles'
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <div class="toast-host" aria-live="polite">
        <TransitionGroup name="toast">
          <button
            v-for="toast in toasts"
            :key="toast.id"
            class="toast"
            :class="`toast--${toast.kind}`"
            type="button"
            @click="dismiss(toast.id)"
          >
            <BaseIcon :name="iconFor(toast.kind)" :size="16" />
            <span>{{ toast.message }}</span>
          </button>
        </TransitionGroup>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<style scoped lang="scss">
.toast-host {
  position: fixed;
  left: 50%;
  bottom: spacing(6);
  transform: translateX(-50%);
  z-index: $z-toast;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: spacing(2);
  pointer-events: none;
}

.toast {
  @include button-reset;

  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  padding: spacing(2.5) spacing(4);
  border-radius: $radius-pill;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
  font-size: $text-sm;
  font-weight: 600;
  color: var(--color-text);
}

.toast--success {
  color: var(--color-success);
}
.toast--error {
  color: var(--color-danger);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity $transition-base, transform $transition-base;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
