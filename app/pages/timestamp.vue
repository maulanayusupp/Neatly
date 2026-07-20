<script setup lang="ts">
const toast = useToast()
const tsInput = ref('')
const dtInput = ref('')

function setNow() {
  tsInput.value = String(Math.floor(Date.now() / 1000))
}
onMounted(setNow)

const fromTimestamp = computed(() => {
  const raw = tsInput.value.trim()
  if (!/^\d+$/.test(raw)) return null
  const ms = raw.length >= 13 ? Number(raw) : Number(raw) * 1000
  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) return null
  return {
    local: date.toLocaleString(),
    utc: date.toUTCString(),
    iso: date.toISOString(),
    relative: relativeTime(date),
  }
})

const toTimestamp = computed(() => {
  if (!dtInput.value) return null
  const date = new Date(dtInput.value)
  if (Number.isNaN(date.getTime())) return null
  const seconds = Math.floor(date.getTime() / 1000)
  return { seconds, millis: date.getTime() }
})

function relativeTime(date: Date): string {
  const diff = date.getTime() - Date.now()
  const abs = Math.abs(diff)
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60_000, 'second'], [3_600_000, 'minute'], [86_400_000, 'hour'],
    [2_592_000_000, 'day'], [31_536_000_000, 'month'], [Infinity, 'year'],
  ]
  const divisors = [1000, 60_000, 3_600_000, 86_400_000, 2_592_000_000, 31_536_000_000]
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  for (let i = 0; i < units.length; i++) {
    if (abs < units[i]![0]) {
      return rtf.format(Math.round(diff / divisors[i]!), units[i]![1])
    }
  }
  return ''
}

async function copy(value: string | number) {
  if (await copyText(String(value))) toast.success('Copied')
}

const pageTitle = 'Unix Timestamp Converter — Epoch to Date & Back Online · Neatly'
const pageDescription
  = 'Free online Unix timestamp converter. Convert an epoch timestamp to a human-readable date (local, UTC, ISO) and turn a date back into a timestamp. Private, instant, no sign-up.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/timestamp' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="clock"
      badge="Epoch ↔ date · local · UTC · ISO"
      title="Unix timestamp"
      gradient="converter"
      lead="Convert a Unix (epoch) timestamp to a readable date, or turn any date back into a timestamp."
    />

    <section class="container tool-outlet ts">
      <div class="tool-panel">
        <div class="ts__head">
          <h2 class="ts__title">Timestamp → Date</h2>
          <BaseButton size="sm" variant="ghost" icon="clock" @click="setNow">Now</BaseButton>
        </div>
        <input v-model="tsInput" class="ts__input" inputmode="numeric" placeholder="1700000000">
        <ul v-if="fromTimestamp" class="ts__out" role="list">
          <li><span>Local</span><code @click="copy(fromTimestamp.local)">{{ fromTimestamp.local }}</code></li>
          <li><span>UTC</span><code @click="copy(fromTimestamp.utc)">{{ fromTimestamp.utc }}</code></li>
          <li><span>ISO 8601</span><code @click="copy(fromTimestamp.iso)">{{ fromTimestamp.iso }}</code></li>
          <li><span>Relative</span><code>{{ fromTimestamp.relative }}</code></li>
        </ul>
        <p v-else class="ts__hint">Enter a Unix timestamp in seconds or milliseconds.</p>
      </div>

      <div class="tool-panel">
        <h2 class="ts__title">Date → Timestamp</h2>
        <input v-model="dtInput" class="ts__input" type="datetime-local">
        <ul v-if="toTimestamp" class="ts__out" role="list">
          <li><span>Seconds</span><code @click="copy(toTimestamp.seconds)">{{ toTimestamp.seconds }}</code></li>
          <li><span>Milliseconds</span><code @click="copy(toTimestamp.millis)">{{ toTimestamp.millis }}</code></li>
        </ul>
        <p v-else class="ts__hint">Pick a date and time to get its Unix timestamp.</p>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.ts {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('md') {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}

.ts__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ts__title {
  font-size: $text-base;
  margin-bottom: spacing(3);
}
.ts__head .ts__title { margin-bottom: 0; }

.ts__input {
  width: 100%;
  margin-top: spacing(3);
  padding: spacing(3) spacing(4);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text);
  font-family: $font-mono;
  font-size: $text-base;

  &:focus { outline: none; border-color: var(--color-primary); }
}

.ts__out {
  margin-top: spacing(4);
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: spacing(2);

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: spacing(3);
    padding: spacing(2.5) spacing(3);
    border-radius: $radius-md;
    background: var(--color-surface-2);
  }
  span {
    font-size: $text-xs;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-subtle);
  }
  code {
    font-family: $font-mono;
    font-size: $text-sm;
    color: var(--color-text);
    cursor: pointer;
    text-align: right;
    word-break: break-all;
    &:hover { color: var(--color-primary); }
  }
}

.ts__hint {
  margin-top: spacing(4);
  color: var(--color-text-subtle);
  font-size: $text-sm;
}
</style>
