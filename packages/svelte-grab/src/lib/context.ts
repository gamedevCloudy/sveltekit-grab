import type { ElementContext, SourceInfo } from './types.js'

const IMPORTANT_STYLES = [
  'display', 'position', 'width', 'height', 'margin', 'padding',
  'color', 'background-color', 'font-size', 'font-weight',
  'border', 'border-radius', 'flex', 'grid', 'z-index', 'opacity',
  'transform', 'box-shadow', 'overflow', 'cursor',
]

function getCssSelector(el: Element): string {
  try {
    // Build a reasonably specific selector without @medv/finder for now
    const parts: string[] = []
    let current: Element | null = el
    while (current && current !== document.documentElement) {
      let segment = current.tagName.toLowerCase()
      if (current.id) {
        segment += `#${current.id}`
        parts.unshift(segment)
        break
      }
      const classes = Array.from(current.classList).slice(0, 2).join('.')
      if (classes) segment += `.${classes}`
      const parent = current.parentElement
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          c => c.tagName === current!.tagName
        )
        if (siblings.length > 1) {
          const idx = siblings.indexOf(current) + 1
          segment += `:nth-of-type(${idx})`
        }
      }
      parts.unshift(segment)
      current = current.parentElement
      if (parts.length >= 4) break
    }
    return parts.join(' > ')
  } catch {
    return el.tagName.toLowerCase()
  }
}

function getHtmlSnippet(el: Element): string {
  const html = el.outerHTML
  return html.length > 2000 ? html.slice(0, 2000) + '…' : html
}

function getComputedStyles(el: Element): Record<string, string> {
  const computed = window.getComputedStyle(el)
  const result: Record<string, string> = {}
  for (const prop of IMPORTANT_STYLES) {
    const val = computed.getPropertyValue(prop)
    if (val && val !== '' && val !== 'none' && val !== 'normal' && val !== 'auto') {
      result[prop] = val
    }
  }
  return result
}

function getSvelteSource(el: Element): SourceInfo | null {
  // Strategy 1: Svelte 5 dev mode __svelte_meta on DOM nodes
  const meta = (el as any).__svelte_meta
  if (meta) {
    return {
      file: meta.loc?.file ?? '',
      line: meta.loc?.line ?? 0,
      column: meta.loc?.column ?? 0,
      componentName: extractComponentName(meta.loc?.file ?? ''),
    }
  }

  // Strategy 2: Walk up DOM tree looking for __svelte_meta
  let node: Element | null = el.parentElement
  while (node) {
    const parentMeta = (node as any).__svelte_meta
    if (parentMeta) {
      return {
        file: parentMeta.loc?.file ?? '',
        line: parentMeta.loc?.line ?? 0,
        column: parentMeta.loc?.column ?? 0,
        componentName: extractComponentName(parentMeta.loc?.file ?? ''),
      }
    }
    node = node.parentElement
  }

  // Strategy 3: data-svelte-h attribute (Svelte hash for hydration)
  const svelteEl = el.closest('[data-svelte-h]') ?? el.querySelector('[data-svelte-h]')
  if (svelteEl) {
    // Can't get file from hash alone, but signals it's a Svelte component
    return null
  }

  // Strategy 4: Svelte devtools global hook
  const hook = (window as any).__svelte
  if (hook?.components) {
    // WeakMap-based component registry in Svelte 5 dev builds
    try {
      for (const [component] of hook.components) {
        if (component.$$.fragment?.c) {
          // component owns this element — extract source if available
          const loc = component.$$.ctx?.__loc
          if (loc) {
            return {
              file: loc.file,
              line: loc.line,
              column: loc.column ?? 0,
              componentName: extractComponentName(loc.file),
            }
          }
        }
      }
    } catch {
      // devtools API may vary
    }
  }

  return null
}

function extractComponentName(file: string): string {
  if (!file) return 'Unknown'
  const parts = file.split('/')
  const filename = parts[parts.length - 1]
  // Remove extension: Button.svelte → Button
  return filename.replace(/\.[^.]+$/, '')
}

export async function getElementContext(element: Element): Promise<ElementContext> {
  const source = getSvelteSource(element)
  return {
    element,
    componentName: source?.componentName ?? null,
    sourceFile: source?.file ?? null,
    sourceLine: source?.line ?? null,
    htmlSnippet: getHtmlSnippet(element),
    cssSelector: getCssSelector(element),
    computedStyles: getComputedStyles(element),
  }
}
