import { describe, expect, it } from 'vitest'
import { CASE_CONVERTERS, tokens } from '../app/utils/case'

function conv(key: string, input: string) {
  return CASE_CONVERTERS.find(c => c.key === key)!.fn(input)
}

describe('case', () => {
  it('tokenises camelCase and mixed separators', () => {
    expect(tokens('helloWorld-foo_bar baz')).toEqual(['hello', 'world', 'foo', 'bar', 'baz'])
  })

  it('produces programmatic cases', () => {
    expect(conv('camelCase', 'Hello world foo')).toBe('helloWorldFoo')
    expect(conv('PascalCase', 'hello world')).toBe('HelloWorld')
    expect(conv('snake_case', 'Hello World')).toBe('hello_world')
    expect(conv('kebab-case', 'Hello World')).toBe('hello-world')
    expect(conv('CONSTANT_CASE', 'hello world')).toBe('HELLO_WORLD')
    expect(conv('slug', 'Hello, World!')).toBe('hello-world')
  })

  it('produces prose cases', () => {
    expect(conv('UPPERCASE', 'abc')).toBe('ABC')
    expect(conv('Title Case', 'hello world')).toBe('Hello World')
  })
})
