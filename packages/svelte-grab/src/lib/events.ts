export class EventListenerManager {
  private controller = new AbortController()

  add(
    target: EventTarget,
    type: string,
    handler: EventListener,
    options?: Omit<AddEventListenerOptions, 'signal'>
  ): void {
    target.addEventListener(type, handler, {
      ...options,
      signal: this.controller.signal,
    })
  }

  dispose(): void {
    this.controller.abort()
  }
}
