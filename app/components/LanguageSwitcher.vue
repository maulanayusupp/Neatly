<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const options = computed(() =>
  (locales.value as { code: string, name: string }[]).map(l => ({ code: l.code, name: l.name })),
)
const current = computed(() => options.value.find(o => o.code === locale.value))

function choose(code: string) {
  setLocale(code as 'en')
  open.value = false
}

function onDocClick(event: MouseEvent) {
  if (root.value && !root.value.contains(event.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="root" class="lang">
    <button
      class="lang__trigger"
      type="button"
      :aria-label="$t('nav.language')"
      :aria-expanded="open"
      @click="open = !open"
    >
      <BaseIcon name="globe" :size="18" />
      <span class="lang__code">{{ (current?.code || locale).toUpperCase() }}</span>
    </button>

    <Transition name="lang">
      <ul v-if="open" class="lang__menu" role="menu">
        <li v-for="o in options" :key="o.code">
          <button
            type="button"
            class="lang__item"
            :class="{ 'is-active': o.code === locale }"
            @click="choose(o.code)"
          >
            <span>{{ o.name }}</span>
            <BaseIcon v-if="o.code === locale" name="check" :size="15" />
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.lang {
  position: relative;
}

.lang__trigger {
  @include button-reset;
  display: inline-flex;
  align-items: center;
  gap: spacing(1.5);
  height: 2.5rem;
  padding-inline: spacing(3);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: $text-xs;
  font-weight: 700;
  transition: color $transition-fast, border-color $transition-fast, background-color $transition-fast;

  &:hover {
    color: var(--color-text);
    border-color: var(--color-border-strong);
    background: var(--color-surface-2);
  }
}

.lang__menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: $z-overlay;
  min-width: 200px;
  margin: 0;
  padding: spacing(1.5);
  list-style: none;
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
}

.lang__item {
  @include button-reset;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: spacing(3);
  padding: spacing(2.5) spacing(3);
  border-radius: $radius-sm;
  font-size: $text-sm;
  font-weight: 500;
  color: var(--color-text-muted);

  &:hover { background: var(--color-surface-2); color: var(--color-text); }
  &.is-active { color: var(--color-primary); font-weight: 600; }
}

.lang-enter-active,
.lang-leave-active { transition: opacity $transition-fast, transform $transition-fast; }
.lang-enter-from,
.lang-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
