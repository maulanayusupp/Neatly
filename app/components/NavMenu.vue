<script setup lang="ts">
import { TOOL_GROUPS } from '~/utils/tools'

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const route = useRoute()

function close() {
  open.value = false
}

function onDocClick(event: MouseEvent) {
  if (root.value && !root.value.contains(event.target as Node)) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

// Close when navigating.
watch(() => route.fullPath, close)

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="root" class="nav-menu">
    <button
      class="nav-menu__trigger"
      :class="{ 'is-open': open }"
      type="button"
      aria-haspopup="true"
      :aria-expanded="open"
      @click="open = !open"
    >
      <BaseIcon name="grid" :size="17" />
      <span>{{ $t('nav.tools') }}</span>
      <BaseIcon name="chevron" :size="15" class="nav-menu__caret" />
    </button>

    <Transition name="nav-menu">
      <div v-if="open" class="nav-menu__panel" role="menu">
        <div class="nav-menu__grid">
          <div v-for="group in TOOL_GROUPS" :key="group.key" class="nav-menu__group">
            <p class="nav-menu__group-title">{{ $t(`groups.${group.key}`) }}</p>
            <NuxtLink
              v-for="tool in group.tools"
              :key="tool.to"
              :to="tool.to"
              class="nav-menu__item"
              role="menuitem"
            >
              <span class="nav-menu__icon">
                <BaseIcon :name="tool.icon" :size="18" />
              </span>
              <span class="nav-menu__text">
                <span class="nav-menu__label">{{ tool.label }}</span>
                <span class="nav-menu__desc">{{ tool.desc }}</span>
              </span>
            </NuxtLink>
          </div>
        </div>
        <NuxtLink to="/tools" class="nav-menu__all">
          <BaseIcon name="grid" :size="15" /> {{ $t('toolsPage.viewAll') }}
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.nav-menu {
  position: relative;
}

.nav-menu__trigger {
  @include button-reset;

  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  height: 2.5rem;
  padding-inline: spacing(3.5);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: $text-sm;
  font-weight: 600;
  transition: border-color $transition-fast, background-color $transition-fast;

  &:hover,
  &.is-open {
    border-color: var(--color-border-strong);
    background: var(--color-surface-2);
  }
}

.nav-menu__caret {
  color: var(--color-text-subtle);
  transition: transform $transition-fast;

  .is-open & {
    transform: rotate(180deg);
  }
}

.nav-menu__panel {
  // Mobile: anchor to the viewport so the wide menu can never clip off-screen.
  position: fixed;
  top: calc(#{$header-height} + spacing(2));
  left: spacing(3);
  right: spacing(3);
  z-index: $z-overlay;
  max-height: calc(100dvh - #{$header-height} - spacing(6));
  overflow-y: auto;
  padding: spacing(4);
  border-radius: $radius-lg;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
  @include custom-scrollbar;

  // Desktop: drop down from the trigger.
  @include respond('md') {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    left: auto;
    width: min(94vw, 600px);
    max-height: min(72vh, 640px);
  }
}

.nav-menu__grid {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('md') {
    grid-template-columns: 1fr 1fr;
  }
}

.nav-menu__group-title {
  padding-inline: spacing(2);
  margin-bottom: spacing(1);
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-subtle);
}

.nav-menu__item {
  display: flex;
  align-items: center;
  gap: spacing(3);
  padding: spacing(2.5);
  border-radius: $radius-md;
  transition: background-color $transition-fast;

  &:hover {
    background: var(--color-surface-2);
  }

  &.router-link-exact-active .nav-menu__icon {
    background: var(--color-primary);
    color: var(--color-on-primary);
  }
}

.nav-menu__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  border-radius: $radius-md;
  background: var(--color-brand-soft);
  color: var(--color-primary);
  transition: background-color $transition-fast, color $transition-fast;
}

.nav-menu__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.nav-menu__label {
  font-size: $text-sm;
  font-weight: 600;
  color: var(--color-text);
}

.nav-menu__desc {
  font-size: $text-xs;
  color: var(--color-text-muted);
}

.nav-menu__all {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: spacing(2);
  margin-top: spacing(3);
  padding: spacing(2.5);
  border-top: 1px solid var(--color-border);
  color: var(--color-primary);
  font-size: $text-sm;
  font-weight: 600;

  &:hover { background: var(--color-surface-2); border-radius: $radius-sm; }
}

.nav-menu-enter-active,
.nav-menu-leave-active {
  transition: opacity $transition-fast, transform $transition-fast;
}
.nav-menu-enter-from,
.nav-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
