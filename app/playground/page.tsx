import { TerminalApp } from '@/components/terminal-app'
import { Terminal, TerminalCommand, TerminalDiff, TerminalOutput, TerminalSpinner, TerminalBadge, ThemeSwitcher } from '@/components/terminal'
import { TerminalProgress } from '@/components/terminal-progress'
import { TerminalTable } from '@/components/terminal-table'
import { TerminalTabs } from '@/components/terminal-tabs'
import { TerminalSelect } from '@/components/terminal-select'
import { LogDemo } from './log-demo'
import { PromptDemo } from './prompt-demo'
import { TreeDemo } from './tree-demo'
import { TreeKeyboardDemo } from './tree-keyboard-demo'

export const metadata = {
  title: 'Playground',
}

export default function PlaygroundPage() {
  return (
    <main className="flex flex-col gap-8 p-6 min-h-screen">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold font-mono text-[var(--term-fg)]">
          Playground
        </h1>
        <ThemeSwitcher />
      </section>

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
          TerminalTree
        </h2>
        <p className="text-sm text-[var(--term-fg-dim)] font-mono">
          Expandable tree with custom icon, label, and row render props.
        </p>
        <TreeDemo />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold font-mono text-[var(--term-fg)]">
          Tree Keyboard Navigation
        </h2>
        <p className="text-sm text-[var(--term-fg-dim)] font-mono">
          Arrow keys to navigate, Enter/Space to toggle, ArrowRight to expand/enter, ArrowLeft to collapse/parent.
        </p>
        <TreeKeyboardDemo />
      </section>


      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold font-mono text-[var(--term-fg)]">
          TerminalBadge
        </h2>
        <Terminal title="badge-demo.sh">
          <TerminalCommand>pnpm run release</TerminalCommand>
          <TerminalOutput type="info">
            <span className="flex flex-wrap items-center gap-2">
              <TerminalBadge variant="info">staging</TerminalBadge>
              <TerminalBadge variant="success">v1.2.0</TerminalBadge>
              <TerminalBadge variant="warning">WARN 2</TerminalBadge>
              <TerminalBadge variant="error">EXIT 1</TerminalBadge>
            </span>
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

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold font-mono text-[var(--term-fg)]">
          TerminalTable
        </h2>
        <p className="text-sm text-[var(--term-fg-dim)] font-mono">
          Data tables with box-drawing characters and alignment options.
        </p>
        <Terminal title="table-demo.sh">
          <TerminalCommand>ls -la /node_modules</TerminalCommand>
          <TerminalTable
            headers={['Name', 'Version', 'Size', 'Type']}
            rows={[
              ['react', '19.0.0', '142 kB', 'core'],
              ['next', '15.1.0', '540 kB', 'framework'],
              ['typescript', '5.7.0', '89 MB', 'language'],
              ['tailwindcss', '4.0.0', '12 MB', 'utility'],
            ]}
            align={['left', 'left', 'right', 'left']}
            striped
          />
        </Terminal>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold font-mono text-[var(--term-fg)]">
          TerminalTabs
        </h2>
        <p className="text-sm text-[var(--term-fg-dim)] font-mono">
          Tab bar with keyboard navigation (←→ to navigate, Enter to select).
        </p>
        <Terminal title="tabs-demo.sh">
          <TerminalCommand>open tabs</TerminalCommand>
          <TerminalTabs
            tabs={[
              { id: '1', label: 'server.ts', icon: '🔥' },
              { id: '2', label: 'client.ts', icon: '⚛️' },
              { id: '3', label: 'config.json', icon: '⚙️' },
              { id: '4', label: 'styles.css', icon: '🎨' },
            ]}
            activeId="1"
            variant="blue"
          />
          <TerminalOutput type="info">
            Use ← → arrow keys to switch tabs
          </TerminalOutput>
        </Terminal>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold font-mono text-[var(--term-fg)]">
          TerminalSelect
        </h2>
        <p className="text-sm text-[var(--term-fg-dim)] font-mono">
          Dropdown select component styled for terminal aesthetic.
        </p>
        <Terminal title="select-demo.sh">
          <TerminalCommand>select-framework</TerminalCommand>
          <TerminalSelect
            label="Choose a framework:"
            options={['Next.js', 'Nuxt', 'Astro', 'Remix', 'SolidStart']}
            variant="blue"
          />
        </Terminal>
      </section>
    </main>
  )
}
