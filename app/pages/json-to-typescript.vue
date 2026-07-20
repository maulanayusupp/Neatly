<script setup lang="ts">
const toast = useToast()
const input = ref('')
const rootName = ref('Root')
const output = ref('')
const error = ref('')
const copied = ref(false)

const SAMPLE = '{\n  "id": 1,\n  "name": "Neatly",\n  "active": true,\n  "tags": ["dev", "tools"],\n  "owner": { "name": "Maulana", "email": "hi@example.com" }\n}'

async function generate() {
  error.value = ''
  if (!input.value.trim()) { output.value = ''; return }
  let obj: unknown
  try {
    obj = JSON.parse(input.value)
  }
  catch (e) {
    error.value = `Invalid JSON: ${(e as Error).message}`
    output.value = ''
    return
  }
  try {
    const JsonToTS = (await import('json-to-ts')).default
    output.value = JsonToTS(obj, { rootName: rootName.value.trim() || 'Root' }).join('\n\n')
  }
  catch {
    error.value = 'Could not generate TypeScript from this JSON.'
    output.value = ''
  }
}

watch([input, rootName], generate)
onMounted(() => { if (!input.value) input.value = SAMPLE })

async function copy() {
  if (output.value && await copyText(output.value)) {
    copied.value = true
    toast.success('Copied')
    setTimeout(() => (copied.value = false), 1600)
  }
}

function download() {
  if (output.value) {
    downloadText('types.ts', output.value, 'text/typescript')
    toast.success('Downloaded types.ts')
  }
}

const { t } = useI18n()

useSeoMeta({
  title: () => t('jsonToTs.metaTitle'),
  description: () => t('jsonToTs.metaDesc'),
  ogTitle: () => t('jsonToTs.metaTitle'),
  ogDescription: () => t('jsonToTs.metaDesc'),
  twitterTitle: () => t('jsonToTs.metaTitle'),
  twitterDescription: () => t('jsonToTs.metaDesc'),
})
useHead({ link: [{ rel: 'canonical', href: 'https://neatlyapp.vercel.app/json-to-typescript' }] })
</script>

<template>
  <div>
    <ToolHero
      icon="braces"
      :badge="$t('jsonToTs.badge')"
      :title="$t('jsonToTs.titleA')"
      :gradient="$t('jsonToTs.titleHl')"
      :lead="$t('jsonToTs.lead')"
    />

    <section class="container tool-outlet jtt">
      <div class="jtt__bar">
        <label class="jtt__root">
          <span>{{ $t('jsonToTs.rootName') }}</span>
          <input v-model="rootName" spellcheck="false" placeholder="Root">
        </label>
        <BaseButton size="sm" variant="ghost" icon="sparkles" @click="input = SAMPLE">
          {{ $t('common.example') }}
        </BaseButton>
      </div>

      <div class="jtt__grid">
        <EditorPane
          v-model="input"
          title="JSON"
          icon="code"
          language="json"
          placeholder="Paste JSON here…"
        />
        <EditorPane
          :model-value="output"
          title="TypeScript"
          icon="braces"
          language="typescript"
          readonly
          :empty-text="$t('jsonToTs.empty')"
        >
          <template #actions>
            <BaseButton size="sm" variant="ghost" :icon="copied ? 'check' : 'copy'" :disabled="!output" @click="copy">
              {{ copied ? $t('common.copied') : $t('common.copy') }}
            </BaseButton>
            <BaseButton size="sm" variant="ghost" icon="download" :disabled="!output" @click="download">{{ $t('common.download') }}</BaseButton>
          </template>
        </EditorPane>
      </div>

      <p v-if="error" class="jtt__error"><BaseIcon name="alert" :size="16" /> {{ error }}</p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.jtt {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.jtt__bar {
  @include card;
  padding: spacing(4);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: spacing(3);
}

.jtt__root {
  display: flex;
  align-items: center;
  gap: spacing(3);
  font-size: $text-sm;

  > span {
    font-weight: 600;
    color: var(--color-text-muted);
  }

  input {
    width: 200px;
    padding: spacing(2) spacing(3);
    border-radius: $radius-md;
    border: 1px solid var(--color-border);
    background: var(--color-surface-2);
    color: var(--color-text);
    font-family: $font-mono;
    font-size: $text-sm;
    &:focus { outline: none; border-color: var(--color-primary); }
  }
}

.jtt__grid {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('lg') { grid-template-columns: 1fr 1fr; }

  :deep(.pane) {
    height: 60vh;
    min-height: 380px;
  }
}

.jtt__error {
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
