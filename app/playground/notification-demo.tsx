'use client'

import { useState } from 'react'
import { Terminal, TerminalCommand, TerminalOutput, TerminalNotification } from '@/components/terminal'

export function NotificationDemo() {
  const [notifications, setNotifications] = useState<
    Array<{ id: number; variant: any; message: string }>
  >([])
  const [nextId, setNextId] = useState(1)

  const addNotification = (variant: any, message: string) => {
    const id = nextId
    setNextId(nextId + 1)
    setNotifications((prev) => [...prev, { id, variant, message }])
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <>
      <Terminal title="notification-demo.sh">
        <TerminalCommand>show-notifications</TerminalCommand>
        <TerminalOutput type="info">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => addNotification('success', 'Build completed successfully!')}
              className="rounded border border-[var(--term-green)] bg-[color-mix(in_oklab,var(--term-green)_12%,transparent)] px-3 py-1.5 font-mono text-xs text-[var(--term-green)] transition-colors hover:bg-[color-mix(in_oklab,var(--term-green)_20%,transparent)]"
            >
              Success
            </button>
            <button
              onClick={() => addNotification('error', 'Connection failed. Please try again.')}
              className="rounded border border-[var(--term-red)] bg-[color-mix(in_oklab,var(--term-red)_12%,transparent)] px-3 py-1.5 font-mono text-xs text-[var(--term-red)] transition-colors hover:bg-[color-mix(in_oklab,var(--term-red)_20%,transparent)]"
            >
              Error
            </button>
            <button
              onClick={() =>
                addNotification('warning', 'Disk space running low (15% remaining)')
              }
              className="rounded border border-[var(--term-yellow)] bg-[color-mix(in_oklab,var(--term-yellow)_12%,transparent)] px-3 py-1.5 font-mono text-xs text-[var(--term-yellow)] transition-colors hover:bg-[color-mix(in_oklab,var(--term-yellow)_20%,transparent)]"
            >
              Warning
            </button>
            <button
              onClick={() => addNotification('info', 'New version 2.0 available')}
              className="rounded border border-[var(--term-blue)] bg-[color-mix(in_oklab,var(--term-blue)_12%,transparent)] px-3 py-1.5 font-mono text-xs text-[var(--term-blue)] transition-colors hover:bg-[color-mix(in_oklab,var(--term-blue)_20%,transparent)]"
            >
              Info
            </button>
            <button
              onClick={() => addNotification('neutral', 'System maintenance scheduled')}
              className="rounded border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1.5 font-mono text-xs text-[var(--term-fg)] transition-colors hover:bg-[color-mix(in_oklab,white_8%,var(--glass-bg))]"
            >
              Neutral
            </button>
          </div>
        </TerminalOutput>
      </Terminal>

      {/* Render notifications */}
      {notifications.map((notif) => (
        <TerminalNotification
          key={notif.id}
          message={notif.message}
          variant={notif.variant}
          duration={5000}
          onDismiss={() => removeNotification(notif.id)}
        />
      ))}
    </>
  )
}
