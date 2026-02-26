'use client'

import { useState } from 'react'
import { Terminal, TerminalCommand, TerminalOutput } from '@/components/terminal'
import { TerminalTree } from '@/components/terminal-tree'
import type { TreeNode } from '@/components/terminal-tree'

// ── Deep tree — 50+ nodes across 4 levels ────────────────────────────────────
// Demonstrates that collapsed branches are absent from the DOM, not just hidden.

function makeFileNodes(names: string[]): TreeNode[] {
  return names.map((n) => ({ label: n, icon: '📄' }))
}

const deepNodes: TreeNode[] = [
  {
    label: 'packages/', icon: '📁', expanded: true,
    children: [
      {
        label: 'core/', icon: '📁',
        children: [
          {
            label: 'src/', icon: '📁',
            children: makeFileNodes(['index.ts', 'types.ts', 'utils.ts', 'constants.ts', 'errors.ts']),
          },
          {
            label: 'tests/', icon: '📁',
            children: makeFileNodes(['index.test.ts', 'utils.test.ts', 'errors.test.ts']),
          },
          ...makeFileNodes(['package.json', 'tsconfig.json', 'README.md']),
        ],
      },
      {
        label: 'ui/', icon: '📁',
        children: [
          {
            label: 'components/', icon: '📁',
            children: makeFileNodes(['Button.tsx', 'Input.tsx', 'Modal.tsx', 'Tooltip.tsx', 'Badge.tsx', 'Card.tsx']),
          },
          {
            label: 'hooks/', icon: '📁',
            children: makeFileNodes(['useTheme.ts', 'useBreakpoint.ts', 'usePortal.ts']),
          },
          {
            label: 'styles/', icon: '📁',
            children: makeFileNodes(['globals.css', 'tokens.css', 'animations.css']),
          },
          ...makeFileNodes(['package.json', 'tsconfig.json']),
        ],
      },
      {
        label: 'cli/', icon: '📁',
        children: [
          {
            label: 'commands/', icon: '📁',
            children: makeFileNodes(['init.ts', 'build.ts', 'dev.ts', 'deploy.ts', 'test.ts']),
          },
          ...makeFileNodes(['bin.ts', 'package.json']),
        ],
      },
    ],
  },
  {
    label: 'apps/', icon: '📁',
    children: [
      {
        label: 'web/', icon: '📁',
        children: [
          {
            label: 'app/', icon: '📁',
            children: makeFileNodes(['page.tsx', 'layout.tsx', 'globals.css']),
          },
          ...makeFileNodes(['next.config.ts', 'package.json']),
        ],
      },
      {
        label: 'docs/', icon: '📁',
        children: makeFileNodes(['index.mdx', 'getting-started.mdx', 'api.mdx']),
      },
    ],
  },
  ...makeFileNodes(['pnpm-workspace.yaml', 'turbo.json', '.gitignore', 'README.md']),
]

// ── DOM node counter demo ─────────────────────────────────────────────────────

export function TreeVisibleDemo() {
  const [expandCount, setExpandCount] = useState(0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-[var(--term-fg-dim)] font-mono mb-2">
          50+ node monorepo — collapsed branches are{' '}
          <span className="text-[var(--term-green)]">not mounted in the DOM</span>.
          Expand a folder to mount its children.
        </p>
        <Terminal title="monorepo — render-only-visible">
          <TerminalCommand>tree . --depth=4</TerminalCommand>
          <TerminalOutput type="info">
            {`${expandCount} expand/collapse event(s) fired`}
          </TerminalOutput>
          <TerminalTree
            nodes={deepNodes}
            expandable={true}
          />
        </Terminal>
      </div>

      <div>
        <p className="text-xs text-[var(--term-fg-dim)] font-mono mb-2">
          Non-expandable tree — static display, all nodes rendered immediately
        </p>
        <Terminal title="static tree">
          <TerminalCommand>cat project-structure.txt</TerminalCommand>
          <TerminalTree
            nodes={[
              {
                label: 'src/', icon: '📁',
                children: [
                  { label: 'index.ts', icon: '📄', style: 'success' },
                  { label: 'types.ts', icon: '📄', style: 'info' },
                  { label: 'utils.ts', icon: '📄' },
                ],
              },
              { label: 'package.json', icon: '📄', style: 'warning' },
            ]}
            expandable={false}
          />
        </Terminal>
      </div>
    </div>
  )
}
