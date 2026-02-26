'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { Terminal, TerminalCommand, TerminalOutput } from '@/components/terminal'
import { TerminalProgress } from '@/components/terminal-progress'
import { TerminalTable } from '@/components/terminal-table'
import { TerminalBarChart, TerminalSparkline } from '@/components/terminal-chart'

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
  | {
      id: number
      kind: 'table'
      headers: string[]
      rows: string[][]
    }
  | {
      id: number
      kind: 'barchart'
      data: { label: string; value: number }[]
      title?: string
      unit?: string
      variant: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'cyan'
    }
  | {
      id: number
      kind: 'sparkline'
      data: number[]
      label?: string
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
            { id: nextId(), kind: 'output', type: 'normal', text: 'table     show table demo' },
            { id: nextId(), kind: 'output', type: 'normal', text: 'chart     show chart demos' },
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
        case 'table':
          next.push(
            { id: nextId(), kind: 'output', type: 'info', text: 'TerminalTable demo:' },
            {
              id: nextId(),
              kind: 'table',
              headers: ['Package', 'Version', 'Size'],
              rows: [
                ['react', '19.0.0', '142 kB'],
                ['next', '16.1.6', '540 kB'],
                ['typescript', '5.7.0', '38 kB'],
                ['tailwindcss', '4.2.1', '210 kB'],
              ],
            },
          )
          break
        case 'chart':
          next.push(
            { id: nextId(), kind: 'output', type: 'info', text: 'TerminalBarChart demo:' },
            {
              id: nextId(),
              kind: 'barchart',
              title: 'Bundle Size (kB)',
              unit: ' kB',
              variant: 'cyan',
              data: [
                { label: 'react', value: 142 },
                { label: 'next', value: 540 },
                { label: 'typescript', value: 38 },
                { label: 'tailwindcss', value: 210 },
              ],
            },
            { id: nextId(), kind: 'output', type: 'info', text: 'TerminalSparkline demo:' },
            {
              id: nextId(),
              kind: 'sparkline',
              label: 'CPU',
              data: [12, 45, 23, 67, 34, 89, 56, 78, 43, 91, 65, 38],
              variant: 'green',
            },
            {
              id: nextId(),
              kind: 'sparkline',
              label: 'Mem',
              data: [80, 82, 85, 83, 87, 90, 88, 92, 91, 89, 93, 95],
              variant: 'yellow',
            },
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
          if (line.kind === 'table') {
            return (
              <TerminalTable
                key={line.id}
                headers={line.headers}
                rows={line.rows}
              />
            )
          }
          if (line.kind === 'barchart') {
            return (
              <TerminalBarChart
                key={line.id}
                data={line.data}
                title={line.title}
                unit={line.unit}
                variant={line.variant}
              />
            )
          }
          if (line.kind === 'sparkline') {
            return (
              <TerminalSparkline
                key={line.id}
                data={line.data}
                label={line.label}
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
