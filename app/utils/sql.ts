import { format } from 'sql-formatter'

export type SqlDialect =
  | 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'mariadb' | 'bigquery' | 'transactsql' | 'plsql'
export type KeywordCase = 'upper' | 'lower' | 'preserve'

export interface SqlOptions {
  dialect: SqlDialect
  keywordCase: KeywordCase
  tabWidth: number
}

export const SQL_DIALECTS: SqlDialect[] = [
  'sql', 'mysql', 'postgresql', 'sqlite', 'mariadb', 'bigquery', 'transactsql', 'plsql',
]

/** Format an SQL string. Returns the formatted SQL, or throws on failure. */
export function formatSql(input: string, opts: SqlOptions): string {
  return format(input, {
    language: opts.dialect,
    keywordCase: opts.keywordCase,
    tabWidth: opts.tabWidth,
  })
}
