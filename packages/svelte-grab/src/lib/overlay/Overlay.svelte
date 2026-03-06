<script lang="ts">
  import type { GrabStore } from '../store.js'
  import { onDestroy } from 'svelte'
  import ContextMenu from './ContextMenu.svelte'
  import { getElementContext } from '../context.js'
  import { tryCopy } from '../copy.js'
  import { getPlugins } from '../plugin-registry.js'
  import { openInEditor } from '../open-editor.js'

  let { store, host }: { store: GrabStore; host: HTMLElement } = $props()

  let state = $state(store.get())
  let rect = $state<DOMRect | null>(null)
  let showCopied = $state(false)
  let copiedTimer: ReturnType<typeof setTimeout> | null = null

  $effect(() => {
    const unsub = store.subscribe(s => {
      state = s
      rect = s.hoveredElement ? s.hoveredElement.getBoundingClientRect() : null
      if (s.phase === 'copying') {
        showCopied = true
        if (copiedTimer) clearTimeout(copiedTimer)
        copiedTimer = setTimeout(() => { showCopied = false }, 1500)
      }
      host.style.pointerEvents = s.contextMenu ? 'auto' : 'none'
    })
    return unsub
  })

  onDestroy(() => {
    if (copiedTimer) clearTimeout(copiedTimer)
  })

  // Center of hovered element for crosshair and dimension badge
  let cx = $derived(rect ? rect.left + rect.width / 2 : 0)
  let cy = $derived(rect ? rect.top + rect.height / 2 : 0)

  function handleContextMenuCopy() {
    const el = state.contextMenu?.element
    if (!el) return
    store.setPhase('copying')
    getElementContext(el).then(ctx => {
      store.setLastCopied(ctx)
      return tryCopy([ctx], getPlugins())
    }).finally(() => {
      store.setPhase('active')
    })
  }

  function handleContextMenuOpen() {
    const el = state.contextMenu?.element
    if (!el) return
    getElementContext(el).then(ctx => {
      if (ctx.sourceFile) {
        openInEditor(ctx.sourceFile, ctx.sourceLine ?? undefined)
      }
    })
  }
</script>

{#if state.phase === 'active' || state.phase === 'copying'}
  <div class="sg-active-badge">
    <span class="sg-active-dot"></span>
    Inspect
  </div>
{/if}

{#if rect && state.hoveredElement}
  <!-- DevTools-style highlight fill -->
  <div
    class="sg-highlight"
    style="top:{rect.top}px;left:{rect.left}px;width:{rect.width}px;height:{rect.height}px"
  ></div>

  <!-- Sniper scope crosshair lines -->
  <div class="sg-cross sg-cross-h" style="top:{cy}px"></div>
  <div class="sg-cross sg-cross-v" style="left:{cx}px"></div>

  <!-- Corner brackets -->
  <div class="sg-corner sg-corner-tl" style="top:{rect.top}px;left:{rect.left}px"></div>
  <div class="sg-corner sg-corner-tr" style="top:{rect.top}px;left:{rect.right}px"></div>
  <div class="sg-corner sg-corner-bl" style="top:{rect.bottom}px;left:{rect.left}px"></div>
  <div class="sg-corner sg-corner-br" style="top:{rect.bottom}px;left:{rect.right}px"></div>

  <!-- Dimension badge -->
  <div
    class="sg-dim"
    style="top:{rect.bottom + 6}px;left:{cx}px;transform:translateX(-50%)"
  >{Math.round(rect.width)} × {Math.round(rect.height)}</div>

  <!-- Label pill -->
  <div
    class="sg-label"
    style="top:{Math.max(rect.top - 30, 4)}px;left:{rect.left}px"
  >
    <span class="sg-label-tag">{state.hoveredElement.tagName.toLowerCase()}</span>
    {#if state.lastCopied?.componentName}
      <span class="sg-label-sep">·</span>
      <span class="sg-label-component">{state.lastCopied.componentName}</span>
      {#if state.lastCopied.sourceFile}
        <span class="sg-label-sep">@</span>
        <span class="sg-label-file">{state.lastCopied.sourceFile}{state.lastCopied.sourceLine ? `:${state.lastCopied.sourceLine}` : ''}</span>
      {/if}
    {/if}
  </div>
{/if}

{#if state.dragRect}
  <div
    class="sg-drag-rect"
    style="left:{state.dragRect.x}px;top:{state.dragRect.y}px;width:{state.dragRect.w}px;height:{state.dragRect.h}px"
  ></div>
{/if}

{#if showCopied}
  <div class="sg-copied">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    Copied
  </div>
{/if}

{#if state.contextMenu}
  <ContextMenu
    x={state.contextMenu.x}
    y={state.contextMenu.y}
    element={state.contextMenu.element}
    onCopy={handleContextMenuCopy}
    onOpen={handleContextMenuOpen}
    onClose={() => store.hideContextMenu()}
  />
{/if}

