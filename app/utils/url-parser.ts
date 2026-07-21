export interface UrlParam {
  key: string
  value: string
}

export interface UrlParts {
  valid: boolean
  protocol: string
  username: string
  password: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  origin: string
  params: UrlParam[]
}

const EMPTY: UrlParts = {
  valid: false,
  protocol: '',
  username: '',
  password: '',
  hostname: '',
  port: '',
  pathname: '',
  search: '',
  hash: '',
  origin: '',
  params: [],
}

function tryUrl(value: string): URL | null {
  try {
    return new URL(value)
  }
  catch {
    return null
  }
}

/** Parse a URL into its parts. Falls back to prefixing `https://` when no scheme is present. */
export function parseUrl(input: string): UrlParts {
  const trimmed = input.trim()
  if (!trimmed)
    return { ...EMPTY }

  let url = tryUrl(trimmed)
  if (!url && !/^[a-z][\w+.-]*:\/\//i.test(trimmed))
    url = tryUrl(`https://${trimmed}`)
  if (!url)
    return { ...EMPTY }

  return {
    valid: true,
    protocol: url.protocol,
    username: url.username,
    password: url.password,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    origin: url.origin,
    params: [...url.searchParams.entries()].map(([key, value]) => ({ key, value })),
  }
}

/** Build a query string (without leading `?`) from key/value pairs. */
export function buildQuery(params: UrlParam[]): string {
  const sp = new URLSearchParams()
  for (const p of params) {
    if (p.key)
      sp.append(p.key, p.value)
  }
  return sp.toString()
}

/** Reassemble a URL from parsed parts and an (edited) params list. */
export function buildUrl(parts: UrlParts, params: UrlParam[]): string {
  if (!parts.valid)
    return ''
  const query = buildQuery(params)
  return `${parts.origin}${parts.pathname}${query ? `?${query}` : ''}${parts.hash}`
}
