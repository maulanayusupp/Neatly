import { describe, expect, it } from 'vitest'
import { formatSql } from '../app/utils/sql'

describe('sql', () => {
  it('formats and upper-cases keywords', () => {
    const out = formatSql('select id,name from users where id=1', {
      dialect: 'sql', keywordCase: 'upper', tabWidth: 2,
    })
    expect(out).toContain('SELECT')
    expect(out).toContain('FROM')
    expect(out).toContain('WHERE')
    expect(out.split('\n').length).toBeGreaterThan(1)
  })

  it('can lower-case keywords', () => {
    const out = formatSql('SELECT 1', { dialect: 'sql', keywordCase: 'lower', tabWidth: 2 })
    expect(out.toLowerCase()).toContain('select')
  })
})
