'use client'

import { Terminal, TerminalCommand } from '@/components/terminal'
import { TerminalTree } from '@/components/terminal-tree'
import type { TreeNode, TreeRenderContext } from '@/components/terminal-tree'

// ── Baseline demo ────────────────────────────────────────────────────────────

const baselineNodes: TreeNode[] = [
  {
    label: 'terminal-ui/',
    icon: '📁',
    expanded: true,
    children: [
      {
        label: 'components/',
        icon: '📁',
        children: [
          { label: 'terminal.tsx', icon: '📄', style: 'success' },
          { label: 'terminal-tree.tsx', icon: '📄', style: 'info' },
          { label: 'terminal-progress.tsx', icon: '📄' },
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
      { label: 'package.json', icon: '📄', style: 'warning' },
      { label: 'tsconfig.json', icon: '📄' },
    ],
  },
]

// ── Custom icons demo ─────────────────────────────────────────────────────────

const sourceNodes: TreeNode[] = [
  {
    label: 'src/',
    expanded: true,
    children: [
      {
        label: 'components/',
        children: [
          { label: 'Button.tsx' },
          { label: 'Input.tsx' },
          { label: 'Modal.tsx' },
        ],
      },
      {
        label: 'hooks/',
        children: [
          { label: 'useTheme.ts' },
          { label: 'useAuth.ts' },
        ],
      },
      {
        label: 'styles/',
        children: [
          { label: 'globals.css' },
          { label: 'tokens.css' },
        ],
      },
      { label: 'index.ts' },
    ],
  },
]

function fileIcon({ hasChildren, isExpanded, node }: TreeRenderContext) {
  const name = typeof node.label === 'string' ? node.label : ''
  if (hasChildren) return <span className="w-5 text-center">{isExpanded ? '📂' : '📁'}</span>
  if (name.endsWith('.tsx') || name.endsWith('.ts')) return <span className="w-5 text-center">🔷</span>
  if (name.endsWith('.css')) return <span className="w-5 text-center">🎨</span>
  return <span className="w-5 text-center">📄</span>
}

// ── Custom label formatting demo ──────────────────────────────────────────────

const depNodes: TreeNode[] = [
  {
    label: 'dependencies',
    expanded: true,
    children: [
      { label: 'next@16.1.6', style: 'success' },
      { label: 'react@19.0.0', style: 'success' },
      { label: 'tailwindcss@4.2.1', style: 'success' },
      { label: 'framer-motion@11.15.0', style: 'info' },
      { label: 'lucide-react@0.468.0', style: 'info' },
    ],
  },
  {
    label: 'devDependencies',
    children: [
      { label: 'typescript@5.0.0', style: 'warning' },
      { label: '@types/react@19.0.0', style: 'warning' },
    ],
  },
]

function styledLabel({ node, depth }: TreeRenderContext) {
  const text = typeof node.label === 'string' ? node.label : null
  if (!text) return <span>{node.label}</span>

  if (depth === 0) {
    return (
      <span className="text-[var(--term-purple)] font-bold tracking-wide">
        {text}
      </span>
    )
  }

  // Split "name@version" for coloured display
  const atIdx = text.lastIndexOf('@')
  if (atIdx > 0) {
    const pkg = text.slice(0, atIdx)
    const ver = text.slice(atIdx)
    return (
      <span>
        <span className="text-[var(--term-fg)]">{pkg}</span>
        <span className="text-[var(--term-fg-dim)]">{ver}</span>
      </span>
    )
  }

  return <span>{text}</span>
}

// ─────────────────────────────────────────────────────────────────────────────

export function TreeDemo() {
  return (
    <div className="flex flex-col gap-6">
      {/* Baseline */}
      <div>
        <p className="text-xs text-[var(--term-fg-dim)] font-mono mb-2">
          Default — node.icon + node.label
        </p>
        <Terminal title="ls -la terminal-ui/">
          <TerminalCommand>tree .</TerminalCommand>
          <TerminalTree nodes={baselineNodes} />
        </Terminal>
      </div>

      {/* Custom icons via renderIcon */}
      <div>
        <p className="text-xs text-[var(--term-fg-dim)] font-mono mb-2">
          Custom icons via <code className="text-[var(--term-blue)]">renderIcon</code> — icons change by file type and expand state
        </p>
        <Terminal title="src/ — custom icons">
          <TerminalCommand>tree src/</TerminalCommand>
          <TerminalTree nodes={sourceNodes} renderIcon={fileIcon} />
        </Terminal>
      </div>

      {/* Custom label formatting via renderLabel */}
      <div>
        <p className="text-xs text-[var(--term-fg-dim)] font-mono mb-2">
          Custom label formatting via <code className="text-[var(--term-blue)]">renderLabel</code> — name/version split coloring
        </p>
        <Terminal title="package.json — dependency tree">
          <TerminalCommand>npm ls --depth=1</TerminalCommand>
          <TerminalTree nodes={depNodes} renderLabel={styledLabel} />
        </Terminal>
      </div>
    </div>
  )
}
