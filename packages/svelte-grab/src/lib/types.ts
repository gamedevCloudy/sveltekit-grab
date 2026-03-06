export interface GrabOptions {
  activationKey?: string
freezeOnGrab?: boolean
  onCopy?: (context: ElementContext) => void
  onError?: (err: Error) => void
}

export interface ElementContext {
  element: Element
  componentName: string | null
  sourceFile: string | null
  sourceLine: number | null
  htmlSnippet: string
  cssSelector: string
  computedStyles: Record<string, string>
}

export interface SourceInfo {
  file: string
  line: number
  column: number
  componentName: string
}

export interface GrabState {
  phase: 'idle' | 'active' | 'copying'
  hoveredElement: Element | null
  frozenElements: Set<Element>
  pointerPosition: { x: number; y: number }
  lastCopied: ElementContext | null
  dragRect: { x: number; y: number; w: number; h: number } | null
  contextMenu: { x: number; y: number; element: Element } | null
}

export interface Plugin {
  name: string
  onCopy?: (ctx: ElementContext) => string | void
  onCopySuccess?: (content: string) => void
  onCopyError?: (err: Error) => void
}
