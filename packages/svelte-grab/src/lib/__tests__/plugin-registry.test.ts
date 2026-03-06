import { describe, it, expect, afterEach } from 'bun:test'
import { registerPlugin, unregisterPlugin, getPlugins } from '../plugin-registry.js'
import type { Plugin } from '../types.js'

const p1: Plugin = { name: 'plugin-a', onCopy: () => 'a' }
const p2: Plugin = { name: 'plugin-b' }

afterEach(() => {
  unregisterPlugin('plugin-a')
  unregisterPlugin('plugin-b')
  unregisterPlugin('plugin-c')
})

describe('plugin-registry', () => {
  it('registerPlugin makes plugin available via getPlugins', () => {
    registerPlugin(p1)
    expect(getPlugins().map(p => p.name)).toContain('plugin-a')
  })

  it('registering same name overwrites previous entry', () => {
    registerPlugin(p1)
    const updated: Plugin = { name: 'plugin-a', onCopy: () => 'updated' }
    registerPlugin(updated)
    const found = getPlugins().find(p => p.name === 'plugin-a')
    expect(found?.onCopy?.({} as any)).toBe('updated')
  })

  it('unregisterPlugin removes plugin by name', () => {
    registerPlugin(p1)
    unregisterPlugin('plugin-a')
    expect(getPlugins().map(p => p.name)).not.toContain('plugin-a')
  })

  it('unregisterPlugin on unknown name does not throw', () => {
    expect(() => unregisterPlugin('nonexistent')).not.toThrow()
  })

  it('getPlugins returns array', () => {
    registerPlugin(p1)
    registerPlugin(p2)
    expect(Array.isArray(getPlugins())).toBe(true)
  })

  it('mutating getPlugins() return value does not corrupt registry', () => {
    registerPlugin(p1)
    const arr = getPlugins()
    arr.length = 0
    expect(getPlugins().map(p => p.name)).toContain('plugin-a')
  })

  it('multiple plugins are all returned', () => {
    registerPlugin(p1)
    registerPlugin(p2)
    const names = getPlugins().map(p => p.name)
    expect(names).toContain('plugin-a')
    expect(names).toContain('plugin-b')
  })
})
