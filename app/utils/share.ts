/**
 * Encode/decode editor state to a compact, URL-safe string for shareable links.
 * Uses the browser's native CompressionStream when available (no dependency),
 * falling back to plain base64 for older engines. Client-only.
 */

// Practical ceiling so we never produce an unshareable, oversized URL.
const MAX_URL_LENGTH = 16000

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function pipe(bytes: Uint8Array, transform: 'CompressionStream' | 'DecompressionStream'): Promise<Uint8Array> {
  const Ctor = (globalThis as Record<string, unknown>)[transform] as
    | (new (format: string) => TransformStream)
    | undefined
  if (!Ctor) throw new Error('unsupported')
  const stream = new Blob([bytes]).stream().pipeThrough(new Ctor('deflate-raw'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

async function encodeState(state: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(state))
  try {
    const compressed = await pipe(bytes, 'CompressionStream')
    return `1${bytesToBase64Url(compressed)}`
  }
  catch {
    return `0${bytesToBase64Url(bytes)}`
  }
}

async function decodeState<T>(payload: string): Promise<T | null> {
  try {
    const flag = payload[0]
    let bytes = base64UrlToBytes(payload.slice(1))
    if (flag === '1') bytes = await pipe(bytes, 'DecompressionStream')
    return JSON.parse(new TextDecoder().decode(bytes)) as T
  }
  catch {
    return null
  }
}

/** Build a shareable URL for the given state, or null if it would be too long. */
export async function buildShareUrl(state: unknown): Promise<string | null> {
  const payload = await encodeState(state)
  const url = `${location.origin}${location.pathname}#s=${payload}`
  return url.length > MAX_URL_LENGTH ? null : url
}

/** Read shared state from the current URL hash, if present. */
export async function readShareUrl<T>(): Promise<T | null> {
  const match = location.hash.match(/[#&]s=([^&]+)/)
  return match ? decodeState<T>(match[1]!) : null
}
