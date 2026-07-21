<script setup lang="ts">
import type { KeywordCase, SqlDialect } from '~/utils/sql'
import { SQL_DIALECTS, formatSql } from '~/utils/sql'

const { t } = useI18n()
const toast = useToast()

const input = ref('select id, name, email from users u join orders o on o.user_id = u.id where u.active = 1 order by o.created_at desc limit 10;')
const dialect = ref<SqlDialect>('sql')
const keywordCase = ref<KeywordCase>('upper')
const tabWidth = ref(2)
const copied = ref(false)

const result = computed(() => {
  if (!input.value.trim()) return { out: '', error: '' }
  try {
    return { out: formatSql(input.value, { dialect: dialect.value, keywordCase: keywordCase.value, tabWidth: tabWidth.value }), error: '' }
  }
  catch {
    return { out: '', error: t('sqlTool.error') }
  }
})

async function copy() {
  if (result.value.out && await copyText(result.value.out)) {
    copied.value = true
    toast.success(t('common.copied'))
    setTimeout(() => (copied.value = false), 1600)
  }
}
function download() {
  if (result.value.out) {
    downloadText('query.sql', result.value.out, 'text/plain')
    toast.success(t('common.download'))
  }
}

useSeoMeta({
  title: () => t('sqlTool.metaTitle'),
  description: () => t('sqlTool.metaDesc'),
  ogTitle: () => t('sqlTool.metaTitle'),
  ogDescription: () => t('sqlTool.metaDesc'),
  twitterTitle: () => t('sqlTool.metaTitle'),
  twitterDescription: () => t('sqlTool.metaDesc'),
})
</script>

<template>
  <div>
    <ToolHero
      icon="code"
      :badge="$t('sqlTool.badge')"
      :title="$t('sqlTool.titleA')"
      :gradient="$t('sqlTool.titleHl')"
      :lead="$t('sqlTool.lead')"
    />

    <section class="container tool-outlet sql">
      <div class="tool-panel sql__toolbar">
        <label class="sql__opt">
          <span>{{ $t('sqlTool.dialect') }}</span>
          <select v-model="dialect">
            <option v-for="d in SQL_DIALECTS" :key="d" :value="d">{{ d }}</option>
          </select>
        </label>
        <label class="sql__opt">
          <span>{{ $t('sqlTool.keywordCase') }}</span>
          <select v-model="keywordCase">
            <option value="upper">{{ $t('sqlTool.upper') }}</option>
            <option value="lower">{{ $t('sqlTool.lower') }}</option>
            <option value="preserve">{{ $t('sqlTool.preserve') }}</option>
          </select>
        </label>
        <label class="sql__opt">
          <span>{{ $t('common.input') }}</span>
          <select v-model.number="tabWidth">
            <option :value="2">2</option>
            <option :value="4">4</option>
          </select>
        </label>
      </div>

      <div class="sql__grid">
        <EditorPane
          v-model="input"
          :title="$t('common.input')"
          icon="code"
          language="sql"
          :placeholder="$t('sqlTool.placeholder')"
        />
        <EditorPane
          :model-value="result.out"
          :title="$t('sqlTool.titleA')"
          icon="sparkles"
          language="sql"
          readonly
          :empty-text="$t('sqlTool.empty')"
        >
          <template #actions>
            <BaseButton size="sm" variant="ghost" :icon="copied ? 'check' : 'copy'" :disabled="!result.out" @click="copy">{{ copied ? $t('common.copied') : $t('common.copy') }}</BaseButton>
            <BaseButton size="sm" variant="ghost" icon="download" :disabled="!result.out" @click="download">{{ $t('common.download') }}</BaseButton>
          </template>
        </EditorPane>
      </div>

      <p v-if="result.error" class="sql__error"><BaseIcon name="alert" :size="16" /> {{ result.error }}</p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.sql {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

.sql__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(4);
}

.sql__opt {
  display: flex;
  flex-direction: column;
  gap: spacing(1.5);
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);

  select {
    padding: spacing(2) spacing(3);
    border-radius: $radius-md;
    border: 1px solid var(--color-border);
    background: var(--color-surface-2);
    color: var(--color-text);
    font-size: $text-sm;
    font-weight: 600;
    text-transform: none;
  }
}

.sql__grid {
  display: grid;
  gap: spacing(4);
  grid-template-columns: 1fr;

  @include respond('lg') { grid-template-columns: 1fr 1fr; }

  :deep(.pane) { height: 58vh; min-height: 360px; }
}

.sql__error {
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
