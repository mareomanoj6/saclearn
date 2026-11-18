import type { ReactNode } from 'react'

const PY_KW = new Set('False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(' '))
const PY_BI = new Set('print input int float str len range list tuple set dict type sum max min abs round sorted enumerate zip map filter bool complex isinstance pow divmod reversed'.split(' '))
const PS_KW = new Set('START STOP END BEGIN INPUT OUTPUT PRINT READ DISPLAY SET IF THEN ELSE ELSEIF ENDIF FOR TO STEP ENDFOR WHILE ENDWHILE DO REPEAT UNTIL SWITCH CASE DEFAULT BREAK ENDSWITCH RETURN CALL FUNCTION ENDFUNCTION INCREMENT DECREMENT AND OR NOT DECLARE FROM DOWNTO'.split(' '))

const TOKEN = /(#.*$|\/\/.*$|"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?j?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|[+\-*/%=<>!&|^~]+)/gm

export function highlight(code: string, lang: 'python' | 'pseudo' | 'text' = 'python'): ReactNode[] {
  if (lang === 'text') return [code]
  const out: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(code))) {
    const t = m[0]
    if (m.index > last) out.push(code.slice(last, m.index))
    let cls = ''
    if (t.startsWith('#') || t.startsWith('//')) cls = 'tok-com'
    else if (/^["']/.test(t)) cls = 'tok-str'
    else if (/^\d/.test(t)) cls = 'tok-num'
    else if (/^[A-Za-z_]/.test(t)) {
      if (lang === 'python') {
        if (PY_KW.has(t)) cls = 'tok-kw'
        else if (PY_BI.has(t)) cls = 'tok-bi'
        else if (code[m.index + t.length] === '(') cls = 'tok-fn'
      } else if (PS_KW.has(t)) cls = 'tok-kw'
    } else cls = 'tok-op'
    out.push(cls ? <span key={k++} className={cls}>{t}</span> : t)
    last = m.index + t.length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}
