<script setup lang="ts">
import type { RobotsGroup } from '~/utils/robots'
import { generateRobots } from '~/utils/robots'

const { t } = useI18n()
const toast = useToast()
const copied = ref(false)

interface EditGroup { userAgent: string, disallow: string, allow: string, crawlDelay: string }

function blankGroup(userAgent = '*'): EditGroup {
  return { userAgent, disallow: '', allow: '', crawlDelay: '' }
}

const groups = ref<EditGroup[]>([blankGroup()])
const sitemaps = ref('https://example.com/sitemap.xml')
const host = ref('')

const lines = (s: string) => s.split('\n').map(x => x.trim()).filter(Boolean)

const output = computed(() => generateRobots({
  groups: groups.value.map<RobotsGroup>(g => ({
    userAgent: g.userAgent,
    disallow: lines(g.disallow),
    allow: lines(g.allow),
    crawlDelay: g.crawlDelay,
  })),
  sitemaps: lines(sitemaps.value),
  host: host.value,
}))

const presets = [
  { key: 'allowAll', apply: () => { groups.value = [blankGroup()] } },
  { key: 'blockAll', apply: () => { groups.value = [{ ...blankGroup(), disallow: '/' }] } },
  { key: 'blockCommon', apply: () => { groups.value = [{ ...blankGroup(), disallow: '/admin\n/cart\n/checkout\n/*?*' }] } },
  { key: 'blockAi', apply: () => { groups.value = [{ ...blankGroup('GPTBot'), disallow: '/' }, { ...blankGroup('CCBot'), disallow: '/' }, blankGroup('*')] } },
]

function addGroup() {
  groups.value.push(blankGroup(''))
}
function removeGroup(i: number) {
  groups.value.splice(i, 1)
}
async function copy() {
  if (await copyText(output.value)) {
    copied.value = true
    toast.success(t('common.copied'))
    setTimeout(() => (copied.value = false), 1600)
  }
}
function download() {
  downloadText('robots.txt', output.value, 'text/plain')
  toast.success(t('common.download'))
}

useSeoMeta({
  title: () => t('robotsTxt.metaTitle'),
  description: () => t('robotsTxt.metaDesc'),
  ogTitle: () => t('robotsTxt.metaTitle'),
  ogDescription: () => t('robotsTxt.metaDesc'),
  twitterTitle: () => t('robotsTxt.metaTitle'),
  twitterDescription: () => t('robotsTxt.metaDesc'),
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/robots-txt' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="shield"
      :badge="$t('robotsTxt.badge')"
      :title="$t('robotsTxt.titleA')"
      :gradient="$t('robotsTxt.titleHl')"
      :lead="$t('robotsTxt.lead')"
    />

    <section class="container tool-outlet rb">
      <div class="rb__grid">
        <div class="rb__form">
          <div class="tool-panel rb__section">
            <span class="rb__h">{{ $t('robotsTxt.presets') }}</span>
            <div class="rb__chips">
              <button v-for="p in presets" :key="p.key" type="button" class="rb__chip" @click="p.apply()">{{ $t(`robotsTxt.preset.${p.key}`) }}</button>
            </div>
          </div>

          <div v-for="(g, i) in groups" :key="i" class="tool-panel rb__section">
            <div class="rb__bar">
              <span class="rb__h">{{ $t('robotsTxt.group') }} {{ i + 1 }}</span>
              <button v-if="groups.length > 1" type="button" class="rb__del" :aria-label="$t('robotsTxt.removeGroup')" @click="removeGroup(i)"><BaseIcon name="trash" :size="16" /></button>
            </div>
            <label class="rb__field">
              <span class="rb__label">{{ $t('robotsTxt.userAgent') }}</span>
              <input v-model="g.userAgent" class="rb__input" spellcheck="false" placeholder="*">
            </label>
            <div class="rb__row">
              <label class="rb__field">
                <span class="rb__label">{{ $t('robotsTxt.disallow') }}</span>
                <textarea v-model="g.disallow" class="rb__input rb__area" spellcheck="false" :placeholder="'/admin\n/private'" />
              </label>
              <label class="rb__field">
                <span class="rb__label">{{ $t('robotsTxt.allow') }}</span>
                <textarea v-model="g.allow" class="rb__input rb__area" spellcheck="false" placeholder="/admin/public" />
              </label>
            </div>
            <label class="rb__field">
              <span class="rb__label">{{ $t('robotsTxt.crawlDelay') }}</span>
              <input v-model="g.crawlDelay" class="rb__input" spellcheck="false" placeholder="10" inputmode="numeric">
            </label>
          </div>

          <BaseButton size="sm" variant="ghost" icon="plus" @click="addGroup">{{ $t('robotsTxt.addGroup') }}</BaseButton>

          <div class="tool-panel rb__section">
            <label class="rb__field">
              <span class="rb__label">{{ $t('robotsTxt.sitemaps') }}</span>
              <textarea v-model="sitemaps" class="rb__input rb__area" spellcheck="false" placeholder="https://example.com/sitemap.xml" />
            </label>
            <label class="rb__field">
              <span class="rb__label">{{ $t('robotsTxt.host') }}</span>
              <input v-model="host" class="rb__input" spellcheck="false" placeholder="example.com">
            </label>
          </div>
        </div>

        <div class="tool-panel rb__output">
          <div class="rb__bar">
            <span class="rb__h">robots.txt</span>
            <div class="rb__actions">
              <BaseButton size="sm" variant="ghost" :icon="copied ? 'check' : 'copy'" @click="copy">{{ copied ? $t('common.copied') : $t('common.copy') }}</BaseButton>
              <BaseButton size="sm" variant="ghost" icon="download" @click="download">{{ $t('common.download') }}</BaseButton>
            </div>
          </div>
          <pre class="rb__pre"><code>{{ output }}</code></pre>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.rb__grid {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('lg') { grid-template-columns: 1fr 1fr; align-items: start; }
}

.rb__form { display: flex; flex-direction: column; gap: spacing(4); }

.rb__section { display: flex; flex-direction: column; gap: spacing(3); }

.rb__bar { display: flex; align-items: center; justify-content: space-between; gap: spacing(3); }

.rb__h {
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.rb__chips { display: flex; flex-wrap: wrap; gap: spacing(2); }

.rb__chip {
  @include button-reset;
  padding: spacing(1.5) spacing(3);
  border-radius: $radius-pill;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  font-size: $text-sm;
  color: var(--color-text-muted);

  &:hover { color: var(--color-primary); border-color: var(--color-primary); background: var(--color-brand-soft); }
}

.rb__field { display: flex; flex-direction: column; gap: spacing(2); }

.rb__row { display: grid; grid-template-columns: 1fr 1fr; gap: spacing(3); }

.rb__label { font-size: $text-xs; font-weight: 600; color: var(--color-text-muted); }

.rb__input {
  padding: spacing(2.5) spacing(3);
  border-radius: $radius-md;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text);
  font-family: $font-mono;
  font-size: $text-sm;

  &:focus { outline: none; border-color: var(--color-primary); }
}

.rb__area { min-height: 84px; resize: vertical; line-height: 1.6; }

.rb__del {
  @include button-reset;
  padding: spacing(1.5);
  border-radius: $radius-sm;
  color: var(--color-text-muted);
  &:hover { color: var(--color-danger); background: var(--color-danger-soft); }
}

.rb__actions { display: flex; gap: spacing(1); }

.rb__pre {
  margin: 0;
  padding: spacing(4);
  border-radius: $radius-md;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  overflow: auto;
  min-height: 240px;
  font-family: $font-mono;
  font-size: $text-sm;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--color-text);
  @include custom-scrollbar;
}
</style>
