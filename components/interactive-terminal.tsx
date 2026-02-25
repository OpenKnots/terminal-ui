'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { Terminal, TerminalCommand, TerminalOutput } from '@/components/terminal'
import { TerminalProgress } from '@/components/terminal-progress'

type OutputType = 'normal' | 'success' | 'error' | 'info' | 'warning'

type Line =
  | {
      id: number
      kind: 'command'
      text: string
    }
  | {
      id: number
      kind: 'output'
      text: string
      type: OutputType
    }
  | {
      id: number
      kind: 'progress'
      label: string
      percent: number
      variant: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'cyan'
    }

const PROMPT = 'guest@openknots'

const initialLines: Line[] = [
  { id: 1, kind: 'output', type: 'info', text: 'Basic interactive terminal demo.' },
  { id: 2, kind: 'output', type: 'info', text: 'Try: help, about, echo <text>, date, clear.' },
]

export function InteractiveTerminal() {
  const [lines, setLines] = useState<Line[]>(initialLines)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const lineId = useRef(initialLines.length + 1)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [lines])

  const nextId = () => {
    const id = lineId.current
    lineId.current += 1
    return id
  }

  const runCommand = (rawCommand: string) => {
    const text = rawCommand.trim()
    if (!text) {
      return
    }

    const [command, ...args] = text.split(/\s+/)
    const argText = args.join(' ')

    setLines((previous) => {
      if (command.toLowerCase() === 'clear') {
        return []
      }

      const next: Line[] = [...previous, { id: nextId(), kind: 'command', text }]

      switch (command.toLowerCase()) {
        case 'help':
          next.push(
            { id: nextId(), kind: 'output', type: 'info', text: 'Available commands:' },
            { id: nextId(), kind: 'output', type: 'normal', text: 'help      show commands' },
            { id: nextId(), kind: 'output', type: 'normal', text: 'about     project summary' },
            { id: nextId(), kind: 'output', type: 'normal', text: 'echo      print text' },
            { id: nextId(), kind: 'output', type: 'normal', text: 'progress  show progress bars demo' },
            { id: nextId(), kind: 'output', type: 'normal', text: 'date      show current date/time' },
            { id: nextId(), kind: 'output', type: 'normal', text: 'clear     clear terminal output' },
          )
          break
        case 'about':
          next.push({
            id: nextId(),
            kind: 'output',
            type: 'success',
            text: 'terminal-ui: basic terminal-style React components.',
          })
          break
        case 'echo':
          next.push({
            id: nextId(),
            kind: 'output',
            type: argText ? 'normal' : 'warning',
            text: argText || 'Usage: echo <text>',
          })
          break
        case 'progress':
          next.push(
            { id: nextId(), kind: 'output', type: 'info', text: 'TerminalProgress demo:' },
            { id: nextId(), kind: 'progress', label: 'Installing...', percent: 40, variant: 'green' },
            { id: nextId(), kind: 'progress', label: 'Building...', percent: 75, variant: 'blue' },
            { id: nextId(), kind: 'progress', label: 'Deploying...', percent: 100, variant: 'cyan' },
            { id: nextId(), kind: 'progress', label: 'Errors', percent: 12, variant: 'red' },
          )
          break
        case 'date':
          next.push({
            id: nextId(),
            kind: 'output',
            type: 'normal',
            text: new Date().toLocaleString(),
          })
          break
        default:
          next.push({
            id: nextId(),
            kind: 'output',
            type: 'error',
            text: `Unknown command: ${command}. Type "help" for available commands.`,
          })
      }

      return next
    })
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    runCommand(input)
    setInput('')
  }

  return (
    <Terminal title="interactive.sh">
      <div
        className="h-72 overflow-y-auto pr-2"
        onClick={() => inputRef.current?.focus()}
        role="presentation"
      >
        {lines.map((line) => {
          if (line.kind === 'command') {
            return (
              <TerminalCommand key={line.id} prompt={PROMPT}>
                {line.text}
              </TerminalCommand>
            )
          }
          if (line.kind === 'progress') {
            return (
              <TerminalProgress
                key={line.id}
                label={line.label}
                percent={line.percent}
                variant={line.variant}
              />
            )
          }
          return (
            <TerminalOutput key={line.id} type={line.type}>
              {line.text}
            </TerminalOutput>
          )
        })}

        <form onSubmit={onSubmit} className="mt-2 flex items-center gap-2">
          <span className="select-none text-[var(--term-green)]">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="w-full bg-transparent text-[var(--term-fg)] outline-none"
            placeholder='Type "help" and press Enter'
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal command input"
          />
        </form>
        <div ref={endRef} />
      </div>
    </Terminal>
  )
}
