<script setup lang="ts">
const props = withDefaults(defineProps<{
  data: unknown
  name?: string | number | null
  depth?: number
}>(), {
  name: null,
  depth: 0,
})

function valueType(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

const type = computed(() => valueType(props.data))
const isBranch = computed(() => type.value === 'object' || type.value === 'array')
const expanded = ref(props.depth < 2)

const entries = computed<{ k: string | number, v: unknown }[]>(() => {
  if (type.value === 'array') return (props.data as unknown[]).map((v, i) => ({ k: i, v }))
  if (type.value === 'object') return Object.entries(props.data as object).map(([k, v]) => ({ k, v }))
  return []
})

const summary = computed(() =>
  type.value === 'array'
    ? `[${(props.data as unknown[]).length}]`
    : `{${Object.keys(props.data as object).length}}`,
)

const display = computed(() =>
  type.value === 'string' ? JSON.stringify(props.data) : String(props.data),
)
</script>

<template>
  <div class="node">
    <div class="node__row" :class="{ 'is-branch': isBranch }" @click="isBranch && (expanded = !expanded)">
      <span v-if="isBranch" class="node__toggle">{{ expanded ? '▾' : '▸' }}</span>
      <span v-else class="node__toggle node__toggle--leaf" />
      <span v-if="name !== null" class="node__key">{{ name }}<span class="node__colon">:</span></span>
      <span v-if="isBranch" class="node__summary">{{ summary }}</span>
      <code v-else class="node__val" :class="`val--${type}`">{{ display }}</code>
    </div>
    <div v-if="isBranch && expanded" class="node__children">
      <JsonTree v-for="e in entries" :key="e.k" :data="e.v" :name="e.k" :depth="depth + 1" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.node {
  font-family: $font-mono;
  font-size: $text-sm;
  line-height: 1.7;
}

.node__row {
  display: flex;
  align-items: baseline;
  gap: spacing(1.5);
  border-radius: $radius-xs;
  padding-inline: spacing(1);

  &.is-branch {
    cursor: pointer;
    &:hover { background: var(--color-surface-2); }
  }
}

.node__toggle {
  width: 1em;
  flex-shrink: 0;
  color: var(--color-text-subtle);
  user-select: none;
}

.node__key {
  color: var(--syntax-key);
}

.node__colon {
  color: var(--color-text-subtle);
  margin-right: spacing(1);
}

.node__summary {
  color: var(--color-text-subtle);
}

.node__val {
  word-break: break-word;

  &.val--string { color: var(--syntax-string); }
  &.val--number { color: var(--syntax-number); }
  &.val--boolean,
  &.val--null { color: var(--syntax-literal); }
}

.node__children {
  padding-left: spacing(4);
  border-left: 1px solid var(--color-border);
  margin-left: spacing(2);
}
</style>
