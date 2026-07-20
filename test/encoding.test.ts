import { describe, expect, it } from 'vitest'
import { base64Decode, base64Encode, decodeJwt } from '../app/utils/encoding'

describe('encoding', () => {
  it('round-trips UTF-8 through Base64', () => {
    const text = 'Hello, 世界 👋'
    expect(base64Decode(base64Encode(text))).toBe(text)
  })

  it('decodes a JWT header and payload', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiTmVhdGx5In0.sig'
    const decoded = decodeJwt(token)
    expect((decoded.header as { alg: string }).alg).toBe('HS256')
    expect((decoded.payload as { name: string }).name).toBe('Neatly')
  })

  it('throws on a malformed JWT', () => {
    expect(() => decodeJwt('not-a-token')).toThrow()
  })
})
