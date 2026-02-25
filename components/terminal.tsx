'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Minimize2, Maximize2, X } from 'lucide-react'

interface TerminalProps {
  children: ReactNode
  title?: string
  prompt?: string
  className?: string
}

export function Terminal({ children, title = 'Terminal', prompt = '$', className = '' }: TerminalProps) {
  return (
    <div className={`bg-[var(--term-bg-light)] border border-[var(--glass-border)] rounded-lg overflow-hidden ${className}`}>
      {/* Window Chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--glass-border)] bg-[rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <div className="w-3 h-3 rounded-full bg-[#eab308]" />
          <div className="w-3 h-3 rounded-full bg-[#10b981]" />
        </div>
        <div className="text-xs text-[var(--term-fg-dim)] font-mono">
          {title}
        </div>
        <div className="flex items-center gap-2 opacity-0">
          <Minimize2 size={12} />
          <Maximize2 size={12} />
          <X size={12} />
        </div>
      </div>
      
      {/* Terminal Content */}
      <div className="p-4 font-mono text-sm">
        {children}
      </div>
    </div>
  )
}

interface TerminalCommandProps {
  children: ReactNode
  prompt?: string
}

export function TerminalCommand({ children, prompt = '$' }: TerminalCommandProps) {
  return (
    <div className="flex items-start gap-2 mb-1">
      <span className="text-[var(--term-green)] select-none">{prompt}</span>
      <span className="flex-1">{children}</span>
    </div>
  )
}

interface TerminalOutputProps {
  children: ReactNode
  type?: 'normal' | 'success' | 'error' | 'info' | 'warning'
  animate?: boolean
  delay?: number
}

export function TerminalOutput({
  children,
  type = 'normal',
  animate = false,
  delay = 35,
}: TerminalOutputProps) {
  const [typedText, setTypedText] = useState('')

  const colors = {
    normal: 'text-[var(--term-fg-dim)]',
    success: 'text-[var(--term-green)]',
    error: 'text-[var(--term-red)]',
    info: 'text-[var(--term-blue)]',
    warning: 'text-[var(--term-yellow)]',
  }

  const textContent = useMemo(() => {
    if (typeof children === 'string' || typeof children === 'number') {
      return String(children)
    }
    return null
  }, [children])

  useEffect(() => {
    if (!animate || textContent === null) {
      setTypedText(textContent ?? '')
      return
    }

    setTypedText('')
    let index = 0
    const tickDelay = Math.max(10, delay)
    const timer = window.setInterval(() => {
      index += 1
      setTypedText(textContent.slice(0, index))
      if (index >= textContent.length) {
        window.clearInterval(timer)
      }
    }, tickDelay)

    return () => {
      window.clearInterval(timer)
    }
  }, [animate, delay, textContent])

  return (
    <div className={`mb-1 whitespace-pre-wrap ${colors[type]}`}>
      {animate && textContent !== null ? typedText : children}
    </div>
  )
}

interface TerminalSpinnerProps {
  text?: string
}

export function TerminalSpinner({ text }: TerminalSpinnerProps) {
  return (
    <div className="flex items-center gap-2 text-[var(--term-blue)]">
      <span className="animate-spin">⠋</span>
      {text && <span>{text}</span>}
    </div>
  )
}

export { TerminalProgress } from './terminal-progress'
