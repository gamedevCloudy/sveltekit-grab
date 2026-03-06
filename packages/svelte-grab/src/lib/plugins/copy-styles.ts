import type { Plugin } from '../types.js'

export const copyStylesPlugin: Plugin = {
  name: 'copy-styles',
  onCopy(ctx) {
    const lines = Object.entries(ctx.computedStyles).map(
      ([k, v]) => `  ${k}: ${v};`
    )
    return `/* ${ctx.componentName ?? ctx.element.tagName.toLowerCase()} */\n${ctx.cssSelector} {\n${lines.join('\n')}\n}`
  },
}
