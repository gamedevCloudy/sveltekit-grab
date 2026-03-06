<script lang="ts">
  import { onDestroy } from 'svelte'

  let {
    x,
    y,
    element,
    onCopy,
    onOpen,
    onClose,
  }: {
    x: number
    y: number
    element: Element
    onCopy: () => void
    onOpen: () => void
    onClose: () => void
  } = $props()

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose()
  }

  function handlePointerDown(e: PointerEvent) {
    if (!(e.target as Element).closest('.sg-context-menu')) onClose()
  }

  document.addEventListener('keydown', handleKeydown, { capture: true })
  document.addEventListener('pointerdown', handlePointerDown, { capture: true })

  onDestroy(() => {
    document.removeEventListener('keydown', handleKeydown, true)
    document.removeEventListener('pointerdown', handlePointerDown, true)
  })
</script>

<div class="sg-context-menu" style="left:{x}px;top:{y}px">
  <button class="sg-context-item" onclick={() => { onCopy(); onClose() }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
    Copy
  </button>
  <button class="sg-context-item" onclick={() => { onOpen(); onClose() }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    Open in Editor
  </button>
</div>
