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
    { q: 'Is my code stored anywhere?', a: 'No. Your code is sent to our server only to run the formatter, processed on the fly, and never saved or shared.' },
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
  '/convert': [
    { q: 'Which formats can I convert between?', a: 'JSON, YAML, CSV and XML, in any direction.' },
    { q: 'Is my data stored?', a: 'No. Your input is processed on the fly to convert it and is never saved or shared.' },
    { q: 'Does it preserve data types?', a: 'It maps values across formats as faithfully as each format allows, including numbers, booleans and nested objects.' },
  ],
  '/sql': [
    { q: 'Which SQL dialects are supported?', a: 'Standard SQL plus popular dialects — pick the one matching your database for the best formatting.' },
    { q: 'Does formatting change my query?', a: 'No. It only reformats whitespace, casing and indentation; the query logic is unchanged.' },
    { q: 'Is my query uploaded?', a: 'No. SQL formatting runs entirely in your browser.' },
  ],
  '/yaml': [
    { q: 'What does the validator check?', a: 'It parses your YAML and reports the exact line and column of any syntax or indentation error.' },
    { q: 'Can it convert YAML to JSON?', a: 'Yes. Valid YAML can be copied as JSON with one click.' },
    { q: 'Is my YAML sent to a server?', a: 'No. Validation and formatting run in your browser.' },
  ],
  '/compare': [
    { q: 'How many JSON files can I compare?', a: 'Two to four at once, with a summary of what differs and where.' },
    { q: 'Does key order matter?', a: 'No. Objects are compared by key, so a different key order does not create false differences.' },
    { q: 'Is my JSON uploaded?', a: 'No. The comparison runs entirely in your browser.' },
  ],
  '/json-to-typescript': [
    { q: 'Does it handle nested objects and arrays?', a: 'Yes. It generates interfaces for nested objects and infers array element types.' },
    { q: 'Can I rename the root interface?', a: 'Yes. Set the root name and every generated interface updates.' },
    { q: 'Is my JSON sent anywhere?', a: 'No. The TypeScript is generated in your browser.' },
  ],
  '/text-tools': [
    { q: 'What can it count?', a: 'Words, characters (with and without spaces), lines, sentences, paragraphs and reading time.' },
    { q: 'Can I chain operations?', a: 'Yes. Sort, dedupe, change-case and other transforms apply in place, so you can run several in a row.' },
    { q: 'Is my text uploaded?', a: 'No. Everything runs in your browser.' },
  ],
  '/diff': [
    { q: 'What kind of diff is this?', a: 'A line-by-line comparison of two texts, highlighting additions and removals.' },
    { q: 'Can I compare code?', a: 'Yes. Any plain text or source code works.' },
    { q: 'Is my text sent to a server?', a: 'No. The diff is computed in your browser.' },
  ],
  '/color': [
    { q: 'Which colour formats does it convert?', a: 'HEX, RGB and HSL, updated live as you pick or type a colour.' },
    { q: 'What is the contrast check for?', a: 'It shows the WCAG contrast ratio against white and black so you can check text accessibility.' },
    { q: 'What contrast ratio is good?', a: '4.5:1 meets WCAG AA for normal text; 3:1 is the minimum for large text.' },
  ],
  '/case': [
    { q: 'Which cases are supported?', a: 'camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, sentence case and slug.' },
    { q: 'What is a slug?', a: 'A URL-friendly, lowercase, hyphenated version of text — for example "My Post" becomes "my-post".' },
    { q: 'Is my text uploaded?', a: 'No. Conversion runs in your browser.' },
  ],
  '/lorem': [
    { q: 'Can I copy one paragraph at a time?', a: 'Yes. Copy per paragraph, or copy the whole passage at once.' },
    { q: 'How much text can I generate?', a: 'Choose the number of paragraphs to generate as much placeholder text as you need.' },
    { q: 'Is it the classic Lorem ipsum?', a: 'Yes, based on the standard Latin filler text used across design and development.' },
  ],
  '/markdown': [
    { q: 'Is the HTML output safe?', a: 'Yes. The rendered HTML is sanitised to strip scripts and unsafe markup.' },
    { q: 'Does it support tables and code blocks?', a: 'Yes — standard Markdown including tables, lists, code blocks and links.' },
    { q: 'Is my content uploaded?', a: 'No. Conversion and preview run in your browser.' },
  ],
  '/cron': [
    { q: 'What cron format does it use?', a: 'The standard five-field crontab format: minute, hour, day-of-month, month and day-of-week.' },
    { q: 'Does it show the next run times?', a: 'Yes. It lists the upcoming scheduled runs alongside a plain-language explanation.' },
    { q: 'Is anything sent to a server?', a: 'No. Expressions are explained entirely in your browser.' },
  ],
  '/url-parser': [
    { q: 'What parts does it break out?', a: 'Protocol, host, port, path, query parameters, fragment and origin.' },
    { q: 'Can I edit the query parameters?', a: 'Yes. Edit, add or remove params and copy the rebuilt URL.' },
    { q: 'Why is the port empty?', a: 'Default ports (such as 443 for https) are omitted by the browser URL parser.' },
  ],
  '/robots-txt': [
    { q: 'What is a robots.txt file?', a: 'A file at your site root that tells search-engine crawlers which paths they may or may not crawl.' },
    { q: 'Does Disallow keep a page private?', a: 'No. It asks crawlers not to crawl a path but does not secure it — use authentication for real protection.' },
    { q: 'Where do I put the file?', a: 'At the root of your domain, for example https://example.com/robots.txt.' },
  ],
  '/scan': [
    { q: 'What can it scan?', a: 'QR codes and common barcodes — from your camera, an uploaded image, or a pasted screenshot.' },
    { q: 'Are my scans uploaded?', a: 'No. Scanning happens entirely in your browser; images never leave your device.' },
    { q: 'Why will the camera not start?', a: 'The browser needs camera permission and a secure (https) connection.' },
  ],
  '/qr-generator': [
    { q: 'What can I encode in a QR code?', a: 'URLs, plain text, Wi-Fi credentials, email, phone numbers and vCards.' },
    { q: 'Can I download the QR code?', a: 'Yes, export it as PNG or SVG.' },
    { q: 'Is my data uploaded?', a: 'No. Codes are generated in your browser.' },
  ],
  '/uuid': [
    { q: 'Which UUID version is this?', a: 'Version 4 (random) UUIDs, generated with the browser crypto API.' },
    { q: 'Are they unique?', a: 'v4 UUIDs are random with an extremely low collision chance, safe to use as keys and IDs.' },
    { q: 'Are they generated locally?', a: 'Yes, entirely in your browser.' },
  ],
  '/password': [
    { q: 'Are the passwords generated safely?', a: 'Yes. They are created in your browser with the crypto API and never sent anywhere.' },
    { q: 'Can I choose which characters to include?', a: 'Yes — set the length and toggle uppercase, lowercase, numbers and symbols.' },
    { q: 'What makes a strong password?', a: 'Length matters most; aim for 16+ characters mixing several character types.' },
  ],
  '/number-base': [
    { q: 'Which bases does it convert?', a: 'Binary, octal, decimal and hexadecimal, in any direction.' },
    { q: 'Does it handle large numbers?', a: 'Yes. It uses big integers so very large values stay precise.' },
    { q: 'Is conversion done locally?', a: 'Yes, entirely in your browser.' },
  ],
  '/image-to-base64': [
    { q: 'Which image formats can I convert?', a: 'Any image your browser can read — PNG, JPG, GIF, SVG, WebP and more.' },
    { q: 'Are my images uploaded?', a: 'No. Images are read locally in your browser and never leave your device.' },
    { q: 'What output can I get?', a: 'A data URI, or ready-to-paste CSS, HTML or Markdown snippets.' },
  ],
}
