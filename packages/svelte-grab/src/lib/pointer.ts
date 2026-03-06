import type { GrabStore } from './store.js'
import type { EventListenerManager } from './events.js'
import { THROTTLE_MS } from './constants.js'

export function setupPointerTracking(
  store: GrabStore,
  events: EventListenerManager
): void {
  let rafId: number | null = null
  let lastX = 0
  let lastY = 0
  let lastUpdate = 0

  const update = () => {
    const el = document.elementFromPoint(lastX, lastY)
    store.setPointer({ x: lastX, y: lastY })
    // Skip shadow host and overlay elements
    if (el && !el.closest('#__svelte_grab_host__')) {
      store.setHovered(el)
    }
    rafId = null
  }

  events.add(document, 'mousemove', (e) => {
    const me = e as MouseEvent
    lastX = me.clientX
    lastY = me.clientY
    const now = performance.now()
    if (now - lastUpdate < THROTTLE_MS) return
    lastUpdate = now
    if (rafId === null) {
      rafId = requestAnimationFrame(update)
    }
  })
}
