import type { ElementContext, Plugin } from './types.js'

export function formatSnippet(ctx: ElementContext): string {
  const loc = ctx.sourceFile
    ? `${ctx.componentName ?? 'Unknown'} @ ${ctx.sourceFile}${ctx.sourceLine ? `:${ctx.sourceLine}` : ''}`
    : (ctx.componentName ?? ctx.element.tagName.toLowerCase())
  return `${loc}\n\n${ctx.htmlSnippet}`
}

export async function tryCopy(ctxs: ElementContext[], plugins: Plugin[]): Promise<void> {
  const parts = ctxs.map(ctx => {
    let part = formatSnippet(ctx)
    for (const plugin of plugins) {
      const result = plugin.onCopy?.(ctx)
      if (result) part = result
    }
    return part
  })
  const content = parts.join('\n---\n')

  try {
    await navigator.clipboard.writeText(content)
    for (const p of plugins) p.onCopySuccess?.(content)
  } catch {
    // Fallback for non-secure contexts or permission denied
    const ta = document.createElement('textarea')
    ta.value = content
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
    document.body.appendChild(ta)
    ta.focus()
    ta.select()
    try {
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      document.execCommand('copy')
      for (const p of plugins) p.onCopySuccess?.(content)
    } catch (err) {
      for (const p of plugins) p.onCopyError?.(err instanceof Error ? err : new Error(String(err)))
    } finally {
      ta.remove()
    }
  }
}
