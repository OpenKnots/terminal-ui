import { TerminalApp } from '@/components/terminal-app'
import { Terminal, TerminalCommand, TerminalOutput } from '@/components/terminal'
import { TerminalProgress } from '@/components/terminal-progress'
import { LogDemo } from './log-demo'
import { PromptDemo } from './prompt-demo'

export const metadata = {
  title: 'Playground',
}

export default function PlaygroundPage() {
  return (
    <main className="flex flex-col gap-8 p-6 min-h-screen">
      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold font-mono text-[var(--term-fg)]">
          Terminal App
        </h2>
        <div className="h-[480px]">
          <TerminalApp className="h-full" />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold font-mono text-[var(--term-fg)]">
          TerminalPrompt
        </h2>
        <p className="text-sm text-[var(--term-fg-dim)] font-mono">
          Interactive command input with history navigation (↑ / ↓).
        </p>
        <PromptDemo />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold font-mono text-[var(--term-fg)]">
          TerminalProgress
        </h2>
        <Terminal title="progress-demo.sh">
          <TerminalCommand>pnpm install</TerminalCommand>
          <TerminalProgress label="Resolving packages..." percent={25} variant="yellow" />
          <TerminalProgress label="Downloading..." percent={62} variant="blue" />
          <TerminalProgress label="Linking dependencies..." percent={88} variant="purple" />
          <TerminalProgress label="Done" percent={100} variant="green" />
        </Terminal>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold font-mono text-[var(--term-fg)]">
          TerminalLog
        </h2>
        <p className="text-sm text-[var(--term-fg-dim)] font-mono">
          Simulated streaming logs with capped history and auto-scroll.
        </p>
        <LogDemo />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold font-mono text-[var(--term-fg)]">
          Typing Animation
        </h2>
        <Terminal title="deploy-log.sh">
          <TerminalCommand>npm run deploy</TerminalCommand>
          <TerminalOutput type="info" animate delay={28}>
            Building production bundle...
          </TerminalOutput>
          <TerminalOutput type="success" animate delay={20}>
            Deployment complete. URL: https://example.app
          </TerminalOutput>
        </Terminal>
      </section>
    </main>
  )
}
