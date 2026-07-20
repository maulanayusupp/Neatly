<script setup lang="ts">
import { ALL_TOOLS } from '~/utils/tools'

const { open, close, toggle } = useCommandPalette()
const router = useRouter()

const query = ref('')
const activeIndex = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)

const items = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return ALL_TOOLS
  return ALL_TOOLS.filter(t => `${t.label} ${t.desc} ${t.to}`.toLowerCase().includes(q))
})

watch(open, (isOpen) => {
  if (isOpen) {
    query.value = ''
    activeIndex.value = 0
    nextTick(() => inputEl.value?.focus())
  }
})
watch(items, () => (activeIndex.value = 0))

function go(to: string) {
  close()
  router.push(to)
}

function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    toggle()
    return
  }
  if (!open.value) return
  if (event.key === 'Escape') {
    close()
  }
  else if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, items.value.length - 1)
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  }
  else if (event.key === 'Enter') {
    const item = items.value[activeIndex.value]
    if (item) go(item.to)
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="cmdk">
        <div v-if="open" class="cmdk" @click.self="close">
          <div class="cmdk__panel" role="dialog" aria-modal="true">
            <div class="cmdk__search">
              <BaseIcon name="search" :size="18" />
              <input
                ref="inputEl"
                v-model="query"
                class="cmdk__input"
                :placeholder="$t('palette.placeholder')"
                spellcheck="false"
                autocomplete="off"
              >
              <kbd class="cmdk__esc">esc</kbd>
            </div>

            <ul class="cmdk__list" role="listbox">
              <li
                v-for="(item, i) in items"
                :key="item.to"
                class="cmdk__item"
                :class="{ 'is-active': i === activeIndex }"
                role="option"
                :aria-selected="i === activeIndex"
                @mouseenter="activeIndex = i"
                @click="go(item.to)"
              >
                <span class="cmdk__icon"><BaseIcon :name="item.icon" :size="17" /></span>
                <span class="cmdk__label">{{ item.label }}</span>
                <span class="cmdk__desc">{{ item.desc }}</span>
              </li>
              <li v-if="!items.length" class="cmdk__empty">{{ $t('palette.empty') }}</li>
            </ul>

            <div class="cmdk__foot">
              <span><kbd>↑</kbd><kbd>↓</kbd> {{ $t('palette.navigate') }}</span>
              <span><kbd>↵</kbd> {{ $t('palette.select') }}</span>
              <span><kbd>esc</kbd> {{ $t('palette.close') }}</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped lang="scss">
.cmdk {
  position: fixed;
  inset: 0;
  z-index: $z-toast;
  display: flex;
  justify-content: center;
  padding: 12vh spacing(4) spacing(4);
  background: rgba(11, 13, 22, 0.55);
  backdrop-filter: blur(4px);
}

.cmdk__panel {
  width: 100%;
  max-width: 560px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  border-radius: $radius-lg;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.cmdk__search {
  display: flex;
  align-items: center;
  gap: spacing(3);
  padding: spacing(4);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-subtle);
}

.cmdk__input {
  flex: 1;
  border: 0;
  background: transparent;
  color: var(--color-text);
  font-size: $text-lg;

  &:focus { outline: none; }
  &::placeholder { color: var(--color-text-subtle); }
}

.cmdk__esc {
  padding: 2px 6px;
  border-radius: $radius-xs;
  border: 1px solid var(--color-border);
  font-family: $font-mono;
  font-size: 0.7rem;
  color: var(--color-text-subtle);
}

.cmdk__list {
  flex: 1;
  margin: 0;
  padding: spacing(2);
  list-style: none;
  overflow-y: auto;
  @include custom-scrollbar;
}

.cmdk__item {
  display: flex;
  align-items: center;
  gap: spacing(3);
  padding: spacing(2.5) spacing(3);
  border-radius: $radius-md;
  cursor: pointer;

  &.is-active { background: var(--color-surface-2); }
}

.cmdk__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border-radius: $radius-sm;
  background: var(--color-brand-soft);
  color: var(--color-primary);
}

.cmdk__label {
  font-size: $text-sm;
  font-weight: 600;
  color: var(--color-text);
  flex-shrink: 0;
}

.cmdk__desc {
  font-size: $text-xs;
  color: var(--color-text-subtle);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cmdk__empty {
  padding: spacing(8);
  text-align: center;
  color: var(--color-text-subtle);
  font-size: $text-sm;
}

.cmdk__foot {
  display: flex;
  gap: spacing(4);
  padding: spacing(3) spacing(4);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-2);
  font-size: $text-xs;
  color: var(--color-text-subtle);

  kbd {
    padding: 1px 5px;
    margin-right: 2px;
    border-radius: $radius-xs;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    font-family: $font-mono;
  }
}

.cmdk-enter-active,
.cmdk-leave-active { transition: opacity $transition-fast; }
.cmdk-enter-from,
.cmdk-leave-to { opacity: 0; }
.cmdk-enter-active .cmdk__panel,
.cmdk-leave-active .cmdk__panel { transition: transform $transition-fast; }
.cmdk-enter-from .cmdk__panel,
.cmdk-leave-to .cmdk__panel { transform: translateY(-8px); }
</style>
