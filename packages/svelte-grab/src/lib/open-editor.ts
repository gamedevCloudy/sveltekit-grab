export async function openInEditor(file: string, line?: number): Promise<void> {
  const path = line ? `${file}:${line}` : file
  try {
    const res = await fetch(`/__open-in-editor?file=${encodeURIComponent(path)}`)
    if (res.ok) return
  } catch { /* not available */ }
  window.open(`vscode://file/${path}`)
}
