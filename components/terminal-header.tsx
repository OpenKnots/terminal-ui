'use client'

import { Plus, Palette, Monitor, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { THEMES, useTheme } from '@/components/terminal-themes'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  title: string
}

interface TerminalHeaderProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
  onTabClose: (id: string) => void
  onNewTab: () => void
  onSplit: () => void
}

export function TerminalHeader({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  onNewTab,
  onSplit,
}: TerminalHeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex h-10 items-center border-b border-[var(--glass-border)] bg-[var(--term-bg-light)]">
      {/* Traffic lights */}
      <div className="flex items-center gap-1.5 px-3.5">
        <button
          className="h-3 w-3 rounded-full bg-[#ef4444] transition-opacity hover:opacity-80"
          aria-label="Close"
        />
        <button
          className="h-3 w-3 rounded-full bg-[#eab308] transition-opacity hover:opacity-80"
          aria-label="Minimize"
        />
        <button
          className="h-3 w-3 rounded-full bg-[#22c55e] transition-opacity hover:opacity-80"
          aria-label="Maximize"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-1 items-center gap-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'group relative flex h-10 items-center gap-2 border-r border-[var(--glass-border)] px-4 font-mono text-xs transition-colors',
              activeTab === tab.id
                ? 'bg-[var(--term-bg)] text-[var(--term-fg)]'
                : 'text-[var(--term-fg-dim)] hover:bg-[var(--glass-bg)] hover:text-[var(--term-fg)]',
            )}
          >
            <Monitor size={12} className="shrink-0 opacity-50" />
            <span className="max-w-[120px] truncate">{tab.title}</span>
            {tabs.length > 1 && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  onTabClose(tab.id)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.stopPropagation()
                    onTabClose(tab.id)
                  }
                }}
                className="ml-1 rounded-sm p-0.5 text-[var(--term-fg-dim)] opacity-0 transition-opacity hover:bg-[var(--glass-bg)] hover:text-[var(--term-fg)] group-hover:opacity-100"
              >
                ×
              </span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-[var(--term-green)]" />
            )}
          </button>
        ))}

        {/* New tab button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onNewTab}
              className="flex h-10 items-center px-2.5 text-[var(--term-fg-dim)] transition-colors hover:text-[var(--term-fg)]"
            >
              <Plus size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">New Tab</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--term-fg-dim)] transition-colors hover:bg-[var(--glass-bg)] hover:text-[var(--term-fg)]">
              <Palette size={13} />
              <ChevronDown size={10} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 bg-[var(--term-bg-panel)] border-[var(--glass-border)]"
          >
            <DropdownMenuLabel className="text-[var(--term-fg-dim)] text-xs">
              Theme
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--glass-border)]" />
            {THEMES.map((t) => (
              <DropdownMenuItem
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  'gap-2 text-xs cursor-pointer',
                  theme === t.id && 'text-[var(--term-green)]',
                )}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: t.accent }}
                />
                {t.name}
                {theme === t.id && (
                  <span className="ml-auto text-[var(--term-green)]">✓</span>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-[var(--glass-border)]" />
            <DropdownMenuItem
              onClick={onSplit}
              className="gap-2 text-xs cursor-pointer"
            >
              Split Pane
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
