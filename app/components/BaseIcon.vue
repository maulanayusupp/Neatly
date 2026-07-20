<script setup lang="ts">
import type { IconName } from '~/utils/icons'
import { ICONS } from '~/utils/icons'

const props = withDefaults(defineProps<{
  name: IconName
  size?: number | string
}>(), {
  size: 20,
})

const markup = computed(() => ICONS[props.name])
</script>

<template>
  <svg
    class="base-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    v-html="markup"
  />
</template>

<style scoped lang="scss">
.base-icon {
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
}
</style>
