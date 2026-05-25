import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const week = searchParams.get('week') || '1'
  const year = searchParams.get('year') || '2026'
  const label = searchParams.get('label') || 'Current week'
  const range = searchParams.get('range') || ''
  const type = searchParams.get('type') || 'week' // week | special | calendar

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
          background: '#0f0f0f',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: '#e8c547', display: 'flex' }} />

        {/* Site name */}
        <div style={{ position: 'absolute', top: 28, left: 40, color: '#e8c547', fontSize: 22, fontFamily: 'serif', display: 'flex' }}>
          AllYourWeek.com
        </div>

        {/* Year badge */}
        <div style={{ position: 'absolute', top: 28, right: 40, color: '#555', fontSize: 18, fontFamily: 'monospace', display: 'flex' }}>
          {year}
        </div>

        {/* Label */}
        <div style={{ color: '#666', fontSize: 16, letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 16, display: 'flex' }}>
          {label}
        </div>

        {/* Big number or name */}
        {type === 'week' ? (
          <div style={{ color: '#e8c547', fontSize: 200, lineHeight: 1, fontFamily: 'serif', display: 'flex' }}>
            {week}
          </div>
        ) : (
          <div style={{ color: '#e8c547', fontSize: 80, lineHeight: 1.1, fontFamily: 'serif', textAlign: 'center', maxWidth: 900, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {week}
          </div>
        )}

        {/* Divider */}
        <div style={{ width: 80, height: 2, background: '#2e2e2e', margin: '24px 0', display: 'flex' }} />

        {/* Date range */}
        {range && (
          <div style={{ color: '#f0f0f0', fontSize: 28, fontFamily: 'sans-serif', fontWeight: 300, display: 'flex' }}>
            {range}
          </div>
        )}

        {/* Bottom accent */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#2e2e2e', display: 'flex' }} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
