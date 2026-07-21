<script setup lang="ts">
import {
  allTimeZones,
  formatInZone,
  offsetLabel,
  toInputValue,
  zoneOffsetMinutes,
  zonedWallTimeToEpoch,
} from '~/utils/timezone'

const { t, locale } = useI18n()
const toast = useToast()

const zones = allTimeZones()
const localZone = ref('UTC')
const sourceZone = ref('UTC')
const dateStr = ref('') // "YYYY-MM-DDTHH:mm"
const addZone = ref('')
const targets = ref<string[]>([])

const DEFAULT_TARGETS = ['UTC', 'America/Los_Angeles', 'America/New_York', 'Europe/London', 'Asia/Singapore', 'Asia/Tokyo']

function setNow() {
  dateStr.value = toInputValue(Date.now(), sourceZone.value)
}

onMounted(() => {
  const lz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  localZone.value = lz
  sourceZone.value = zones.includes(lz) ? lz : 'UTC'
  setNow()
  targets.value = [lz, ...DEFAULT_TARGETS].filter((z, i, a) => zones.includes(z) && a.indexOf(z) === i).slice(0, 6)
})

// Re-anchor the wall-clock to the same instant when the source zone changes.
watch(sourceZone, (next, prev) => {
  if (!dateStr.value || next === prev) return
  const [d, tm] = dateStr.value.split('T')
  const [y, mo, dd] = d!.split('-').map(Number)
  const [h, mi] = tm!.split(':').map(Number)
  const epoch = zonedWallTimeToEpoch({ year: y!, month: mo!, day: dd!, hour: h!, minute: mi! }, prev)
  dateStr.value = toInputValue(epoch, next)
})

const epoch = computed(() => {
  if (!dateStr.value)
    return null
  const [d, tm] = dateStr.value.split('T')
  if (!d || !tm)
    return null
  const [y, mo, dd] = d.split('-').map(Number)
  const [h, mi] = tm.split(':').map(Number)
  return zonedWallTimeToEpoch({ year: y!, month: mo!, day: dd!, hour: h!, minute: mi! }, sourceZone.value)
})

const results = computed(() => {
  if (epoch.value == null)
    return []
  return targets.value.map(tz => ({
    tz,
    name: tz.replace(/_/g, ' '),
    time: formatInZone(epoch.value!, tz, locale.value),
    offset: offsetLabel(zoneOffsetMinutes(epoch.value!, tz)),
    isLocal: tz === localZone.value,
  }))
})

function addTarget() {
  if (addZone.value && !targets.value.includes(addZone.value))
    targets.value.push(addZone.value)
  addZone.value = ''
}
function removeTarget(tz: string) {
  targets.value = targets.value.filter(z => z !== tz)
}
async function copyTime(time: string) {
  if (await copyText(time))
    toast.success(t('common.copied'))
}

useSeoMeta({
  title: () => t('timezoneTool.metaTitle'),
  description: () => t('timezoneTool.metaDesc'),
  ogTitle: () => t('timezoneTool.metaTitle'),
  ogDescription: () => t('timezoneTool.metaDesc'),
  twitterTitle: () => t('timezoneTool.metaTitle'),
  twitterDescription: () => t('timezoneTool.metaDesc'),
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/timezone' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="clock"
      :badge="$t('timezoneTool.badge')"
      :title="$t('timezoneTool.titleA')"
      :gradient="$t('timezoneTool.titleHl')"
      :lead="$t('timezoneTool.lead')"
    />

    <section class="container tool-outlet tz">
      <ClientOnly>
        <div class="tool-panel tz__source">
          <label class="tz__field">
            <span class="tz__label">{{ $t('timezoneTool.dateTime') }}</span>
            <input v-model="dateStr" type="datetime-local" class="tz__input">
          </label>
          <label class="tz__field">
            <span class="tz__label">{{ $t('timezoneTool.sourceZone') }}</span>
            <select v-model="sourceZone" class="tz__select">
              <option v-for="z in zones" :key="z" :value="z">{{ z.replace(/_/g, ' ') }}</option>
            </select>
          </label>
          <BaseButton size="sm" icon="clock" @click="setNow">{{ $t('timezoneTool.now') }}</BaseButton>
        </div>

        <div class="tz__results">
          <div v-for="r in results" :key="r.tz" class="tool-panel tz__card">
            <div class="tz__card-head">
              <span class="tz__zone">
                {{ r.name }}
                <span v-if="r.isLocal" class="tz__local">{{ $t('timezoneTool.local') }}</span>
              </span>
              <span class="tz__offset">{{ r.offset }}</span>
            </div>
            <div class="tz__time-row">
              <span class="tz__time">{{ r.time }}</span>
              <div class="tz__actions">
                <button type="button" class="tz__icon" :aria-label="$t('common.copy')" @click="copyTime(r.time)">
                  <BaseIcon name="copy" :size="16" />
                </button>
                <button type="button" class="tz__icon" :aria-label="$t('timezoneTool.remove')" @click="removeTarget(r.tz)">
                  <BaseIcon name="trash" :size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="tool-panel tz__add">
          <label class="tz__field">
            <span class="tz__label">{{ $t('timezoneTool.addZone') }}</span>
            <select v-model="addZone" class="tz__select">
              <option value="">{{ $t('timezoneTool.pick') }}</option>
              <option v-for="z in zones" :key="z" :value="z" :disabled="targets.includes(z)">{{ z.replace(/_/g, ' ') }}</option>
            </select>
          </label>
          <BaseButton size="sm" icon="plus" :disabled="!addZone" @click="addTarget">{{ $t('timezoneTool.add') }}</BaseButton>
        </div>

        <template #fallback>
          <div class="tool-panel tz__loading">{{ $t('timezoneTool.loading') }}</div>
        </template>
      </ClientOnly>
    </section>
  </div>
</template>

<style scoped lang="scss">
.tz {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.tz__source,
.tz__add {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: spacing(4);
}

.tz__field {
  display: flex;
  flex-direction: column;
  gap: spacing(2);
  flex: 1;
  min-width: 200px;
}

.tz__label {
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.tz__input,
.tz__select {
  padding: spacing(3) spacing(4);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text);
  font-family: $font-mono;
  font-size: $text-sm;

  &:focus { outline: none; border-color: var(--color-primary); }
}

.tz__results {
  display: grid;
  gap: spacing(3);
  grid-template-columns: 1fr;

  @include respond('md') { grid-template-columns: 1fr 1fr; }
}

.tz__card {
  display: flex;
  flex-direction: column;
  gap: spacing(2);
}

.tz__card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: spacing(2);
}

.tz__zone {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  font-weight: 700;
  font-size: $text-sm;
  color: var(--color-text);
}

.tz__local {
  padding: spacing(0.5) spacing(2);
  border-radius: $radius-pill;
  background: var(--color-brand-soft);
  color: var(--color-primary);
  font-size: $text-xs;
  font-weight: 700;
}

.tz__offset {
  font-family: $font-mono;
  font-size: $text-xs;
  color: var(--color-text-subtle);
}

.tz__time-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: spacing(2);
}

.tz__time {
  font-family: $font-mono;
  font-size: $text-lg;
  color: var(--color-primary);
}

.tz__actions {
  display: flex;
  gap: spacing(1);
}

.tz__icon {
  @include button-reset;
  padding: spacing(2);
  border-radius: $radius-sm;
  color: var(--color-text-muted);

  &:hover { color: var(--color-primary); background: var(--color-surface-2); }
}

.tz__loading {
  text-align: center;
  color: var(--color-text-subtle);
  font-size: $text-sm;
}
</style>
