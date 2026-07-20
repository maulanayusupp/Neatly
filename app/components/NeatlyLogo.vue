<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
  showWordmark?: boolean
}>(), {
  size: 32,
  showWordmark: true,
})
</script>

<template>
  <span class="logo">
    <svg
      class="logo__mark"
      :width="size"
      :height="size"
      viewBox="0 0 40 40"
      role="img"
      aria-label="Neatly"
    >
      <defs>
        <linearGradient id="neatly-logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#6366f1" />
          <stop offset="0.55" stop-color="#8b5cf6" />
          <stop offset="1" stop-color="#d946ef" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#neatly-logo-gradient)" />
      <path
        fill="#fff"
        d="M17 9l2.1 6.9L26 18l-6.9 2.1L17 27l-2.1-6.9L8 18l6.9-2.1z"
      />
      <path
        fill="#fff"
        fill-opacity="0.85"
        d="M28 22l.9 3 3 .9-3 .9-.9 3-.9-3-3-.9 3-.9z"
      />
    </svg>
    <span v-if="showWordmark" class="logo__word">Neatly</span>
  </span>
</template>

<style scoped lang="scss">
.logo {
  display: inline-flex;
  align-items: center;
  gap: spacing(2.5);
}

.logo__mark {
  border-radius: $radius-md;
  box-shadow: var(--shadow-sm);
}

.logo__word {
  font-size: $text-xl;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-text);
}
</style>
