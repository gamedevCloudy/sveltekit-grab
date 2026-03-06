import { Window } from 'happy-dom'

const happyWindow = new Window({ url: 'https://localhost/' })

// Expose DOM globals
Object.assign(globalThis, {
  window: happyWindow,
  document: happyWindow.document,
  navigator: happyWindow.navigator,
  location: happyWindow.location,
  HTMLElement: happyWindow.HTMLElement,
  HTMLStyleElement: happyWindow.HTMLStyleElement,
  HTMLTextAreaElement: happyWindow.HTMLTextAreaElement,
  Element: happyWindow.Element,
  Event: happyWindow.Event,
  EventTarget: happyWindow.EventTarget,
  Node: happyWindow.Node,
  NodeList: happyWindow.NodeList,
  MutationObserver: happyWindow.MutationObserver,
  getComputedStyle: happyWindow.getComputedStyle.bind(happyWindow),
})
