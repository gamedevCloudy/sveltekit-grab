const KEY = 'svelte-grab:history'
const MAX = 50

export interface HistoryItem {
  id: string
  content: string
  elementName: string
  timestamp: number
}

export function addToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): void {
  const history = getHistory()
  history.unshift({ ...item, id: crypto.randomUUID(), timestamp: Date.now() })
  try {
    localStorage.setItem(KEY, JSON.stringify(history.slice(0, MAX)))
  } catch { /* storage unavailable */ }
}

export function getHistory(): HistoryItem[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
}

export function clearHistory(): void {
  localStorage.removeItem(KEY)
}
