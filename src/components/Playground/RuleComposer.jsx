import { useState } from 'react'
import { BlockMath, InlineMath } from '../Math/Math'

// Power rule tab
const POWER_EXPONENTS = [1, 2, 3, 4, 5, -1, -2, 0.5]

function PowerRule() {
  const [n, setN] = useState(3)

  const nDisplay = Number.isInteger(n) ? String(n) : n === 0.5 ? '\\frac{1}{2}' : String(n)
  const nMinus1 = n - 1
  const nMinus1Display = Number.isInteger(nMinus1) ? String(nMinus1) : nMinus1 === -0.5 ? '-\\frac{1}{2}' : nMinus1.toFixed(2)

  return (
    <div className="space-y-5">
      <p className="text-sm" style={{ color: 'var(--color-ink-300)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
        Choose an exponent and watch the power rule apply instantly.
      </p>

      <div className="flex flex-wrap gap-2">
        {POWER_EXPONENTS.map(exp => (
          <button
            key={exp}
            onClick={() => setN(exp)}
            className="text-xs px-3 py-1.5 rounded-lg transition-all font-mono"
            style={{
              backgroundColor: n === exp ? '#818cf8' : 'var(--color-ink-700)',
              color: n === exp ? 'var(--color-ink-950)' : 'var(--color-ink-300)',
              border: '1px solid var(--color-ink-600)',
            }}
          >
            n = {exp}
          </button>
        ))}
      </div>

      <div
        className="rounded-lg px-6 py-5 space-y-4"
        style={{ backgroundColor: 'var(--color-ink-700)', border: '1px solid var(--color-ink-600)' }}
      >
        <div>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-ink-400)' }}>Function</div>
          <BlockMath math={`f(x) = x^{${nDisplay}}`} />
        </div>
        <div style={{ borderTop: '1px solid var(--color-ink-600)', paddingTop: '1rem' }}>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#818cf8' }}>Derivative (power rule: bring down n, reduce exponent)</div>
          <BlockMath math={`f'(x) = ${nDisplay} \\cdot x^{${nDisplay}-1} = ${nDisplay} x^{${nMinus1Display}}`} />
        </div>
      </div>

      <div
        className="rounded-lg px-5 py-3 text-sm"
        style={{ backgroundColor: 'rgba(129,140,248,0.08)', border: '1px solid #818cf844' }}
      >
        <InlineMath math="\dfrac{d}{dx} x^n = n x^{n-1}" />
        <span className="ml-3" style={{ color: 'var(--color-ink-400)' }}>works for any real n</span>
      </div>
    </div>
  )
}

// Product rule tab
const PRODUCT_PAIRS = [
  { u: 'x^2', v: '\\sin(x)', uLabel: 'x²', vLabel: 'sin(x)', du: '2x', dv: '\\cos(x)' },
  { u: 'x^3', v: 'e^x', uLabel: 'x³', vLabel: 'eˣ', du: '3x^2', dv: 'e^x' },
  { u: '\\sqrt{x}', v: '\\ln(x)', uLabel: '√x', vLabel: 'ln(x)', du: '\\dfrac{1}{2\\sqrt{x}}', dv: '\\dfrac{1}{x}' },
  { u: '\\sin(x)', v: '\\cos(x)', uLabel: 'sin(x)', vLabel: 'cos(x)', du: '\\cos(x)', dv: '-\\sin(x)' },
]

function ProductRule() {
  const [pairIdx, setPairIdx] = useState(0)
  const pair = PRODUCT_PAIRS[pairIdx]

  return (
    <div className="space-y-5">
      <p className="text-sm" style={{ color: 'var(--color-ink-300)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
        Pick two functions. The product rule breaks the derivative into two terms.
      </p>

      <div className="flex flex-wrap gap-2">
        {PRODUCT_PAIRS.map((p, i) => (
          <button
            key={i}
            onClick={() => setPairIdx(i)}
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{
              backgroundColor: pairIdx === i ? '#f5a030' : 'var(--color-ink-700)',
              color: pairIdx === i ? 'var(--color-ink-950)' : 'var(--color-ink-300)',
              border: '1px solid var(--color-ink-600)',
            }}
          >
            {p.uLabel} · {p.vLabel}
          </button>
        ))}
      </div>

      <div
        className="rounded-lg px-6 py-5 space-y-4"
        style={{ backgroundColor: 'var(--color-ink-700)', border: '1px solid var(--color-ink-600)' }}
      >
        <div>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-ink-400)' }}>Function</div>
          <BlockMath math={`f(x) = \\underbrace{${pair.u}}_{u} \\cdot \\underbrace{${pair.v}}_{v}`} />
        </div>
        <div style={{ borderTop: '1px solid var(--color-ink-600)', paddingTop: '1rem' }}>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#f5a030' }}>Derivative (product rule: u'v + uv')</div>
          <BlockMath math={`f'(x) = \\underbrace{${pair.du}}_{u'} \\cdot \\underbrace{${pair.v}}_{v} + \\underbrace{${pair.u}}_{u} \\cdot \\underbrace{${pair.dv}}_{v'}`} />
        </div>
      </div>

      <div
        className="rounded-lg px-5 py-3 text-sm"
        style={{ backgroundColor: 'rgba(245,160,48,0.08)', border: '1px solid #f5a03044' }}
      >
        <InlineMath math="(uv)' = u'v + uv'" />
      </div>
    </div>
  )
}

// Chain rule tab
const CHAIN_PAIRS = [
  { outer: '\\sin', inner: 'x^2', outerLabel: 'sin', innerLabel: 'x²', outerD: '\\cos', innerD: '2x', result: '\\cos(x^2) \\cdot 2x' },
  { outer: 'e^', inner: '3x', outerLabel: 'eˣ', innerLabel: '3x', outerD: 'e^', innerD: '3', result: 'e^{3x} \\cdot 3' },
  { outer: '(\\cdot)^3', inner: '\\sin(x)', outerLabel: '(·)³', innerLabel: 'sin(x)', outerD: '3(\\cdot)^2', innerD: '\\cos(x)', result: '3(\\sin(x))^2 \\cdot \\cos(x)' },
  { outer: '\\ln', inner: 'x^2+1', outerLabel: 'ln', innerLabel: 'x²+1', outerD: '\\dfrac{1}{\\cdot}', innerD: '2x', result: '\\dfrac{1}{x^2+1} \\cdot 2x' },
]

function ChainRule() {
  const [pairIdx, setPairIdx] = useState(0)
  const pair = CHAIN_PAIRS[pairIdx]

  return (
    <div className="space-y-5">
      <p className="text-sm" style={{ color: 'var(--color-ink-300)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
        Pick a composition. The chain rule differentiates the outside, then multiplies by the derivative of the inside.
      </p>

      <div className="flex flex-wrap gap-2">
        {CHAIN_PAIRS.map((p, i) => (
          <button
            key={i}
            onClick={() => setPairIdx(i)}
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{
              backgroundColor: pairIdx === i ? '#22d3ee' : 'var(--color-ink-700)',
              color: pairIdx === i ? 'var(--color-ink-950)' : 'var(--color-ink-300)',
              border: '1px solid var(--color-ink-600)',
            }}
          >
            {p.outerLabel}({p.innerLabel})
          </button>
        ))}
      </div>

      <div
        className="rounded-lg px-6 py-5 space-y-4"
        style={{ backgroundColor: 'var(--color-ink-700)', border: '1px solid var(--color-ink-600)' }}
      >
        <div>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-ink-400)' }}>Composition f(g(x))</div>
          <BlockMath math={`f(g(x)) = ${pair.outer}\\!\\left(\\underbrace{${pair.inner}}_{g(x)}\\right)`} />
        </div>
        <div style={{ borderTop: '1px solid var(--color-ink-600)', paddingTop: '1rem' }}>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#22d3ee' }}>Step 1 -- differentiate outer, leave inner alone</div>
          <BlockMath math={`\\text{outer'} = ${pair.outerD}\\!\\left(${pair.inner}\\right)`} />
        </div>
        <div style={{ borderTop: '1px solid var(--color-ink-600)', paddingTop: '1rem' }}>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#22d3ee' }}>Step 2 -- multiply by derivative of inner</div>
          <BlockMath math={`g'(x) = ${pair.innerD}`} />
        </div>
        <div style={{ borderTop: '1px solid var(--color-ink-600)', paddingTop: '1rem', backgroundColor: 'rgba(34,211,238,0.06)', borderRadius: '0.5rem', padding: '1rem' }}>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#22d3ee', fontWeight: 700 }}>Result</div>
          <BlockMath math={`\\frac{d}{dx}\\left[f(g(x))\\right] = ${pair.result}`} />
        </div>
      </div>

      <div
        className="rounded-lg px-5 py-3 text-sm"
        style={{ backgroundColor: 'rgba(34,211,238,0.08)', border: '1px solid #22d3ee44' }}
      >
        <InlineMath math="\frac{d}{dx}[f(g(x))] = f'(g(x)) \cdot g'(x)" />
      </div>
    </div>
  )
}

const TABS = [
  { key: 'power', label: 'Power Rule', color: '#818cf8' },
  { key: 'product', label: 'Product Rule', color: '#f5a030' },
  { key: 'chain', label: 'Chain Rule', color: '#22d3ee' },
]

export default function RuleComposer() {
  const [tab, setTab] = useState('power')
  const activeTab = TABS.find(t => t.key === tab)

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-ink-800)', border: '1px solid var(--color-ink-600)' }}
    >
      <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--color-ink-700)' }}>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#818cf8' }}>
          Rule Composer
        </span>
        <div className="flex gap-2 ml-auto">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="text-xs px-3 py-1.5 rounded-full transition-all"
              style={{
                backgroundColor: tab === t.key ? t.color : 'var(--color-ink-700)',
                color: tab === t.key ? 'var(--color-ink-950)' : 'var(--color-ink-400)',
                border: `1px solid ${tab === t.key ? t.color : 'var(--color-ink-600)'}`,
                fontWeight: tab === t.key ? 700 : 400,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: activeTab.color }}
        >
          {activeTab.label}
        </div>
        {tab === 'power' && <PowerRule />}
        {tab === 'product' && <ProductRule />}
        {tab === 'chain' && <ChainRule />}
      </div>
    </div>
  )
}
