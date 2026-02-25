import { TerminalApp } from '@/components/terminal-app'
import { Terminal, TerminalCommand, TerminalOutput } from '@/components/terminal'

export const metadata = {
  title: 'Playground',
}

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen space-y-6 p-4">
      <section>
        <h2 className="mb-3 font-mono text-sm text-[var(--term-fg-dim)]">Interactive Terminal App</h2>
        <div className="h-[560px]">
          <TerminalApp className="h-full" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-sm text-[var(--term-fg-dim)]">Typing Animation Demo</h2>
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
