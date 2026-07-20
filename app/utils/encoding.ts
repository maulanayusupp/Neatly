/** UTF-8-safe Base64 encode. */
export function base64Encode(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  bytes.forEach(b => (binary += String.fromCharCode(b)))
  return btoa(binary)
}

/** UTF-8-safe Base64 decode. Throws on invalid input. */
export function base64Decode(value: string): string {
  const binary = atob(value.trim())
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/** Decode a base64url segment (as used in JWTs) to text. */
export function base64UrlDecode(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return base64Decode(padded)
}

export interface DecodedJwt {
  header: unknown
  payload: unknown
  signature: string
}

/** Decode (not verify) a JWT into its header, payload and signature. */
export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split('.')
  if (parts.length < 2) {
    throw new Error('A JWT has three dot-separated parts (header.payload.signature).')
  }
  return {
    header: JSON.parse(base64UrlDecode(parts[0]!)),
    payload: JSON.parse(base64UrlDecode(parts[1]!)),
    signature: parts[2] ?? '',
  }
}
