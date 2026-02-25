import { TerminalApp } from '@/components/terminal-app'
import { Terminal, TerminalCommand, TerminalDiff, TerminalOutput, TerminalSpinner } from '@/components/terminal'
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
          Interactive command input with history navigation (up / down).
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
          TerminalSpinner
        </h2>
        <Terminal title="spinner-demo.sh">
          <TerminalCommand>pnpm run build</TerminalCommand>
          <TerminalSpinner text="Compiling components..." />
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
          Copy Button
        </h2>
        <Terminal title="copy-demo.sh">
          <TerminalCommand>pnpm run build</TerminalCommand>
          <TerminalOutput type="success">Compiled successfully in 1.2s</TerminalOutput>
          <TerminalOutput type="info">Click the copy icon in the header to copy this output.</TerminalOutput>
        </Terminal>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold font-mono text-[var(--term-fg)]">
          TerminalDiff
        </h2>
        <Terminal title="diff-demo.sh">
          <TerminalCommand>git diff -- src/config.ts</TerminalCommand>
          <TerminalOutput type="info">Unified</TerminalOutput>
          <TerminalDiff
            before={'const retries = 2\nconst timeoutMs = 1500\nconst env = "staging"'}
            after={'const retries = 3\nconst timeoutMs = 2000\nconst env = "production"'}
            mode="unified"
          />
          <TerminalOutput type="info">Split</TerminalOutput>
          <TerminalDiff
            before={'PORT=3000\nLOG_LEVEL=info\nFEATURE_FLAG=false'}
            after={'PORT=3000\nLOG_LEVEL=debug\nFEATURE_FLAG=true'}
            mode="split"
          />
        </Terminal>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold font-mono text-[var(--term-fg)]">
          Syntax Highlighting
        </h2>
        <Terminal title="package-info.json">
          <TerminalCommand>cat package.json | jq '.name, .version, .scripts'</TerminalCommand>
          <TerminalOutput language="json">
            {`{
  "name": "@openknots/terminal-ui",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}`}
          </TerminalOutput>
        </Terminal>
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
