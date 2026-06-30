export default {
  id: 'chapter_5',
  number: 5,
  title: 'Rules of the Road',
  subtitle: 'Differentiation Techniques',
  narratorLetter: {
    date: 'A normal Wednesday',
    body: [
      "You have now seen the limit definition of the derivative. It is beautiful. It is also slow.",
      "Computing the derivative of x¹⁰ from the limit definition would take you a while. Computing the derivative of sin(x²) · e^x from the limit definition would take you most of an afternoon.",
      "So mathematicians, being lazy in the best possible way, derived a set of rules that let you skip the limit computation. These rules are not magic -- each one is proved from the limit definition.",
      "I am going to show you the rules and, more importantly, why they work. Because understanding why means you will never forget them, and you will know when they apply.",
      "This is the chapter where calculus becomes a tool you can actually use.",
    ],
  },
  sections: [
    {
      id: 'power_rule',
      title: 'The Power Rule',
      content: [
        {
          type: 'text',
          body: 'The most used rule in all of calculus:',
        },
        {
          type: 'math',
          body: '\\frac{d}{dx} x^n = nx^{n-1}',
        },
        {
          type: 'text',
          body: 'Bring the exponent down as a coefficient, reduce the exponent by 1. Works for any real n -- positive, negative, fractional.',
        },
        {
          type: 'text',
          body: 'Examples: d/dx(x³) = 3x². d/dx(x⁻¹) = -x⁻². d/dx(√x) = d/dx(x^(1/2)) = (1/2)x^(-1/2).',
        },
        {
          type: 'insight',
          body: 'Why does it work? The binomial theorem shows that (x+h)^n expands to x^n + nx^(n-1)h + (smaller h terms). Subtract x^n, divide by h, take h → 0, and only nx^(n-1) survives.',
        },
      ],
    },
    {
      id: 'linearity',
      title: 'Sum, Difference, and Constant Rules',
      content: [
        {
          type: 'text',
          body: 'Differentiation is linear -- it distributes over addition and scales with constants:',
        },
        {
          type: 'math',
          body: '\\frac{d}{dx}[f(x) + g(x)] = f\'(x) + g\'(x)',
        },
        {
          type: 'math',
          body: '\\frac{d}{dx}[cf(x)] = c \\cdot f\'(x)',
        },
        {
          type: 'text',
          body: 'This means differentiating a polynomial is just applying the power rule term by term: d/dx(4x³ - 7x + 2) = 12x² - 7.',
        },
      ],
    },
    {
      id: 'product_quotient',
      title: 'Product and Quotient Rules',
      content: [
        {
          type: 'text',
          body: 'The derivative of a product is NOT just the product of the derivatives. The product rule:',
        },
        {
          type: 'math',
          body: '\\frac{d}{dx}[f \\cdot g] = f\'g + fg\'',
        },
        {
          type: 'text',
          body: 'Memory trick: "first times derivative of second, plus second times derivative of first."',
        },
        {
          type: 'math',
          body: '\\frac{d}{dx}\\left[\\frac{f}{g}\\right] = \\frac{f\'g - fg\'}{g^2}',
        },
        {
          type: 'insight',
          body: 'Quotient rule memory trick: "low d-high minus high d-low, over low squared." (d-high means derivative of the numerator, d-low means derivative of denominator.)',
        },
      ],
    },
    {
      id: 'chain_rule',
      title: 'The Chain Rule',
      content: [
        {
          type: 'text',
          body: 'The chain rule handles composite functions -- functions of functions. It is probably the most important differentiation rule:',
        },
        {
          type: 'math',
          body: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
        },
        {
          type: 'text',
          body: 'Leibniz notation makes this feel like fractions canceling: if y = f(u) and u = g(x), then dy/dx = (dy/du)(du/dx).',
        },
        {
          type: 'text',
          body: 'Example: d/dx(sin(x²)) = cos(x²) · 2x. We differentiated the outer function (sin → cos) and multiplied by the derivative of the inner (x² → 2x).',
        },
        {
          type: 'insight',
          body: 'The chain rule is the backbone of every complex differentiation. When in doubt, ask: "Is this a function of a function?" If yes, chain rule.',
        },
      ],
    },
    {
      id: 'trig_exp',
      title: 'Trig and Exponential Derivatives',
      content: [
        {
          type: 'text',
          body: 'The derivative of sine and cosine chase each other in a cycle:',
        },
        {
          type: 'math',
          body: '\\frac{d}{dx}\\sin x = \\cos x \\qquad \\frac{d}{dx}\\cos x = -\\sin x',
        },
        {
          type: 'text',
          body: 'The most magical derivative in all of mathematics:',
        },
        {
          type: 'math',
          body: '\\frac{d}{dx}e^x = e^x',
        },
        {
          type: 'insight',
          body: 'e^x is its own derivative. This means: at every point, the rate at which e^x is growing equals its current value. A population that grows in proportion to its size -- that is e^x.',
        },
        {
          type: 'playground',
          playgroundType: 'ruleComposer',
          caption: 'Switch between the three rules. See each one applied step by step in live notation.',
        },
      ],
    },
  ],
  quiz: {
    id: 'chapter_5_quiz',
    questions: [
      {
        id: 'q1',
        question: 'What is d/dx(5x⁴ - 3x² + 7)?',
        options: ['20x³ - 6x', '20x³ - 6x + 7', '5x³ - 3x', '4x³ - 2x'],
        correct: 0,
        explanation: 'Apply power rule term by term: d/dx(5x⁴) = 20x³, d/dx(-3x²) = -6x, d/dx(7) = 0. Result: 20x³ - 6x.',
      },
      {
        id: 'q2',
        question: 'What is d/dx[x² · sin(x)]?',
        options: [
          '2x · cos(x)',
          'x² · cos(x)',
          '2x · sin(x) + x² · cos(x)',
          '2x · sin(x) - x² · cos(x)',
        ],
        correct: 2,
        explanation: 'Product rule: f = x², g = sin(x). f\' = 2x, g\' = cos(x). Result: f\'g + fg\' = 2x·sin(x) + x²·cos(x).',
      },
      {
        id: 'q3',
        question: 'What is d/dx[sin(3x²)]?',
        options: ['cos(3x²)', '6x·cos(3x²)', '6x·cos(6x)', '-cos(3x²)·6x'],
        correct: 1,
        explanation: 'Chain rule: outer function is sin(u), inner is u = 3x². Derivative: cos(3x²) · d/dx(3x²) = cos(3x²) · 6x.',
      },
      {
        id: 'q4',
        question: 'If h(x) = e^(x²), what is h\'(x)?',
        options: ['e^(x²)', '2x', '2x · e^(x²)', 'x² · e^(x²-1)'],
        correct: 2,
        explanation: 'Chain rule: outer function is e^u, inner is u = x². d/dx(e^u) = e^u · du/dx = e^(x²) · 2x.',
      },
    ],
  },
}
