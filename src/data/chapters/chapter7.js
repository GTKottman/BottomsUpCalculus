export default {
  id: 'chapter_7',
  number: 7,
  title: 'Counting Rectangles Forever',
  subtitle: 'The Integral',
  narratorLetter: {
    date: 'A quiet evening',
    body: [
      "Now we flip the question.",
      "Derivatives ask: how fast is this changing? Integrals ask: how much has accumulated? How much total area is under this curve? How far has the car traveled given its speed at each moment?",
      "The basic idea is embarrassingly simple. You want the area under a curve f(x) from x = a to x = b. You do not know how to find it exactly. So you approximate it with rectangles.",
      "One rectangle is a terrible approximation. Ten rectangles is better. A hundred is better still. And if you could use infinitely many, infinitely thin rectangles -- that is the integral.",
      "We are back to taking limits. Always limits.",
    ],
  },
  sections: [
    {
      id: 'riemann',
      title: 'Riemann Sums: Start Crude, Get Precise',
      content: [
        {
          type: 'text',
          body: 'Divide [a, b] into n equal subintervals of width Δx = (b - a)/n. At each subinterval, build a rectangle with height f(xᵢ). Sum all the rectangles:',
        },
        {
          type: 'math',
          body: '\\sum_{i=1}^{n} f(x_i) \\Delta x \\approx \\int_a^b f(x)\\,dx',
        },
        {
          type: 'text',
          body: 'As n → ∞ and Δx → 0, the approximation becomes exact. The definite integral is the limit of this Riemann sum.',
        },
        {
          type: 'graph',
          graphType: 'riemann',
          curve: 'parabola',
          config: { a: 0, b: 2, xDomain: [-0.2, 2.4], yDomain: [-0.2, 4.5], initialN: 6 },
          caption: 'Drag the slider -- more rectangles, better approximation. Watch the error collapse.',
        },
        {
          type: 'insight',
          body: 'Notice how the error drops rapidly at first, then more slowly. This is the nature of numerical approximation -- you get most of the accuracy from the first few doublings.',
        },
      ],
    },
    {
      id: 'definite_integral',
      title: 'The Definite Integral',
      content: [
        {
          type: 'text',
          body: 'The definite integral is defined as the limit of Riemann sums:',
        },
        {
          type: 'math',
          body: '\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i^*)\\,\\Delta x',
        },
        {
          type: 'text',
          body: 'The integral gives the signed area: area above the x-axis is positive, area below is negative. If the function dips below zero in [a,b], those regions subtract from the total.',
        },
        {
          type: 'insight',
          body: 'Key properties: ∫ from a to a = 0. ∫ from a to b = -∫ from b to a. ∫(f + g) = ∫f + ∫g. These follow directly from properties of limits and sums.',
        },
      ],
    },
    {
      id: 'antiderivatives',
      title: 'Antiderivatives: Running Backwards',
      content: [
        {
          type: 'text',
          body: 'An antiderivative of f is a function F such that F\'(x) = f(x). If F\'(x) = f(x), we write:',
        },
        {
          type: 'math',
          body: '\\int f(x)\\,dx = F(x) + C',
        },
        {
          type: 'text',
          body: 'The +C is because any constant has derivative 0 -- so infinitely many antiderivatives exist, differing only by a constant.',
        },
        {
          type: 'math',
          body: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\qquad (n \\neq -1)',
        },
        {
          type: 'insight',
          body: 'Power rule in reverse: add 1 to the exponent, divide by the new exponent. The +C is not optional -- it represents the entire family of antiderivatives.',
        },
      ],
    },
    {
      id: 'game',
      title: 'Area Estimator',
      content: [
        {
          type: 'minigame',
          gameType: 'areaEstimator',
          caption: 'Guess how many rectangles it takes to get within 1% of the true area.',
        },
        {
          type: 'playground',
          playgroundType: 'riemannComparator',
          caption: 'All four methods side by side. Drag n and watch which converges fastest.',
        },
      ],
    },
  ],
  quiz: {
    id: 'chapter_7_quiz',
    questions: [
      {
        id: 'q1',
        question: 'What is ∫x³ dx?',
        options: ['3x²', '3x² + C', 'x⁴/4 + C', 'x⁴'],
        correct: 2,
        explanation: 'Power rule for integration: add 1 to exponent (3+1=4), divide by new exponent (4). Result: x⁴/4 + C. Always include +C for indefinite integrals.',
      },
      {
        id: 'q2',
        question: 'The definite integral ∫₋₁¹ x dx equals:',
        options: ['1', '2', '0', '1/2'],
        correct: 2,
        explanation: 'x is an odd function -- symmetric about the origin with opposite signs on [-1,0] and [0,1]. The signed areas cancel exactly. ∫₋₁¹ x dx = [x²/2]₋₁¹ = 1/2 - 1/2 = 0.',
      },
      {
        id: 'q3',
        question: 'As you increase the number of Riemann sum rectangles from 10 to 1000, the approximation:',
        options: [
          'Gets worse due to rounding',
          'Stays the same',
          'Gets better and approaches the true integral',
          'Gets better only if f is increasing',
        ],
        correct: 2,
        explanation: 'More rectangles means smaller Δx, which means a better approximation of the area. As n → ∞ and Δx → 0, the Riemann sum converges to the exact definite integral.',
      },
    ],
  },
}
