import { mount, unmount } from 'svelte'
import Overlay from './Overlay.svelte'
import type { GrabStore } from '../store.js'
import { SHADOW_HOST_ID, Z_INDEX } from '../constants.js'
import { OVERLAY_CSS } from './styles.js'

export function mountOverlay(store: GrabStore): () => void {
  const host = document.createElement('div')
  host.id = SHADOW_HOST_ID
  host.style.cssText = `position:fixed;top:0;left:0;width:0;height:0;pointer-events:none;z-index:${Z_INDEX}`
  document.body.appendChild(host)

  const shadow = host.attachShadow({ mode: 'open' })

  // Inject styles directly into shadow root so they aren't blocked by shadow DOM encapsulation
  const styleEl = document.createElement('style')
  styleEl.textContent = OVERLAY_CSS
  shadow.appendChild(styleEl)

  const target = document.createElement('div')
  shadow.appendChild(target)

  const app = mount(Overlay, { target, props: { store, host } })

  return () => {
    unmount(app)
    host.remove()
  }
}
