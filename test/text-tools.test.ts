import { describe, expect, it } from 'vitest'
import {
  addLineNumbers,
  collapseSpaces,
  findReplace,
  removeEmptyLines,
  reverseLines,
  reverseText,
  sortLines,
  textStats,
  toSentenceCase,
  toTitleCase,
  trimLines,
  uniqueLines,
} from '../app/utils/text-tools'

describe('text-tools stats', () => {
  it('counts characters, words, lines, sentences, paragraphs', () => {
    const s = textStats('Hello world. How are you?\n\nSecond para here.')
    expect(s.characters).toBe(44)
    expect(s.words).toBe(8)
    expect(s.lines).toBe(3)
    expect(s.sentences).toBe(3)
    expect(s.paragraphs).toBe(2)
  })

  it('returns zeros for empty text', () => {
    const s = textStats('')
    expect(s).toMatchObject({ characters: 0, words: 0, lines: 0, sentences: 0, paragraphs: 0 })
  })
})

describe('text-tools transforms', () => {
  it('sorts lines naturally and reversibly', () => {
    expect(sortLines('b\nA\nc\n10\n2')).toBe('2\n10\nA\nb\nc')
    expect(sortLines('b\na\nc', 'desc')).toBe('c\nb\na')
  })

  it('removes duplicate lines keeping first', () => {
    expect(uniqueLines('a\nb\na\nc\nb')).toBe('a\nb\nc')
  })

  it('reverses lines and characters', () => {
    expect(reverseLines('1\n2\n3')).toBe('3\n2\n1')
    expect(reverseText('abc')).toBe('cba')
  })

  it('trims, removes empty lines and collapses spaces', () => {
    expect(trimLines('  a  \n b')).toBe('a\nb')
    expect(removeEmptyLines('a\n\n  \nb')).toBe('a\nb')
    expect(collapseSpaces('a    b\tc')).toBe('a b c')
  })

  it('adds aligned line numbers', () => {
    expect(addLineNumbers('x\ny')).toBe('1  x\n2  y')
  })

  it('applies title and sentence case', () => {
    expect(toTitleCase('hello WORLD foo')).toBe('Hello World Foo')
    expect(toSentenceCase('hello world. bye now.')).toBe('Hello world. Bye now.')
  })

  it('find & replace literal and regex', () => {
    expect(findReplace('a.b.c', '.', '-')).toBe('a-b-c')
    expect(findReplace('foo123bar', '\\d+', '#', { regex: true })).toBe('foo#bar')
    expect(findReplace('Cat cat', 'cat', 'dog', { caseInsensitive: true })).toBe('dog dog')
  })
})
