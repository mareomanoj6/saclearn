import { useCallback, useEffect, useRef, useState } from 'react'
import Editor, { type OnMount, type BeforeMount } from '@monaco-editor/react'
import { Play, RotateCcw, Square, Copy, Check, Trash2, Keyboard, LoaderCircle } from 'lucide-react'
import { usePython } from './usePython'
import { useIsDark } from '../lib/theme'

interface Props {
  initialCode: string
  height?: string
  /** optional: called whenever the code changes (Playground persists it) */
  onChange?: (code: string) => void
  initialStdin?: string
}

const defineThemes: BeforeMount = (monaco) => {
  monaco.editor.defineTheme('atp-dark', {
    base: 'vs-dark', inherit: true,
    rules: [{ token: 'comment', foreground: '6b7a99', fontStyle: 'italic' }, { token: 'keyword', foreground: 'c792ea' }, { token: 'string', foreground: 'a5e075' }, { token: 'number', foreground: 'f78c6c' }],
    colors: { 'editor.background': '#0b1224', 'editor.lineHighlightBackground': '#111c36', 'editorLineNumber.foreground': '#3b4a6b', 'editorGutter.background': '#0b1224' },
  })
  monaco.editor.defineTheme('atp-light', {
    base: 'vs', inherit: true,
    rules: [{ token: 'comment', foreground: '5b6b82', fontStyle: 'italic' }, { token: 'keyword', foreground: '7c3aed', fontStyle: 'bold' }, { token: 'string', foreground: '15803d' }, { token: 'number', foreground: 'c2410c' }, { token: 'identifier', foreground: '0f172a' }, { token: 'delimiter', foreground: '334155' }, { token: 'type', foreground: '0f766e' }],
    colors: { 'editor.background': '#f8fbff', 'editor.foreground': '#0f172a', 'editor.lineHighlightBackground': '#e8f1fd', 'editorLineNumber.foreground': '#64748b', 'editorLineNumber.activeForeground': '#1d4ed8', 'editorGutter.background': '#f8fbff', 'editor.selectionBackground': '#bfdbfe' },
  })
}

export function Compiler({ initialCode, height = '560px', onChange, initialStdin = '' }: Props) {
  const dark = useIsDark()
  const [code, setCode] = useState(initialCode)
  const [stdin, setStdin] = useState(initialStdin)
  const [copied, setCopied] = useState(false)
  const [showInput, setShowInput] = useState(/input\(/.test(initialCode))
  const py = usePython()
  const codeRef = useRef(code)
  const stdinRef = useRef(stdin)
  codeRef.current = code
  stdinRef.current = stdin
  const outRef = useRef<HTMLDivElement>(null)

  useEffect(() => { py.warm() }, [py.warm])
  useEffect(() => { outRef.current?.scrollTo({ top: outRef.current.scrollHeight }) }, [py.lines])
  useEffect(() => { if (/input\(/.test(code)) setShowInput(true) }, [code])

  const busy = py.status === 'running' || py.status === 'loading'
  const run = useCallback(() => py.run(codeRef.current, stdinRef.current), [py.run])

  const onMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => run())
  }

  const change = (v: string) => { setCode(v); onChange?.(v) }

  return (
    <div className="grid lg:grid-cols-2 gap-3 h-full min-h-0" style={{ height }}>
      {/* ---------------- editor ---------------- */}
      <div className="card flex flex-col min-h-[320px] overflow-hidden">
        <div className="flex items-center gap-2 px-3 h-12 border-b border-line shrink-0">
          <span className="flex gap-1.5 mr-1"><i className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><i className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><i className="w-2.5 h-2.5 rounded-full bg-[#28c840]" /></span>
          <span className="font-mono text-xs text-subtle">main.py</span>
          <div className="ml-auto flex items-center gap-1.5">
            <button className="btn btn-sm btn-ghost" title="Copy code" onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200) }}>{copied ? <Check size={14} /> : <Copy size={14} />}</button>
            <button className="btn btn-sm" onClick={() => change(initialCode)} title="Reset to starter code"><RotateCcw size={14} />Reset</button>
            {busy
              ? <button className="btn btn-sm" onClick={py.stop} style={{ color: 'var(--bad)' }}><Square size={13} fill="currentColor" />Stop</button>
              : <button className="btn btn-sm btn-primary" onClick={run} title="Run (Ctrl+Enter)"><Play size={14} fill="currentColor" />Run</button>}
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <Editor
            value={code}
            onChange={v => change(v ?? '')}
            language="python"
            theme={dark ? 'atp-dark' : 'atp-light'}
            beforeMount={defineThemes}
            onMount={onMount}
            loading={<div className="p-4 text-sm text-subtle flex items-center gap-2"><LoaderCircle size={14} className="animate-spin" />Loading editor…</div>}
            options={{
              fontSize: 14, fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontLigatures: true,
              minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 12 }, tabSize: 4,
              automaticLayout: true, renderLineHighlight: 'all', smoothScrolling: true, wordWrap: 'on',
            }}
          />
        </div>
      </div>

      {/* ---------------- output ---------------- */}
      <div className="card flex flex-col min-h-[260px] overflow-hidden">
        <div className="flex items-center gap-2 px-3 h-12 border-b border-line shrink-0">
          <span className="text-sm font-medium">Output</span>
          <StatusPill status={py.status} />
          {py.ms != null && <span className="text-xs text-subtle">{py.ms < 1000 ? `${py.ms.toFixed(0)} ms` : `${(py.ms / 1000).toFixed(2)} s`}</span>}
          <div className="ml-auto flex gap-1.5">
            <button className={`btn btn-sm ${showInput ? 'tab-active' : 'btn-ghost'}`} onClick={() => setShowInput(s => !s)} title="Program input (stdin)"><Keyboard size={14} />Input</button>
            <button className="btn btn-sm btn-ghost" onClick={py.clear} title="Clear output"><Trash2 size={14} /></button>
          </div>
        </div>
        {showInput && (
          <div className="border-b border-line p-3 shrink-0">
            <div className="label mb-1.5">Input · one value per line, read by input()</div>
            <textarea value={stdin} onChange={e => setStdin(e.target.value)} rows={3} placeholder={'5\nAlice\n12 7'}
              className="w-full rounded-lg border border-line bg-surface p-2 font-mono text-sm outline-none focus:border-accent resize-y" />
          </div>
        )}
        <div ref={outRef} className="flex-1 min-h-0 overflow-auto p-4 font-mono text-[13px] leading-relaxed scrollbar-thin" style={{ background: 'var(--code-bg)', color: 'var(--code-fg)' }}>
          {py.lines.length === 0 && (
            <div className="text-code-muted">
              <div>Press <b className="text-code-acc">Run ▶</b> (or Ctrl + Enter) to execute your program.</div>
              <div className="mt-1">Output will appear here.</div>
            </div>
          )}
          <pre className="whitespace-pre-wrap break-words m-0">
            {py.lines.map((l, i) => (
              <span key={i} className={l.kind === 'err' ? 'text-code-err' : l.kind === 'echo' ? 'text-code-acc' : l.kind === 'sys' ? 'text-code-muted italic' : ''}>{l.text}</span>
            ))}
          </pre>
          {py.status === 'ready' && py.lines.length > 0 && <div className="mt-3 text-code-muted text-xs">=== Code execution finished ===</div>}
        </div>
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    idle: ['Idle', 'var(--subtle)'], loading: ['Loading Python…', 'var(--warn)'], ready: ['Ready', 'var(--good)'], running: ['Running…', 'var(--accent)'], error: ['Runtime error', 'var(--bad)'],
  }
  const [label, color] = map[status] ?? map.idle
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color }}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'running' || status === 'loading' ? 'animate-pulse' : ''}`} style={{ background: color }} />{label}
    </span>
  )
}
