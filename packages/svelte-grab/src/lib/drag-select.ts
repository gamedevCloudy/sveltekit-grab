import { SHADOW_HOST_ID } from './constants.js'

export function getElementsInRect(rect: DOMRect): Element[] {
  const step = 20
  const seen = new Set<Element>()
  for (let x = rect.left; x <= rect.right; x += step) {
    for (let y = rect.top; y <= rect.bottom; y += step) {
      const el = document.elementFromPoint(x, y)
      if (el && !el.closest(`#${SHADOW_HOST_ID}`)) seen.add(el)
    }
  }
  return Array.from(seen)
}
