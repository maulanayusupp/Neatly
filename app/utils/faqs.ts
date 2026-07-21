export interface Faq {
  q: string
  a: string
}

/**
 * Per-tool FAQ content, keyed by route path. Rendered on the page and emitted
 * as FAQPage JSON-LD for rich search results. Content is kept in English (the
 * primary SEO language), like the tool proper-names in `tools.ts`.
 */
export const FAQS: Record<string, Faq[]> = {
  '/': [
    { q: 'Is my code uploaded to a server?', a: 'No. Beautifying and minifying run entirely in your browser — nothing is sent to a server or stored.' },
    { q: 'Which languages are supported?', a: 'JavaScript and TypeScript, CSS, HTML, JSON and XML. The language is auto-detected as you paste.' },
    { q: 'What is the difference between beautify and minify?', a: 'Beautify reformats code with consistent indentation so it is easy to read. Minify strips whitespace and comments to make the file smaller.' },
    { q: 'Can I unminify or unpack minified code?', a: 'Yes. Paste minified or packed code and Beautify will reformat it into clean, readable, properly indented source.' },
  ],
  '/base64': [
    { q: 'Is Base64 the same as encryption?', a: 'No. Base64 is an encoding, not encryption. Anyone can decode it, so it provides no security or confidentiality.' },
    { q: 'Does it handle emoji and Unicode?', a: 'Yes. Encoding is UTF-8 safe, so emoji and non-Latin characters round-trip correctly.' },
    { q: 'Why does decoding fail?', a: 'The input is not valid Base64 (for example it is plain text). Switch to Encode, or paste a valid Base64 string to decode.' },
    { q: 'Is my data private?', a: 'Yes. Encoding and decoding happen entirely in your browser; nothing is uploaded.' },
  ],
  '/json-viewer': [
    { q: 'Why is my JSON invalid?', a: 'The most common causes are trailing commas, single quotes instead of double quotes, and unquoted keys. The error line shows where parsing failed.' },
    { q: 'Is my JSON sent anywhere?', a: 'No. It is parsed and rendered locally in your browser.' },
    { q: 'Can it handle large JSON?', a: 'Yes. It validates, formats and renders a collapsible tree entirely on the client.' },
  ],
  '/jwt-decoder': [
    { q: 'Does this verify the JWT signature?', a: 'No. It decodes and displays the header and payload for inspection; it does not verify the signature, so never trust a token based on this alone.' },
    { q: 'Is my token sent to a server?', a: 'No. Decoding happens entirely in your browser.' },
    { q: 'What do iat and exp mean?', a: 'iat is the issued-at time and exp is the expiry, both Unix timestamps. The tool shows them as readable dates and whether the token has expired.' },
  ],
  '/url-encode': [
    { q: 'When should I URL-encode text?', a: 'Encode any value you put in a query string or path that contains spaces or special characters such as & ? # / or %.' },
    { q: 'How is this different from encodeURI?', a: 'This uses encodeURIComponent, which also encodes reserved characters like & = ? /, making it right for individual query values.' },
    { q: 'Is my data private?', a: 'Yes. Encoding and decoding run in your browser.' },
  ],
  '/hash': [
    { q: 'Which hash algorithms are supported?', a: 'SHA-1, SHA-256, SHA-384 and SHA-512, computed with the browser Web Crypto API.' },
    { q: 'Can I reverse a hash back to the original text?', a: 'No. Cryptographic hashes are one-way, so the original input cannot be recovered from the hash.' },
    { q: 'Is SHA-1 still safe to use?', a: 'SHA-1 is deprecated for security purposes. Use SHA-256 or stronger for anything security-related.' },
    { q: 'Is my input uploaded?', a: 'No. Hashing happens locally in your browser.' },
  ],
  '/timestamp': [
    { q: 'What is a Unix timestamp?', a: 'The number of seconds elapsed since 1 January 1970 UTC, known as the Unix epoch.' },
    { q: 'Seconds or milliseconds?', a: 'Unix timestamps are usually in seconds, while JavaScript uses milliseconds. The converter handles both.' },
    { q: 'Is the conversion done locally?', a: 'Yes. Everything is computed in your browser.' },
  ],
  '/regex': [
    { q: 'Which regex flavour does this use?', a: 'JavaScript (ECMAScript) regular expressions, the same engine that runs in browsers and Node.js.' },
    { q: 'What do the g, i, m and s flags do?', a: 'g matches globally, i is case-insensitive, m makes ^ and $ match per line, and s lets the dot match newlines.' },
    { q: 'Is my test text sent anywhere?', a: 'No. Matching runs entirely in your browser.' },
  ],
  '/timezone': [
    { q: 'Does it handle daylight saving time?', a: 'Yes. Conversions use the IANA time zone database through your browser, so daylight saving is applied automatically.' },
    { q: 'Is my data private?', a: 'Yes. All conversions are computed locally in your browser.' },
  ],
  '/meta-tags': [
    { q: 'What are Open Graph tags?', a: 'og: meta tags that control how your page looks when it is shared on Facebook, LinkedIn, WhatsApp and similar platforms.' },
    { q: 'What image size should I use?', a: 'A 1200 by 630 pixel image is recommended for og:image and summary_large_image cards.' },
    { q: 'Does the tool store my input?', a: 'No. The tags are generated in your browser as you type.' },
  ],
}
