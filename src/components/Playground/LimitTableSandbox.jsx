import { useState } from 'react'

const FUNCTIONS = [
  {
    key: 'parabola',
    label: 'f(x) = x²',
    target: 2,
    targetLabel: 'x → 2',
    f: x => x * x,
  },
  {
    key: 'sinc',
    label: 'f(x) = sin(x)/x',
    target: 0,
    targetLabel: 'x → 0',
    f: x => (x === 0 ? NaN : Math.sin(x) / x),
  },
  {
    key: 'jump',
    label: 'f(x) = |x|/x',
    target: 0,
    targetLabel: 'x → 0',
    f: x => (x === 0 ? NaN : Math.abs(x) / x),
  },
  {
    key: 'hole',
    label: 'f(x) = (x²−1)/(x−1)',
    target: 1,
    targetLabel: 'x → 1',
    f: x => (Math.abs(x - 1) < 1e-12 ? NaN : (x * x - 1) / (x - 1)),
  },
]

const STEPS = [1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6]

function fmt(v) {
  if (!isFinite(v)) return <span style={{ color: '#f87171' }}>undefined</span>
  const s = v.toPrecision(8)
  return s
}

export default function LimitTableSandbox() {
  const [fnKey, setFnKey] = useState('parabola')

  const fn = FUNCTIONS.find(f => f.key === fnKey)
  const { target, f } = fn

  const leftRows = STEPS.map(step => {
    const x = target - step
    return { x, y: f(x) }
  })
  const rightRows = [...STEPS].reverse().map(step => {
    const x = target + step
    return { x, y: f(x) }
  })

  // Decide verdict
  const leftLimit = leftRows[leftRows.length - 1].y
  const rightLimit = rightRows[0].y
  const limitsMatch = isFinite(leftLimit) && isFinite(rightLimit) && Math.abs(leftLimit - rightLimit) < 1e-4

  let verdict = null
  let verdictColor = '#f87171'
  if (limitsMatch) {
    verdict = `Limit exists ≈ ${((leftLimit + rightLimit) / 2).toPrecision(6)}`
    verdictColor = '#a3e635'
  } else if (!isFinite(leftLimit) && !isFinite(rightLimit)) {
    verdict = 'Limit does not exist (function undefined near target)'
    verdictColor = '#f87171'
  } else {
    verdict = 'Limit does not exist (left ≠ right)'
    verdictColor = '#fb923c'
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-ink-800)', border: '1px solid var(--color-ink-600)' }}
    >
      <div className="px-5 py-4 flex flex-wrap items-center gap-3" style={{ borderBottom: '1px solid var(--color-ink-700)' }}>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#f5a030' }}>
          Limit Table Sandbox
        </span>
        <div className="flex flex-wrap gap-2 ml-auto">
          {FUNCTIONS.map(fn => (
            <button
              key={fn.key}
              onClick={() => setFnKey(fn.key)}
              className="text-xs px-3 py-1 rounded-full transition-all"
              style={{
                backgroundColor: fnKey === fn.key ? '#f5a030' : 'var(--color-ink-700)',
                color: fnKey === fn.key ? 'var(--color-ink-950)' : 'var(--color-ink-400)',
                border: '1px solid var(--color-ink-600)',
              }}
            >
              {fn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm mb-4" style={{ color: 'var(--color-ink-300)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
          Approach <strong style={{ color: '#f5a030' }}>{fn.targetLabel}</strong> from both sides. Read down each column toward the target row.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-ink-600)' }}>
                <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#f5a030' }}>x (from left)</th>
                <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#f5a030' }}>f(x)</th>
                <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#818cf8' }}>x (from right)</th>
                <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#818cf8' }}>f(x)</th>
              </tr>
            </thead>
            <tbody>
              {leftRows.map((lr, i) => {
                const rr = rightRows[rightRows.length - 1 - i]
                const isNearest = i === leftRows.length - 1
                return (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: isNearest ? 'rgba(245,160,48,0.07)' : 'transparent',
                      borderBottom: '1px solid var(--color-ink-700)',
                    }}
                  >
                    <td className="py-1.5 px-3" style={{ color: '#f5a030' }}>{lr.x.toPrecision(7)}</td>
                    <td className="py-1.5 px-3 text-right" style={{ color: 'var(--color-ink-200)' }}>{fmt(lr.y)}</td>
                    <td className="py-1.5 px-3 text-right" style={{ color: '#818cf8' }}>{rr.x.toPrecision(7)}</td>
                    <td className="py-1.5 px-3 text-right" style={{ color: 'var(--color-ink-200)' }}>{fmt(rr.y)}</td>
                  </tr>
                )
              })}
              {/* Target row */}
              <tr style={{ backgroundColor: 'rgba(251,191,36,0.12)', borderBottom: '1px solid var(--color-ink-600)' }}>
                <td className="py-2 px-3 text-center font-bold" colSpan={4} style={{ color: '#fbbf24', letterSpacing: '0.05em' }}>
                  ↑ x → {target} ↑
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          className="mt-4 rounded-lg px-5 py-3 text-sm font-semibold"
          style={{
            backgroundColor: 'var(--color-ink-700)',
            border: `1px solid ${verdictColor}44`,
            color: verdictColor,
            fontFamily: 'var(--font-handwritten)',
            fontSize: '1rem',
          }}
        >
          {verdict}
        </div>
      </div>
    </div>
  )
}
