import type { Plugin } from './types.js'

const registry = new Map<string, Plugin>()

export function registerPlugin(plugin: Plugin): void {
  registry.set(plugin.name, plugin)
}

export function unregisterPlugin(name: string): void {
  registry.delete(name)
}

export function getPlugins(): Plugin[] {
  return Array.from(registry.values())
}
