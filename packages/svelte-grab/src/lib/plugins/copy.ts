import type { Plugin } from '../types.js'
import { formatSnippet } from '../copy.js'

export const defaultCopyPlugin: Plugin = {
  name: 'default-copy',
  onCopy(ctx) {
    return formatSnippet(ctx)
  },
}
