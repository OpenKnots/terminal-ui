import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'OpenKnots terminal-ui'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  const logoData = await readFile(join(process.cwd(), 'public', 'logo.png'))
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage:
            'radial-gradient(circle at 50% 30%, #1a1a2e 0%, #0a0a0a 70%)',
        }}
      >
        <img
          src={logoBase64}
          width={160}
          height={160}
          style={{ marginBottom: 40 }}
          alt=""
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            terminal-ui
          </span>
        </div>

        <div
          style={{
            fontSize: 24,
            color: '#a0a0a0',
            letterSpacing: '0.01em',
          }}
        >
          Beautiful terminal components for React
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18, color: '#666666' }}>by</span>
          <span style={{ fontSize: 18, color: '#888888', fontWeight: 600 }}>
            OpenKnots
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
