'use client'

import { Terminal, TerminalCommand, TerminalOutput, TerminalTree } from '@/components/terminal'

const TREE_NODES = [
  {
    label: 'src/',
    icon: '📁',
    expanded: true,
    children: [
      {
        label: 'components/',
        icon: '📁',
        expanded: true,
        children: [
          { label: 'terminal.tsx', icon: '📄' },
          { label: 'terminal-tree.tsx', icon: '📄' },
        ],
      },
      {
        label: 'app/',
        icon: '📁',
        children: [
          { label: 'page.tsx', icon: '📄' },
          { label: 'layout.tsx', icon: '📄' },
        ],
      },
      { label: 'lib/', icon: '📁' },
    ],
  },
]

export function TreeKeyboardDemo() {
  return (
    <Terminal title="tree-keyboard-demo.sh">
      <TerminalCommand>tree src</TerminalCommand>
      <TerminalOutput type="info">
        Use ↑/↓ to move, → to expand, ← to collapse/parent, Enter/Space to toggle.
      </TerminalOutput>
      <TerminalTree nodes={TREE_NODES} />
    </Terminal>
  )
}
