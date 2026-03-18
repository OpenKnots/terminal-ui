'use client'

import { Terminal, TerminalCommand, TerminalOutput } from '@/components/terminal'
import { TerminalKeyboard } from '@/components/terminal-keyboard'

export function KeyboardDemo() {
  return (
    <Terminal title="keyboard-shortcuts">
      <TerminalCommand>shortcuts --list</TerminalCommand>
      <TerminalOutput type="info">Terminal shortcuts:</TerminalOutput>

      <div className="mt-2 space-y-3">
        <TerminalKeyboard
          title="Navigation"
          columns={2}
          shortcuts={[
            { keys: ['↑', '↓'], label: 'History' },
            { keys: ['Ctrl', 'K'], label: 'Command palette' },
            { keys: ['Ctrl', 'C'], label: 'Cancel' },
            { keys: ['Ctrl', 'L'], label: 'Clear' },
            { keys: ['Tab'], label: 'Autocomplete' },
            { keys: ['Esc'], label: 'Close menu' },
          ]}
        />

        <TerminalKeyboard
          title="Editing"
          shortcuts={[
            { keys: ['Ctrl', 'A'], label: 'Start of line' },
            { keys: ['Ctrl', 'E'], label: 'End of line' },
            { keys: ['Ctrl', 'W'], label: 'Delete word' },
          ]}
        />
      </div>
    </Terminal>
  )
}
