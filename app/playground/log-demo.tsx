'use client'

import { useEffect, useState } from 'react'
import { Terminal, TerminalCommand, TerminalLog } from '@/components/terminal'

const STREAM_LINES = [
  '[info] Connecting to build worker...',
  '[info] Installing dependencies...',
  '[warn] Cache miss for @openknots/terminal-ui',
  '[info] Running unit tests...',
  '[info] Packaging artifacts...',
  '[success] Deployment finished.',
]

export function LogDemo() {
  const [logs, setLogs] = useState<string[]>(() => [
    '[boot] Starting live stream...',
    '[boot] Waiting for events...',
  ])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLogs((current) => {
        const nextLine = STREAM_LINES[current.length % STREAM_LINES.length]
        return [...current, nextLine]
      })
    }, 900)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  return (
    <Terminal title="stream.log">
      <TerminalCommand>tail -f logs/deploy.log</TerminalCommand>
      <TerminalLog lines={logs} maxLines={10} autoScroll />
    </Terminal>
  )
}
