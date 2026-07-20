<script setup lang="ts">
import type { CompareReport, DiffCell, DiffRow } from '#shared/utils/json-compare'

const props = defineProps<{ report: CompareReport }>()

const summary = computed(() => [
  { label: 'Inputs', value: props.report.labels.length },
  { label: 'Fields compared', value: props.report.totalPaths },
  { label: 'Differences', value: props.report.diffCount },
])

const conclusionIcon = (tone: string) =>
  tone === 'success' ? 'check' : tone === 'warn' ? 'alert' : 'sparkles'

function cellState(row: DiffRow, index: number): 'outlier' | 'diff' | 'missing' | 'same' {
  const cell = row.cells[index]!
  if (!cell.present) return 'missing'
  if (row.outlierIndex === index) return 'outlier'
  if (row.outlierIndex === null) return 'diff'
  return 'same'
}

const valueClass = (cell: DiffCell) => `val--${cell.type}`
</script>

<template>
  <div class="result">
    <!-- Conclusion -->
    <div class="result__conclusion">
      <h2 class="result__heading">
        <BaseIcon name="layers" :size="18" />
        Conclusion
      </h2>
      <ul class="result__list" role="list">
        <li
          v-for="(item, i) in report.conclusions"
          :key="i"
          class="result__item"
          :class="`is-${item.tone}`"
        >
          <BaseIcon :name="conclusionIcon(item.tone)" :size="16" />
          <span>{{ item.text }}</span>
        </li>
      </ul>

      <div class="result__summary">
        <div v-for="stat in summary" :key="stat.label" class="result__stat">
          <span class="result__stat-value">{{ stat.value }}</span>
          <span class="result__stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <!-- Identical -->
    <div v-if="report.identical" class="result__identical">
      <BaseIcon name="check" :size="30" />
      <p>All inputs match. There are no differences to show.</p>
    </div>

    <!-- Diff table -->
    <div v-else class="result__table-wrap">
      <div class="result__legend" aria-hidden="true">
        <span class="legend legend--outlier">Odd one out</span>
        <span class="legend legend--diff">Differs</span>
        <span class="legend legend--missing">Missing</span>
      </div>

      <div class="result__scroll">
        <table class="difftable">
          <thead>
            <tr>
              <th class="difftable__field">Field</th>
              <th v-for="label in report.labels" :key="label" scope="col">JSON {{ label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in report.rows" :key="row.path">
              <th class="difftable__field" scope="row">{{ row.path }}</th>
              <td
                v-for="(cell, index) in row.cells"
                :key="index"
                :class="`cell--${cellState(row, index)}`"
              >
                <span v-if="!cell.present" class="cell__missing">—</span>
                <code v-else class="cell__value" :class="valueClass(cell)">{{ cell.display }}</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.result {
  display: flex;
  flex-direction: column;
  gap: spacing(4);
}

/* Conclusion ------------------------------------------------------------- */
.result__conclusion {
  padding: spacing(5);
  @include card;
}

.result__heading {
  display: inline-flex;
  align-items: center;
  gap: spacing(2);
  font-size: $text-lg;
}

.result__list {
  margin-top: spacing(4);
  display: flex;
  flex-direction: column;
  gap: spacing(2);
}

.result__item {
  display: flex;
  align-items: flex-start;
  gap: spacing(2.5);
  padding: spacing(2.5) spacing(3);
  border-radius: $radius-md;
  font-size: $text-sm;
  line-height: 1.5;
  background: var(--color-surface-2);
  color: var(--color-text);

  &.is-success {
    color: var(--color-success);
    background: var(--color-success-soft);
  }
  &.is-warn {
    color: var(--color-primary);
    background: var(--color-brand-soft);
  }

  svg {
    margin-top: 2px;
  }
}

.result__summary {
  margin-top: spacing(5);
  display: flex;
  flex-wrap: wrap;
  gap: spacing(3);
}

.result__stat {
  display: flex;
  flex-direction: column;
  padding: spacing(3) spacing(5);
  border-radius: $radius-md;
  background: var(--color-surface-2);
  min-width: 7rem;
}

.result__stat-value {
  font-size: $text-2xl;
  font-weight: 800;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.result__stat-label {
  font-size: $text-xs;
  color: var(--color-text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Identical -------------------------------------------------------------- */
.result__identical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: spacing(3);
  padding: spacing(10) spacing(6);
  @include card;
  color: var(--color-success);
  text-align: center;
  font-weight: 600;
}

/* Table ------------------------------------------------------------------ */
.result__table-wrap {
  @include card;
  overflow: hidden;
}

.result__legend {
  display: flex;
  flex-wrap: wrap;
  gap: spacing(4);
  padding: spacing(3) spacing(4);
  border-bottom: 1px solid var(--color-border);
  font-size: $text-xs;
  font-weight: 600;
  color: var(--color-text-muted);
}

.legend {
  display: inline-flex;
  align-items: center;
  gap: spacing(1.5);

  &::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 4px;
  }
  &--outlier::before {
    background: var(--color-danger-soft);
    border: 1px solid var(--color-danger);
  }
  &--diff::before {
    background: var(--color-brand-soft);
    border: 1px solid var(--color-primary);
  }
  &--missing::before {
    background: var(--color-surface-3);
    border: 1px dashed var(--color-border-strong);
  }
}

.result__scroll {
  overflow-x: auto;
  @include custom-scrollbar;
}

.difftable {
  width: 100%;
  border-collapse: collapse;
  font-size: $text-sm;

  th,
  td {
    padding: spacing(3) spacing(4);
    text-align: left;
    border-bottom: 1px solid var(--color-border);
    vertical-align: top;
    white-space: nowrap;
  }

  thead th {
    position: sticky;
    top: 0;
    font-size: $text-xs;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-subtle);
    background: var(--color-surface-2);
    font-weight: 700;
  }

  tbody tr:last-child th,
  tbody tr:last-child td {
    border-bottom: 0;
  }
}

.difftable__field {
  font-family: $font-mono;
  font-weight: 600;
  color: var(--color-text);
  background: var(--color-surface-2);
}

.cell--outlier {
  background: var(--color-danger-soft);
  box-shadow: inset 3px 0 0 var(--color-danger);
}
.cell--diff {
  background: var(--color-brand-soft);
}
.cell--missing {
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 6px,
    var(--color-surface-2) 6px,
    var(--color-surface-2) 12px
  );
}

.cell__missing {
  color: var(--color-text-subtle);
}

.cell__value {
  font-family: $font-mono;
  color: var(--color-text);

  &.val--string { color: var(--syntax-string); }
  &.val--number { color: var(--syntax-number); }
  &.val--boolean,
  &.val--null { color: var(--syntax-literal); }
  &.val--array,
  &.val--object { color: var(--syntax-punct); }
}
</style>
