import { describe, it, expect, afterEach } from 'bun:test'
import { freeze, unfreeze, isFreezeActive } from '../freeze.js'

afterEach(() => {
  unfreeze()
})

describe('freeze / unfreeze / isFreezeActive', () => {
  it('isFreezeActive() is false before any call', () => {
    expect(isFreezeActive()).toBe(false)
  })

  it('isFreezeActive() is true after freeze()', () => {
    freeze()
    expect(isFreezeActive()).toBe(true)
  })

  it('document.head contains a <style> with animation-play-state after freeze()', () => {
    freeze()
    const styles = Array.from(document.head.getElementsByTagName('style'))
    const freezeStyle = styles.find(s => (s as HTMLElement).dataset?.svelteGrabFreeze === '1')
    expect(freezeStyle).not.toBeUndefined()
    expect(freezeStyle?.textContent).toContain('animation-play-state: paused')
  })

  it('unfreeze() removes the injected <style> from document.head', () => {
    freeze()
    unfreeze()
    const styles = Array.from(document.head.getElementsByTagName('style'))
    const freezeStyle = styles.find(s => (s as HTMLElement).dataset?.svelteGrabFreeze === '1')
    expect(freezeStyle).toBeUndefined()
  })

  it('isFreezeActive() is false after unfreeze()', () => {
    freeze()
    unfreeze()
    expect(isFreezeActive()).toBe(false)
  })

  it('freeze([el]) sets el.style.animationPlayState to "paused"', () => {
    const el = document.createElement('div')
    freeze([el])
    expect((el as HTMLElement).style.animationPlayState).toBe('paused')
  })

  it('unfreeze() restores el.style.animationPlayState to prior value', () => {
    const el = document.createElement('div') as HTMLElement
    el.style.animationPlayState = 'running'
    freeze([el])
    unfreeze()
    expect(el.style.animationPlayState).toBe('running')
  })

  it('double freeze() then unfreeze() removes all injected styles', () => {
    freeze()
    freeze()
    unfreeze()
    const styles = Array.from(document.head.getElementsByTagName('style'))
    const remaining = styles.filter(s => (s as HTMLElement).dataset?.svelteGrabFreeze === '1')
    expect(remaining.length).toBe(0)
    expect(isFreezeActive()).toBe(false)
  })
})
