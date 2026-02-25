'use client'

import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTheme, THEMES, type ThemeId } from '@/components/terminal-themes'
import { cn } from '@/lib/utils'
import { TerminalProgress } from './terminal-progress'

type OutputStyle = 'normal' | 'success' | 'error' | 'info' | 'warning' | 'dim'

interface Line {
  id: number
  kind: 'command' | 'output'
  text: string | React.ReactNode
  style?: OutputStyle
}

const NEOFETCH_ART = [
  '        ╭──────────────╮',
  '  ╱╲    │ terminal-ui  │',
  ' ╱  ╲   ├──────────────┤',
  '╱ ╱╲ ╲  │ Shell: zsh   │',
  '╲ ╲╱ ╱  │ Theme: {t}   │',
  ' ╲  ╱   │ Tabs: {tabs} │',
  '  ╲╱    │ React 19     │',
  '        ╰──────────────╯',
]

const FS: Record<string, string[] | string> = {
  '~': ['Documents', 'Projects', 'Downloads', '.config', '.zshrc', 'README.md'],
  '~/Documents': ['notes.txt', 'resume.pdf'],
  '~/Projects': ['terminal-ui', 'website', 'api'],
  '~/Downloads': ['setup.sh', 'image.png'],
  '~/.config': ['nvim', 'alacritty'],
  '~/.zshrc': 'export PATH="$HOME/.local/bin:$PATH"\nalias ll="ls -la"\nalias gs="git status"',
  '~/README.md':
    '# terminal-ui\nBeautiful terminal-like UI components for the web.\nBuild CLI experiences in React.',
}

const PROMPT_USER = 'guest'
const PROMPT_HOST = 'openknots'

interface TerminalPaneProps {
  id: string
  onSplit?: () => void
  onNewTab?: () => void
  tabCount?: number
  isFocused?: boolean
  onFocus?: () => void
}

export function TerminalPane({
  id,
  onSplit,
  onNewTab,
  tabCount = 1,
  isFocused = true,
  onFocus,
}: TerminalPaneProps) {
  const { theme, setTheme } = useTheme()
  const [lines, setLines] = useState<Line[]>(() => [
    {
      id: 1,
      kind: 'output',
      text: 'Welcome to terminal-ui — type "help" for commands.',
      style: 'dim',
    },
  ])
  const [input, setInput] = useState('')
  const [cwd, setCwd] = useState('~')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const lineId = useRef(2)

  const nextId = useCallback(() => lineId.current++, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [lines])

  useEffect(() => {
    if (isFocused) inputRef.current?.focus()
  }, [isFocused])

  const push = useCallback(
    (newLines: Line[]) => setLines((prev) => [...prev, ...newLines]),
    [],
  )

  const runCommand = useCallback(
    (raw: string) => {
      const text = raw.trim()
      if (!text) return

      setHistory((h) => [...h, text])
      setHistoryIndex(-1)

      const cmdLine: Line = { id: nextId(), kind: 'command', text }
      const [cmd, ...args] = text.split(/\s+/)
      const argStr = args.join(' ')

      const out = (t: string, style: OutputStyle = 'normal'): Line => ({
        id: nextId(),
        kind: 'output',
        text: t,
        style,
      })

      switch (cmd.toLowerCase()) {
        case 'clear':
          setLines([])
          return

        case 'help':
          push([
            cmdLine,
            out('Available commands:', 'info'),
            out('  help             show this message'),
            out('  about            about terminal-ui'),
            out('  echo <text>      print text'),
            out('  date             current date/time'),
            out('  whoami           current user'),
            out('  pwd              print working directory'),
            out('  ls [dir]         list files'),
            out('  cat <file>       read file contents'),
            out('  cd <dir>         change directory'),
            out('  neofetch         system info'),
            out('  theme [name]     switch theme'),
            out('  split            split terminal pane'),
            out('  tab              open new tab'),
            out('  progress         show progress bar demo'),
            out('  clear            clear screen'),
            out(''),
            out('  ↑/↓              command history', 'dim'),
            out('  Ctrl+K           command palette', 'dim'),
          ])
          return

        case 'about':
          push([
            cmdLine,
            out('terminal-ui v0.1.0', 'success'),
            out('Beautiful terminal-like UI components for the web.'),
            out('Built with React, Next.js, shadcn/ui & Tailwind CSS.'),
            out('https://github.com/OpenKnots/terminal-ui', 'info'),
          ])
          return

        case 'echo':
          push([cmdLine, out(argStr || '', argStr ? 'normal' : 'warning')])
          return

        case 'date':
          push([cmdLine, out(new Date().toString())])
          return

        case 'whoami':
          push([cmdLine, out(PROMPT_USER)])
          return

        case 'pwd':
          push([cmdLine, out(cwd.replace('~', '/home/guest'))])
          return

        case 'ls': {
          const target = args[0]
            ? args[0].startsWith('~')
              ? args[0]
              : cwd === '~'
                ? `~/${args[0]}`
                : `${cwd}/${args[0]}`
            : cwd
          const entries = FS[target]
          if (!entries || typeof entries === 'string') {
            push([
              cmdLine,
              out(`ls: cannot access '${target}': No such file or directory`, 'error'),
            ])
          } else {
            push([cmdLine, out(entries.join('  '))])
          }
          return
        }

        case 'cat': {
          if (!argStr) {
            push([cmdLine, out('Usage: cat <file>', 'warning')])
            return
          }
          const path = argStr.startsWith('~')
            ? argStr
            : cwd === '~'
              ? `~/${argStr}`
              : `${cwd}/${argStr}`
          const content = FS[path]
          if (typeof content === 'string') {
            push([cmdLine, ...content.split('\n').map((l) => out(l))])
          } else {
            push([
              cmdLine,
              out(`cat: ${argStr}: No such file or directory`, 'error'),
            ])
          }
          return
        }

        case 'cd': {
          if (!argStr || argStr === '~') {
            setCwd('~')
            push([cmdLine])
            return
          }
          const target =
            argStr === '..'
              ? cwd.includes('/')
                ? cwd.substring(0, cwd.lastIndexOf('/')) || '~'
                : '~'
              : argStr.startsWith('~')
                ? argStr
                : cwd === '~'
                  ? `~/${argStr}`
                  : `${cwd}/${argStr}`
          if (FS[target] && typeof FS[target] !== 'string') {
            setCwd(target)
            push([cmdLine])
          } else {
            push([
              cmdLine,
              out(`cd: no such file or directory: ${argStr}`, 'error'),
            ])
          }
          return
        }

        case 'neofetch': {
          const themeName =
            THEMES.find((t) => t.id === theme)?.name ?? 'Default'
          const rendered = NEOFETCH_ART.map((l) =>
            l.replace('{t}', themeName.padEnd(5)).replace('{tabs}', String(tabCount)),
          )
          push([cmdLine, ...rendered.map((l) => out(l, 'info'))])
          return
        }

        case 'theme': {
          if (!argStr) {
            const current =
              THEMES.find((t) => t.id === theme)?.name ?? 'Default'
            push([
              cmdLine,
              out(`Current: ${current}`, 'info'),
              out(`Available: ${THEMES.map((t) => t.id).join(', ')}`),
              out('Usage: theme <name>', 'dim'),
            ])
            return
          }
          const match = THEMES.find(
            (t) => t.id === argStr.toLowerCase() || t.name.toLowerCase() === argStr.toLowerCase(),
          )
          if (match) {
            setTheme(match.id)
            push([
              cmdLine,
              out(`Theme switched to ${match.name}`, 'success'),
            ])
          } else {
            push([
              cmdLine,
              out(`Unknown theme: ${argStr}`, 'error'),
              out(`Available: ${THEMES.map((t) => t.id).join(', ')}`, 'dim'),
            ])
          }
          return
        }

        case 'split':
          push([cmdLine, out('Splitting pane...', 'info')])
          onSplit?.()
          return

        case 'tab':
          push([cmdLine, out('Opening new tab...', 'info')])
          onNewTab?.()
          return

        case 'progress':
          push([
            cmdLine,
            out('Starting installation...', 'info'),
            {
              id: nextId(),
              kind: 'output',
              text: <TerminalProgress percent={45} label="Fetching packages" />,
            },
            {
              id: nextId(),
              kind: 'output',
              text: <TerminalProgress percent={100} label="Building assets" />,
            },
            out('Installation complete!', 'success'),
          ])
          return

        default:
          push([
            cmdLine,
            out(`command not found: ${cmd}`, 'error'),
            out('Type "help" for available commands.', 'dim'),
          ])
      }
    },
    [cwd, theme, tabCount, nextId, push, setTheme, onSplit, onNewTab],
  )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    runCommand(input)
    setInput('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const idx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(idx)
      setInput(history[idx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const idx = historyIndex + 1
      if (idx >= history.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(idx)
        setInput(history[idx])
      }
    }
  }

  const styleMap: Record<OutputStyle, string> = {
    normal: 'text-[var(--term-fg)]',
    success: 'text-[var(--term-green)]',
    error: 'text-[var(--term-red)]',
    info: 'text-[var(--term-blue)]',
    warning: 'text-[var(--term-yellow)]',
    dim: 'text-[var(--term-fg-dim)]',
  }

  const promptCwd = cwd === '~' ? '~' : cwd.split('/').pop() ?? '~'

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-[var(--term-bg)] font-mono text-sm',
        isFocused && 'ring-1 ring-[var(--term-green)]/20 ring-inset',
      )}
      onClick={() => {
        inputRef.current?.focus()
        onFocus?.()
      }}
      role="presentation"
    >
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-0.5">
          {lines.map((line) =>
            line.kind === 'command' ? (
              <div key={line.id} className="flex items-start gap-0 leading-5">
                <span className="text-[var(--term-green)] select-none">
                  {PROMPT_USER}
                </span>
                <span className="text-[var(--term-fg-dim)] select-none">@</span>
                <span className="text-[var(--term-purple)] select-none">
                  {PROMPT_HOST}
                </span>
                <span className="text-[var(--term-fg-dim)] select-none">:</span>
                <span className="text-[var(--term-cyan)] select-none">
                  {promptCwd}
                </span>
                <span className="text-[var(--term-fg-dim)] select-none mr-2">
                  $
                </span>
                <span className="text-[var(--term-fg)]">{line.text}</span>
              </div>
            ) : (
              <div
                key={line.id}
                className={cn(
                  'leading-5 whitespace-pre-wrap',
                  styleMap[line.style ?? 'normal'],
                )}
              >
                {line.text}
              </div>
            ),
          )}

          {/* Input line */}
          <form onSubmit={onSubmit} className="flex items-start gap-0 leading-5">
            <span className="text-[var(--term-green)] select-none">
              {PROMPT_USER}
            </span>
            <span className="text-[var(--term-fg-dim)] select-none">@</span>
            <span className="text-[var(--term-purple)] select-none">
              {PROMPT_HOST}
            </span>
            <span className="text-[var(--term-fg-dim)] select-none">:</span>
            <span className="text-[var(--term-cyan)] select-none">
              {promptCwd}
            </span>
            <span className="text-[var(--term-fg-dim)] select-none mr-2">$</span>
            <div className="relative flex-1">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="w-full bg-transparent text-[var(--term-fg)] outline-none caret-transparent"
                autoComplete="off"
                spellCheck={false}
                aria-label="Terminal command input"
              />
              <span
                className="pointer-events-none absolute top-0 left-0 whitespace-pre text-transparent"
                aria-hidden
              >
                {input}
                <span className="cursor-block" />
              </span>
            </div>
          </form>
          <div ref={endRef} />
        </div>
      </ScrollArea>
    </div>
  )
}
