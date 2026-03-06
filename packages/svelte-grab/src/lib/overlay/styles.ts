export const OVERLAY_CSS = `
  .sg-active-badge {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: #0d1117;
    border: 1px solid #2ecc71;
    color: #2ecc71;
    font-family: ui-monospace, 'Cascadia Code', Menlo, monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 5px 12px 5px 10px;
    border-radius: 20px;
    z-index: 999999;
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: 7px;
    box-shadow: 0 0 12px rgba(46, 204, 113, 0.25);
  }

  .sg-active-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #2ecc71;
    box-shadow: 0 0 6px #2ecc71;
    animation: sg-pulse 1.4s ease-in-out infinite;
  }

  @keyframes sg-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .sg-highlight {
    position: fixed;
    box-sizing: border-box;
    background: rgba(46, 204, 113, 0.06);
    border: 1px solid rgba(46, 204, 113, 0.3);
    pointer-events: none;
    z-index: 999998;
  }

  .sg-cross {
    position: fixed;
    background: rgba(46, 204, 113, 0.2);
    pointer-events: none;
    z-index: 999997;
  }

  .sg-cross-h {
    left: 0;
    width: 100vw;
    height: 1px;
    transform: translateY(-50%);
  }

  .sg-cross-v {
    top: 0;
    width: 1px;
    height: 100vh;
    transform: translateX(-50%);
  }

  .sg-corner {
    position: fixed;
    width: 8px;
    height: 8px;
    pointer-events: none;
    z-index: 999999;
  }

  .sg-corner-tl { border-top: 2px solid #2ecc71; border-left: 2px solid #2ecc71; transform: translate(-1px, -1px); }
  .sg-corner-tr { border-top: 2px solid #2ecc71; border-right: 2px solid #2ecc71; transform: translate(-7px, -1px); }
  .sg-corner-bl { border-bottom: 2px solid #2ecc71; border-left: 2px solid #2ecc71; transform: translate(-1px, -7px); }
  .sg-corner-br { border-bottom: 2px solid #2ecc71; border-right: 2px solid #2ecc71; transform: translate(-7px, -7px); }

  .sg-dim {
    position: fixed;
    background: #0d1117;
    border: 1px solid #2ecc71;
    color: #2ecc71;
    font-family: ui-monospace, 'Cascadia Code', Menlo, monospace;
    font-size: 10px;
    font-weight: 500;
    padding: 2px 7px;
    border-radius: 4px;
    white-space: nowrap;
    pointer-events: none;
    z-index: 999999;
  }

  .sg-label {
    position: fixed;
    background: #0d1117;
    border: 1px solid #30363d;
    font-family: ui-monospace, 'Cascadia Code', Menlo, monospace;
    font-size: 11px;
    line-height: 1;
    padding: 5px 9px;
    border-radius: 5px;
    white-space: nowrap;
    pointer-events: none;
    z-index: 999999;
    max-width: 520px;
    overflow: hidden;
    text-overflow: ellipsis;
    box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .sg-label-tag { color: #2ecc71; }
  .sg-label-sep { color: #484f58; }
  .sg-label-component { color: #e6edf3; }
  .sg-label-file { color: #8b949e; }

  .sg-drag-rect {
    position: fixed;
    box-sizing: border-box;
    border: 1.5px dashed #2ecc71;
    background: rgba(46, 204, 113, 0.08);
    pointer-events: none;
    z-index: 999999;
  }

  .sg-copied {
    position: fixed;
    top: 16px;
    right: 16px;
    background: #0d1117;
    border: 1px solid #2ecc71;
    color: #2ecc71;
    font-family: ui-monospace, 'Cascadia Code', Menlo, monospace;
    font-size: 12px;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 6px;
    z-index: 999999;
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: 7px;
    animation: sg-fadeout 1.5s ease-out forwards;
    box-shadow: 0 0 16px rgba(46, 204, 113, 0.2);
  }

  @keyframes sg-fadeout {
    0%   { opacity: 1; transform: translateY(0); }
    70%  { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-6px); }
  }

  /* Context menu */
  .sg-context-menu {
    position: fixed;
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 6px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(46,204,113,0.1);
    z-index: 999999;
    min-width: 160px;
    overflow: hidden;
    font-family: ui-sans-serif, system-ui, sans-serif;
  }

  .sg-context-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 9px 13px;
    background: none;
    border: none;
    color: #8b949e;
    font-size: 12px;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
    box-sizing: border-box;
  }

  .sg-context-item:hover {
    background: rgba(46, 204, 113, 0.1);
    color: #2ecc71;
  }

  .sg-context-item + .sg-context-item {
    border-top: 1px solid #21262d;
  }
`
