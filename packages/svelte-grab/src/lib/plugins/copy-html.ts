import type { Plugin } from '../types.js'

export const copyHtmlPlugin: Plugin = {
  name: 'copy-html',
  onCopy(ctx) {
    return ctx.htmlSnippet
  },
}
