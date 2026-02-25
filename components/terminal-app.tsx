'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from '@/components/ui/context-menu'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider, THEMES, useTheme, type ThemeId } from '@/components/terminal-themes'
import { TerminalHeader } from '@/components/terminal-header'
import { TerminalStatusBar } from '@/components/terminal-status-bar'
import { TerminalPane } from '@/components/terminal-pane'
import { CommandPalette } from '@/components/command-palette'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  title: string
  panes: string[]
}

let globalId = 0
function uid() {
  return `t${++globalId}`
}

function TerminalAppInner({ className }: { className?: string }) {
  const { setTheme } = useTheme()
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const paneId = uid()
    return [{ id: uid(), title: 'Terminal', panes: [paneId] }]
  })
  const [activeTabId, setActiveTabId] = useState(() => tabs[0].id)
  const [focusedPane, setFocusedPane] = useState<string>('')
  const [clearRequest, setClearRequest] = useState<{ paneId: string; nonce: number }>({
    paneId: '',
    nonce: 0,
  })

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0]

  useEffect(() => {
    if (!focusedPane && activeTab.panes.length > 0) {
      setFocusedPane(activeTab.panes[0])
    }
  }, [activeTab, focusedPane])

  const addTab = useCallback(() => {
    const paneId = uid()
    const tab: Tab = { id: uid(), title: 'Terminal', panes: [paneId] }
    setTabs((prev) => [...prev, tab])
    setActiveTabId(tab.id)
    setFocusedPane(paneId)
  }, [])

  const closeTab = useCallback(
    (tabId: string) => {
      setTabs((prev) => {
        if (prev.length <= 1) return prev
        const idx = prev.findIndex((t) => t.id === tabId)
        const next = prev.filter((t) => t.id !== tabId)
        if (activeTabId === tabId) {
          const newIdx = Math.min(idx, next.length - 1)
          setActiveTabId(next[newIdx].id)
          setFocusedPane(next[newIdx].panes[0])
        }
        return next
      })
    },
    [activeTabId],
  )

  const splitPane = useCallback(() => {
    const newPaneId = uid()
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, panes: [...t.panes, newPaneId] }
          : t,
      ),
    )
    setFocusedPane(newPaneId)
  }, [activeTabId])

  const closePane = useCallback(
    (paneId: string) => {
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id !== activeTabId) return t
          if (t.panes.length <= 1) return t
          const panes = t.panes.filter((p) => p !== paneId)
          if (focusedPane === paneId) {
            setFocusedPane(panes[0])
          }
          return { ...t, panes }
        }),
      )
    },
    [activeTabId, focusedPane],
  )

  useEffect(() => {
    const down = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault()
        addTab()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault()
        splitPane()
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [addTab, splitPane])

  const totalPanes = activeTab.panes.length

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-[var(--glass-border)] shadow-2xl shadow-black/50',
        className,
      )}
    >
      <TerminalHeader
        tabs={tabs.map((t) => ({ id: t.id, title: t.title }))}
        activeTab={activeTabId}
        onTabChange={(id) => {
          setActiveTabId(id)
          const tab = tabs.find((t) => t.id === id)
          if (tab) setFocusedPane(tab.panes[0])
        }}
        onTabClose={closeTab}
        onNewTab={addTab}
        onSplit={splitPane}
      />

      <div className="flex-1 min-h-0">
        <ResizablePanelGroup className="h-full">
          {activeTab.panes.map((paneId, i) => (
            <PaneWithContext
              key={paneId}
              paneId={paneId}
              index={i}
              total={activeTab.panes.length}
              isFocused={focusedPane === paneId}
              onFocus={() => setFocusedPane(paneId)}
              onSplit={splitPane}
              onNewTab={addTab}
              onClosePane={() => closePane(paneId)}
              tabCount={tabs.length}
              setTheme={setTheme}
              clearSignal={clearRequest.paneId === paneId ? clearRequest.nonce : 0}
            />
          ))}
        </ResizablePanelGroup>
      </div>

      <TerminalStatusBar
        paneCount={totalPanes}
        tabCount={tabs.length}
      />

      <CommandPalette
        onNewTab={addTab}
        onSplit={splitPane}
        onClear={() => {
          if (!focusedPane) return
          setClearRequest({ paneId: focusedPane, nonce: Date.now() })
        }}
      />
    </div>
  )
}

function PaneWithContext({
  paneId,
  index,
  total,
  isFocused,
  onFocus,
  onSplit,
  onNewTab,
  onClosePane,
  tabCount,
  setTheme,
  clearSignal,
}: {
  paneId: string
  index: number
  total: number
  isFocused: boolean
  onFocus: () => void
  onSplit: () => void
  onNewTab: () => void
  onClosePane: () => void
  tabCount: number
  setTheme: (id: ThemeId) => void
  clearSignal: number
}) {
  return (
    <>
      {index > 0 && <ResizableHandle className="w-px bg-[var(--glass-border)]" />}
      <ResizablePanel minSize={20}>
        <ContextMenu>
          <ContextMenuTrigger className="h-full block">
            <TerminalPane
              id={paneId}
              onSplit={onSplit}
              onNewTab={onNewTab}
              tabCount={tabCount}
              isFocused={isFocused}
              onFocus={onFocus}
              clearSignal={clearSignal}
            />
          </ContextMenuTrigger>
          <ContextMenuContent className="w-52 bg-[var(--term-bg-panel)] border-[var(--glass-border)]">
            <ContextMenuItem
              className="gap-2 text-xs"
              onSelect={() => navigator.clipboard.readText()}
            >
              Paste
            </ContextMenuItem>
            <ContextMenuSeparator className="bg-[var(--glass-border)]" />
            <ContextMenuItem className="gap-2 text-xs" onSelect={onSplit}>
              Split Pane
            </ContextMenuItem>
            <ContextMenuItem className="gap-2 text-xs" onSelect={onNewTab}>
              New Tab
            </ContextMenuItem>
            {total > 1 && (
              <ContextMenuItem
                className="gap-2 text-xs text-[var(--term-red)]"
                onSelect={onClosePane}
              >
                Close Pane
              </ContextMenuItem>
            )}
            <ContextMenuSeparator className="bg-[var(--glass-border)]" />
            <ContextMenuSub>
              <ContextMenuSubTrigger className="gap-2 text-xs">
                Theme
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-40 bg-[var(--term-bg-panel)] border-[var(--glass-border)]">
                {THEMES.map((t) => (
                  <ContextMenuItem
                    key={t.id}
                    className="gap-2 text-xs"
                    onSelect={() => setTheme(t.id)}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: t.accent }}
                    />
                    {t.name}
                  </ContextMenuItem>
                ))}
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuContent>
        </ContextMenu>
      </ResizablePanel>
    </>
  )
}

export function TerminalApp({ className }: { className?: string }) {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={300}>
        <TerminalAppInner className={className} />
      </TooltipProvider>
    </ThemeProvider>
  )
}
