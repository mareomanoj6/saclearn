import { useState } from 'react'
import { Copy, Check, Play } from 'lucide-react'
import { highlight } from '../lib/highlight'
import { useTryIt } from './TryIt'

export function CodeBlock({ code, lang = 'python', title, output, runnable }: { code: string; lang?: 'python' | 'pseudo' | 'text'; title?: string; output?: string; runnable?: boolean }) {
  const [copied, setCopied] = useState(false)
  const { open } = useTryIt()
  const label = lang === 'pseudo' ? 'Pseudocode' : lang === 'python' ? 'Python' : 'Text'
  return (
    <div className="code-block my-4 overflow-hidden">
      <div className="flex items-center gap-2 px-4 h-10 border-b border-code-line text-[12px]">
        <span className={`px-2 py-0.5 rounded-md font-medium ${lang === 'pseudo' ? 'bg-violet-soft text-violet' : 'bg-accent-soft text-accent'}`}>{label}</span>
        {title && <span className="text-code-muted font-sans font-medium truncate">{title}</span>}
        <div className="ml-auto flex items-center gap-1">
          {lang === 'python' && (runnable ?? true) && (
            <button onClick={() => open(code, title ?? 'Try it yourself')} className="inline-flex items-center gap-1 px-2 h-7 rounded-md text-code-acc hover:bg-accent-soft font-sans font-medium"><Play size={12} fill="currentColor" />Try it</button>
          )}
          <button onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200) }} className="inline-flex items-center px-2 h-7 rounded-md text-code-muted hover:bg-accent-soft" aria-label="Copy">{copied ? <Check size={13} /> : <Copy size={13} />}</button>
        </div>
      </div>
      <pre className="p-4 m-0 overflow-x-auto"><code>{highlight(code, lang)}</code></pre>
      {output && (
        <div className="border-t border-code-line px-4 py-3">
          <div className="text-xs text-code-muted font-sans font-semibold mb-1">Output</div>
          <pre className="m-0 text-code-ok whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  )
}
