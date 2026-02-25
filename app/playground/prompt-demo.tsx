'use client'

import { useState } from 'react'
import { Terminal, TerminalCommand, TerminalOutput, TerminalPrompt } from '@/components/terminal'

export function PromptDemo() {
  const [history, setHistory] = useState<string[]>(['ls', 'cd src', 'pwd'])
  const [log, setLog] = useState<{ cmd: string; out: string }[]>([])

  const handleCommand = (cmd: string) => {
    setHistory((h) => [...h, cmd])
    setLog((l) => [
      ...l,
      {
        cmd,
        out: `Executed: ${cmd}`,
      },
    ])
  }

  return (
    <Terminal title="terminal-prompt — demo">
      {log.map((entry, i) => (
        <div key={i}>
          <TerminalCommand>{entry.cmd}</TerminalCommand>
          <TerminalOutput type="success">{entry.out}</TerminalOutput>
        </div>
      ))}
      {log.length === 0 && (
        <TerminalOutput type="info">Type a command below and press Enter.</TerminalOutput>
      )}
      <div className="mt-2">
        <TerminalPrompt
          history={history}
          onCommand={handleCommand}
          prompt="$"
        />
      </div>
    </Terminal>
  )
}
