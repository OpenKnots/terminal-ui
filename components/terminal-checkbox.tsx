'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

export interface TerminalCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  /** The text label displayed next to the checkbox */
  label: string
}

/**
 * A terminal-styled checkbox component `[x]` / `[ ]`.
 * 
 * @param label - The text label displayed next to the checkbox
 * @param props - Standard HTML input props (checked, onChange, disabled, etc.)
 * 
 * @example
 * ```tsx
 * <TerminalCheckbox label="Enable experimental features" defaultChecked />
 * ```
 */
export const TerminalCheckbox = forwardRef<HTMLInputElement, TerminalCheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className={`group flex items-start gap-2 cursor-pointer font-mono text-sm text-[var(--term-fg)] ${className}`.trim()}>
        <input
          type="checkbox"
          ref={ref}
          className="peer sr-only"
          {...props}
        />
        <div className="relative flex shrink-0 items-center justify-center w-[3ch] h-5 text-[var(--term-fg-dim)] group-hover:text-[var(--term-cyan)] peer-focus-visible:ring-1 peer-focus-visible:ring-[var(--term-blue)] rounded peer-disabled:opacity-50 peer-checked:text-[var(--term-green)]">
          <span className="absolute inset-0 flex items-center justify-center opacity-100 group-has-[:checked]:opacity-0">[ ]</span>
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-has-[:checked]:opacity-100">[x]</span>
        </div>
        <span className="pt-[1px] peer-disabled:opacity-50 select-none">{label}</span>
      </label>
    )
  }
)
TerminalCheckbox.displayName = 'TerminalCheckbox'

export interface TerminalRadioProps extends InputHTMLAttributes<HTMLInputElement> {
  /** The text label displayed next to the radio button */
  label: string
}

/**
 * A terminal-styled radio button component `(•)` / `( )`.
 * 
 * @param label - The text label displayed next to the radio button
 * @param props - Standard HTML input props (checked, onChange, value, name, etc.)
 * 
 * @example
 * ```tsx
 * <TerminalRadio name="theme" value="dark" label="Dark mode" defaultChecked />
 * ```
 */
export const TerminalRadio = forwardRef<HTMLInputElement, TerminalRadioProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className={`group flex items-start gap-2 cursor-pointer font-mono text-sm text-[var(--term-fg)] ${className}`.trim()}>
        <input
          type="radio"
          ref={ref}
          className="peer sr-only"
          {...props}
        />
        <div className="relative flex shrink-0 items-center justify-center w-[3ch] h-5 text-[var(--term-fg-dim)] group-hover:text-[var(--term-cyan)] peer-focus-visible:ring-1 peer-focus-visible:ring-[var(--term-blue)] rounded peer-disabled:opacity-50 peer-checked:text-[var(--term-green)]">
          <span className="absolute inset-0 flex items-center justify-center opacity-100 group-has-[:checked]:opacity-0">( )</span>
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-has-[:checked]:opacity-100">(•)</span>
        </div>
        <span className="pt-[1px] peer-disabled:opacity-50 select-none">{label}</span>
      </label>
    )
  }
)
TerminalRadio.displayName = 'TerminalRadio'
