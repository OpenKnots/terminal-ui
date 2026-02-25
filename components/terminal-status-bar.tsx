'use client'

import { Badge } from '@/components/ui/badge'
import { useTheme, THEMES } from '@/components/terminal-themes'

interface TerminalStatusBarProps {
  paneCount: number
  tabCount: number
  shell?: string
  cwd?: string
}

export function TerminalStatusBar({
  paneCount,
  tabCount,
  shell = 'zsh',
  cwd = '~',
}: TerminalStatusBarProps) {
  const { theme } = useTheme()
  const themeName = THEMES.find((t) => t.id === theme)?.name ?? 'Default'

  return (
    <div className="flex h-6 items-center justify-between border-t border-[var(--glass-border)] bg-[var(--term-bg-light)] px-3 font-mono text-[10px] text-[var(--term-fg-dim)]">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--term-green)]" />
          {shell}
        </span>
        <span className="opacity-50">|</span>
        <span>{cwd}</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className="h-4 rounded-sm px-1.5 text-[9px] font-normal bg-[var(--glass-bg)] text-[var(--term-fg-dim)] border-none"
        >
          {themeName}
        </Badge>
        {paneCount > 1 && (
          <span>
            {paneCount} pane{paneCount !== 1 ? 's' : ''}
          </span>
        )}
        <span>
          {tabCount} tab{tabCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
