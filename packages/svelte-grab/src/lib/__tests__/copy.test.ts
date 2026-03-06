import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { formatSnippet, tryCopy } from '../copy.js'
import type { ElementContext, Plugin } from '../types.js'

function makeCtx(overrides: Partial<ElementContext> = {}): ElementContext {
  return {
    element: { tagName: 'BUTTON' } as Element,
    componentName: null,
    sourceFile: null,
    sourceLine: null,
    htmlSnippet: '<button>Click</button>',
    cssSelector: 'button',
    computedStyles: {},
    ...overrides,
  }
}

describe('formatSnippet', () => {
  it('includes sourceFile and line when both present', () => {
    const ctx = makeCtx({ componentName: 'Button', sourceFile: 'src/lib/Button.svelte', sourceLine: 42 })
    expect(formatSnippet(ctx)).toBe('Button @ src/lib/Button.svelte:42\n\n<button>Click</button>')
  })

  it('omits line when sourceLine is null', () => {
    const ctx = makeCtx({ componentName: 'Button', sourceFile: 'src/lib/Button.svelte', sourceLine: null })
    expect(formatSnippet(ctx)).toBe('Button @ src/lib/Button.svelte\n\n<button>Click</button>')
  })

  it('uses componentName only when no sourceFile', () => {
    const ctx = makeCtx({ componentName: 'Card', sourceFile: null })
    expect(formatSnippet(ctx)).toBe('Card\n\n<button>Click</button>')
  })

  it('falls back to tag name when no componentName and no sourceFile', () => {
    const ctx = makeCtx({ componentName: null, sourceFile: null })
    expect(formatSnippet(ctx)).toBe('button\n\n<button>Click</button>')
  })

  it('includes htmlSnippet verbatim', () => {
    const snippet = '<div class="foo"><span>bar</span></div>'
    const ctx = makeCtx({ componentName: 'Foo', sourceFile: null, htmlSnippet: snippet })
    expect(formatSnippet(ctx)).toContain(snippet)
  })
})

describe('tryCopy', () => {
  beforeEach(() => {
    // Reset clipboard mock before each test
    Object.defineProperty(globalThis, 'navigator', {
      value: { ...globalThis.navigator },
      writable: true,
      configurable: true,
    })
  })

  it('calls onCopy plugin and uses returned string as clipboard content', async () => {
    const written: string[] = []
    globalThis.navigator.clipboard = { writeText: async (s: string) => { written.push(s) } } as Clipboard

    const plugin: Plugin = { name: 'test', onCopy: () => 'custom content' }
    await tryCopy([makeCtx()], [plugin])
    expect(written[0]).toBe('custom content')
  })

  it('calls onCopySuccess with final content after successful clipboard write', async () => {
    const successArgs: string[] = []
    globalThis.navigator.clipboard = { writeText: async (_s: string) => {} } as Clipboard

    const plugin: Plugin = { name: 'test', onCopySuccess: (c) => { successArgs.push(c) } }
    const ctx = makeCtx({ componentName: 'X', sourceFile: null })
    await tryCopy([ctx], [plugin])
    expect(successArgs).toHaveLength(1)
    expect(successArgs[0]).toContain('X')
  })

  it('last plugin onCopy wins when multiple plugins define it', async () => {
    const written: string[] = []
    globalThis.navigator.clipboard = { writeText: async (s: string) => { written.push(s) } } as Clipboard

    const plugins: Plugin[] = [
      { name: 'a', onCopy: () => 'from-a' },
      { name: 'b', onCopy: () => 'from-b' },
    ]
    await tryCopy([makeCtx()], plugins)
    expect(written[0]).toBe('from-b')
  })

  it('calls onCopyError when clipboard throws and execCommand also fails', async () => {
    globalThis.navigator.clipboard = {
      writeText: async () => { throw new Error('no clipboard') },
    } as unknown as Clipboard
    // execCommand throws (failure path triggers onCopyError)
    document.execCommand = mock(() => { throw new Error('execCommand failed') })

    const errors: Error[] = []
    const plugin: Plugin = { name: 'test', onCopyError: (e) => { errors.push(e) } }
    await tryCopy([makeCtx()], [plugin])
    expect(errors).toHaveLength(1)
  })
})
