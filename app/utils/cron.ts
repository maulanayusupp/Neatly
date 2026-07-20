import { CronExpressionParser } from 'cron-parser'
import cronstrue from 'cronstrue/i18n'

/** Human-readable description of a cron expression (localized where supported). */
export function describeCron(expr: string, locale = 'en'): string {
  try {
    return cronstrue.toString(expr, { locale, throwExceptionOnParseError: true })
  }
  catch {
    // Fall back to English if the locale isn't supported by cronstrue.
    return cronstrue.toString(expr, { locale: 'en', throwExceptionOnParseError: true })
  }
}

/** Next `count` run times for a cron expression (throws if invalid). */
export function nextRuns(expr: string, count = 5): Date[] {
  const it = CronExpressionParser.parse(expr)
  const out: Date[] = []
  for (let i = 0; i < count; i++) out.push(it.next().toDate())
  return out
}
