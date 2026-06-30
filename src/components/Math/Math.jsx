import katex from 'katex'
import 'katex/dist/katex.min.css'

function renderMath(tex, displayMode) {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      strict: false,
    })
  } catch {
    return `<span style="color:#f87171">${tex}</span>`
  }
}

export function BlockMath({ math }) {
  return (
    <div
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: renderMath(math, true) }}
    />
  )
}

export function InlineMath({ math }) {
  return (
    <span
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: renderMath(math, false) }}
    />
  )
}
