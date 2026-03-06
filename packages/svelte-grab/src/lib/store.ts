import { writable, get } from 'svelte/store'
import type { GrabState, ElementContext } from './types.js'

const INITIAL_STATE: GrabState = {
  phase: 'idle',
  hoveredElement: null,
  frozenElements: new Set(),
  pointerPosition: { x: 0, y: 0 },
  lastCopied: null,
  dragRect: null,
  contextMenu: null,
}

export function createGrabStore() {
  const state = writable<GrabState>({ ...INITIAL_STATE, frozenElements: new Set() })

  return {
    subscribe: state.subscribe,
    get: () => get(state),
    setPhase: (phase: GrabState['phase']) =>
      state.update(s => ({ ...s, phase })),
    setHovered: (el: Element | null) =>
      state.update(s => ({ ...s, hoveredElement: el })),
    setPointer: (pos: { x: number; y: number }) =>
      state.update(s => ({ ...s, pointerPosition: pos })),
    setLastCopied: (ctx: ElementContext) =>
      state.update(s => ({ ...s, lastCopied: ctx })),
    setActive: (active: boolean) =>
      state.update(s => ({ ...s, phase: active ? 'active' : 'idle' })),
    setDragRect: (r: GrabState['dragRect']) =>
      state.update(s => ({ ...s, dragRect: r })),
    showContextMenu: (x: number, y: number, element: Element) =>
      state.update(s => ({ ...s, contextMenu: { x, y, element } })),
    hideContextMenu: () =>
      state.update(s => ({ ...s, contextMenu: null })),
    reset: () =>
      state.set({ ...INITIAL_STATE, frozenElements: new Set() }),
  }
}

export type GrabStore = ReturnType<typeof createGrabStore>
