const WORDS = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor '
  + 'incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud '
  + 'exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure '
  + 'in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint '
  + 'occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'
).split(' ')

const OPENING = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit']

function rand(max: number): number {
  return Math.floor(Math.random() * max)
}
function cap(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export interface LoremOptions {
  paragraphs: number
  wordsPerPara: number
  startWithLorem: boolean
}

/** Build one paragraph of ~wordCount words, split into natural sentences. */
export function generateParagraph(wordCount: number, opening = false): string {
  const words: string[] = []
  if (opening) words.push(...OPENING)
  while (words.length < wordCount) words.push(WORDS[rand(WORDS.length)]!)

  const sentences: string[] = []
  let i = 0
  while (i < words.length) {
    const len = Math.min(6 + rand(9), words.length - i)
    const chunk = words.slice(i, i + len)
    chunk[0] = cap(chunk[0]!)
    sentences.push(`${chunk.join(' ')}.`)
    i += len
  }
  return sentences.join(' ')
}

/** Generate an array of paragraphs. */
export function generateLorem(opts: LoremOptions): string[] {
  const count = Math.max(1, opts.paragraphs)
  return Array.from({ length: count }, (_, i) =>
    generateParagraph(opts.wordsPerPara, i === 0 && opts.startWithLorem))
}
