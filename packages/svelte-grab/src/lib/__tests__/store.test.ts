import { describe, it, expect } from 'bun:test'
import { createGrabStore } from '../store.js'
import type { ElementContext } from '../types.js'

function makeCtx(): ElementContext {
  return {
    element: document.createElement('div'),
    componentName: 'TestComp',
    sourceFile: 'src/Test.svelte',
    sourceLine: 10,
    htmlSnippet: '<div/>',
    cssSelector: 'div',
    computedStyles: {},
  }
}

describe('createGrabStore', () => {
  it('initial state has expected defaults', () => {
    const store = createGrabStore()
    const s = store.get()
    expect(s.phase).toBe('idle')
    expect(s.hoveredElement).toBeNull()
    expect(s.pointerPosition).toEqual({ x: 0, y: 0 })
    expect(s.lastCopied).toBeNull()
  })

  it('setPhase updates phase', () => {
    const store = createGrabStore()
    store.setPhase('copying')
    expect(store.get().phase).toBe('copying')
  })

  it('setHovered updates hoveredElement', () => {
    const store = createGrabStore()
    const el = document.createElement('span')
    store.setHovered(el)
    expect(store.get().hoveredElement).toBe(el)
  })

  it('setHovered with null clears hoveredElement', () => {
    const store = createGrabStore()
    store.setHovered(document.createElement('span'))
    store.setHovered(null)
    expect(store.get().hoveredElement).toBeNull()
  })

  it('setPointer updates pointerPosition', () => {
    const store = createGrabStore()
    store.setPointer({ x: 5, y: 10 })
    expect(store.get().pointerPosition).toEqual({ x: 5, y: 10 })
  })

  it('setLastCopied updates lastCopied', () => {
    const store = createGrabStore()
    const ctx = makeCtx()
    store.setLastCopied(ctx)
    expect(store.get().lastCopied).toBe(ctx)
  })

  it('reset restores all fields to initial values', () => {
    const store = createGrabStore()
    store.setPhase('active')
    store.setHovered(document.createElement('div'))
    store.setPointer({ x: 99, y: 77 })
    store.setLastCopied(makeCtx())
    store.reset()
    const s = store.get()
    expect(s.phase).toBe('idle')
    expect(s.hoveredElement).toBeNull()
    expect(s.pointerPosition).toEqual({ x: 0, y: 0 })
    expect(s.lastCopied).toBeNull()
  })

  it('subscribe fires with updated value after mutation', () => {
    const store = createGrabStore()
    const values: string[] = []
    const unsub = store.subscribe(s => values.push(s.phase))
    store.setPhase('holding')
    store.setPhase('active')
    unsub()
    expect(values).toContain('holding')
    expect(values).toContain('active')
  })

  it('get returns current state synchronously', () => {
    const store = createGrabStore()
    store.setPhase('copying')
    expect(store.get().phase).toBe('copying')
  })
})
