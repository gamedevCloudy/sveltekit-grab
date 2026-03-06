import { describe, it, expect, mock } from 'bun:test'
import { EventListenerManager } from '../events.js'

describe('EventListenerManager', () => {
  it('add() registers listener that fires on dispatchEvent', () => {
    const mgr = new EventListenerManager()
    const target = new EventTarget()
    const handler = mock()
    mgr.add(target, 'click', handler)
    target.dispatchEvent(new Event('click'))
    expect(handler).toHaveBeenCalledTimes(1)
    mgr.dispose()
  })

  it('dispose() removes listener; handler not called after dispose', () => {
    const mgr = new EventListenerManager()
    const target = new EventTarget()
    const handler = mock()
    mgr.add(target, 'click', handler)
    mgr.dispose()
    target.dispatchEvent(new Event('click'))
    expect(handler).not.toHaveBeenCalled()
  })

  it('multiple listeners on different targets all removed by single dispose()', () => {
    const mgr = new EventListenerManager()
    const t1 = new EventTarget()
    const t2 = new EventTarget()
    const h1 = mock()
    const h2 = mock()
    mgr.add(t1, 'click', h1)
    mgr.add(t2, 'mousemove', h2)
    mgr.dispose()
    t1.dispatchEvent(new Event('click'))
    t2.dispatchEvent(new Event('mousemove'))
    expect(h1).not.toHaveBeenCalled()
    expect(h2).not.toHaveBeenCalled()
  })

  it('dispose() called twice does not throw', () => {
    const mgr = new EventListenerManager()
    mgr.dispose()
    expect(() => mgr.dispose()).not.toThrow()
  })

  it('listener added with capture:true receives event in capture phase', () => {
    const mgr = new EventListenerManager()
    const parent = document.createElement('div')
    const child = document.createElement('span')
    parent.appendChild(child)
    document.body.appendChild(parent)

    const captureOrder: string[] = []
    mgr.add(parent, 'click', () => captureOrder.push('capture'), { capture: true })
    child.addEventListener('click', () => captureOrder.push('target'))

    child.dispatchEvent(new Event('click', { bubbles: true }))
    expect(captureOrder[0]).toBe('capture')

    mgr.dispose()
    parent.remove()
  })
})
