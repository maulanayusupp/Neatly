<script setup lang="ts">
import { describeCron, nextRuns } from '~/utils/cron'

const { t, locale } = useI18n()

const expr = ref('*/5 * * * *')
const runs = ref<string[]>([])

const presets = [
  { expr: '* * * * *', key: 'everyMinute' },
  { expr: '*/5 * * * *', key: 'every5' },
  { expr: '0 * * * *', key: 'hourly' },
  { expr: '0 0 * * *', key: 'daily' },
  { expr: '0 9 * * 1-5', key: 'weekdays' },
  { expr: '0 0 1 * *', key: 'monthly' },
]
const fieldKeys = ['minute', 'hour', 'dom', 'month', 'dow']

const result = computed(() => {
  const e = expr.value.trim()
  if (!e) return { desc: '', valid: false, empty: true }
  try {
    return { desc: describeCron(e, locale.value), valid: true, empty: false }
  }
  catch {
    return { desc: '', valid: false, empty: false }
  }
})

function updateRuns() {
  if (!result.value.valid) { runs.value = []; return }
  try {
    runs.value = nextRuns(expr.value.trim(), 5).map(d => d.toLocaleString())
  }
  catch {
    runs.value = []
  }
}
onMounted(updateRuns)
watch(expr, updateRuns)

useSeoMeta({
  title: () => t('cronTool.metaTitle'),
  description: () => t('cronTool.metaDesc'),
  ogTitle: () => t('cronTool.metaTitle'),
  ogDescription: () => t('cronTool.metaDesc'),
  twitterTitle: () => t('cronTool.metaTitle'),
  twitterDescription: () => t('cronTool.metaDesc'),
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/cron' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="clock"
      :badge="$t('cronTool.badge')"
      :title="$t('cronTool.titleA')"
      :gradient="$t('cronTool.titleHl')"
      :lead="$t('cronTool.lead')"
    />

    <section class="container tool-outlet cron">
      <div class="tool-panel">
        <label class="cron__label">{{ $t('cronTool.expression') }}</label>
        <div class="cron__expr">
          <input
            v-model="expr"
            class="cron__input"
            :class="{ 'has-error': !result.valid && !result.empty }"
            spellcheck="false"
            autocomplete="off"
          >
        </div>
        <div class="cron__fields" aria-hidden="true">
          <span v-for="(k, i) in fieldKeys" :key="k" class="cron__field">
            <code>{{ expr.trim().split(/\s+/)[i] || '·' }}</code>
            <span>{{ $t(`cronTool.fields.${k}`) }}</span>
          </span>
        </div>
        <div class="cron__presets">
          <span class="cron__presets-label">{{ $t('cronTool.presetsLabel') }}</span>
          <button v-for="p in presets" :key="p.key" type="button" class="cron__preset" @click="expr = p.expr">
            {{ $t(`cronTool.presets.${p.key}`) }}
          </button>
        </div>
      </div>

      <div v-if="result.valid" class="cron__out">
        <div class="tool-panel cron__desc-panel">
          <h2 class="cron__h">{{ $t('cronTool.description') }}</h2>
          <p class="cron__desc">{{ result.desc }}</p>
        </div>
        <div class="tool-panel cron__runs-panel">
          <h2 class="cron__h">{{ $t('cronTool.nextRuns') }}</h2>
          <ul class="cron__runs" role="list">
            <li v-for="(r, i) in runs" :key="i"><BaseIcon name="clock" :size="14" /> {{ r }}</li>
          </ul>
        </div>
      </div>
      <p v-else-if="!result.empty" class="cron__error">
        <BaseIcon name="alert" :size="16" /> {{ $t('cronTool.invalid') }}
      </p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.cron {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.cron__label {
  display: block;
  margin-bottom: spacing(2);
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.cron__input {
  width: 100%;
  padding: spacing(3) spacing(4);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text);
  font-family: $font-mono;
  font-size: $text-xl;
  letter-spacing: 0.1em;

  &:focus { outline: none; border-color: var(--color-primary); }
  &.has-error { border-color: var(--color-danger); }
}

.cron__fields {
  margin-top: spacing(3);
  display: flex;
  flex-wrap: wrap;
  gap: spacing(2);
}

.cron__field {
  display: inline-flex;
  align-items: center;
  gap: spacing(1.5);
  padding: spacing(1) spacing(2.5);
  border-radius: $radius-pill;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  font-size: $text-xs;
  color: var(--color-text-subtle);

  code { font-family: $font-mono; font-weight: 700; color: var(--color-primary); }
}

.cron__presets {
  margin-top: spacing(4);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: spacing(2);
}

.cron__presets-label {
  font-size: $text-sm;
  font-weight: 600;
  color: var(--color-text-subtle);
}

.cron__preset {
  @include button-reset;
  padding: spacing(1.5) spacing(3);
  border-radius: $radius-pill;
  border: 1px solid var(--color-border);
  font-size: $text-sm;
  color: var(--color-text-muted);

  &:hover { color: var(--color-primary); border-color: var(--color-primary); background: var(--color-brand-soft); }
}

.cron__out {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('md') { grid-template-columns: 1fr 1fr; }
}

.cron__h {
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
  margin-bottom: spacing(3);
}

.cron__desc {
  font-size: $text-xl;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text);
}

.cron__runs {
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: spacing(2);

  li {
    display: flex;
    align-items: center;
    gap: spacing(2);
    font-family: $font-mono;
    font-size: $text-sm;
    color: var(--color-text-muted);
  }
}

.cron__error {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  padding: spacing(3) spacing(4);
  border-radius: $radius-md;
  background: var(--color-danger-soft);
  color: var(--color-danger);
  font-size: $text-sm;
  font-weight: 600;
}
</style>
