const cleanupFns = new Set<() => void>()

export function freeze(elements?: Element[]): void {
  const targets = elements ?? [document.documentElement]

  // Pause animation-play-state on each target
  for (const el of targets) {
    const htmlEl = el as HTMLElement
    const prev = htmlEl.style.animationPlayState
    htmlEl.style.animationPlayState = 'paused'
    cleanupFns.add(() => {
      htmlEl.style.animationPlayState = prev
    })
  }

  // Inject global style to kill all transitions and animations
  const style = document.createElement('style')
  style.dataset.svelteGrabFreeze = '1'
  style.textContent =
    '*, *::before, *::after { transition: none !important; animation-play-state: paused !important; }'
  document.head.appendChild(style)
  cleanupFns.add(() => style.remove())
}

export function unfreeze(): void {
  for (const fn of cleanupFns) fn()
  cleanupFns.clear()
}

export function isFreezeActive(): boolean {
  return cleanupFns.size > 0
}
