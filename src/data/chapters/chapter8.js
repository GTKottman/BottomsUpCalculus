export default {
  id: 'chapter_8',
  number: 8,
  title: 'The Grand Reunion',
  subtitle: 'The Fundamental Theorem of Calculus',
  narratorLetter: {
    date: 'The last letter -- for now',
    body: [
      "We have arrived.",
      "I have been holding this back because it hits harder when you have earned it. And you have now earned it.",
      "We started with functions and slopes. We built limits. We used limits to define continuity. We used limits to define the derivative -- the instantaneous rate of change. Then we started over, asking about area, and built the integral as a limit of Riemann sums.",
      "Two completely separate ideas. Differentiation and integration. Rates and areas. They seemed unrelated.",
      "They are not unrelated. They are inverses of each other. The Fundamental Theorem of Calculus says this, and it is one of the most stunning facts in all of mathematics.",
      "Newton and Leibniz discovered it independently, in the 1600s, and it changed everything. It meant that to compute an integral -- a thing defined as an infinite sum of infinitely thin rectangles -- you just need to find an antiderivative. No rectangles required.",
      "Take a moment with this. You have been learning calculus. You now understand its heart.",
    ],
  },
  sections: [
    {
      id: 'ftc1',
      title: 'Part 1: The Accumulation Function',
      content: [
        {
          type: 'text',
          body: 'Define the accumulation function F(x) as the integral of f from a fixed point a up to x:',
        },
        {
          type: 'math',
          body: 'F(x) = \\int_a^x f(t)\\,dt',
        },
        {
          type: 'text',
          body: 'Part 1 of FTC says: if f is continuous on [a, b], then F is differentiable and F\'(x) = f(x).',
        },
        {
          type: 'insight',
          body: 'In words: the derivative of an accumulation function is the integrand. The rate at which the accumulated area grows equals the height of f at that point. This is profoundly logical once you see it.',
        },
        {
          type: 'graph',
          graphType: 'ftc',
          curve: 'sine',
          config: { a: -3.14, xDomain: [-3.2, 3.3], initialX: 0 },
          caption: 'Left: f(x) = sin(x). Right: F(x) = ∫f(t)dt. The slope of F equals f. Move the upper limit to see the connection.',
        },
      ],
    },
    {
      id: 'ftc2',
      title: 'Part 2: Evaluating Definite Integrals',
      content: [
        {
          type: 'text',
          body: 'Part 2 is the one you will use most often. It says: to evaluate a definite integral, find any antiderivative F, and compute F(b) - F(a).',
        },
        {
          type: 'math',
          body: '\\int_a^b f(x)\\,dx = F(b) - F(a) \\quad \\text{where } F\' = f',
        },
        {
          type: 'text',
          body: 'Example: ∫₀² x² dx. Antiderivative: x³/3. Evaluate: (2³/3) - (0³/3) = 8/3 - 0 = 8/3.',
        },
        {
          type: 'insight',
          body: 'No rectangles. No sums. No limits (explicitly). Just find the antiderivative and plug in the bounds. That is the power the FTC gave us. It reduced an infinite process to an algebraic one.',
        },
      ],
    },
    {
      id: 'substitution',
      title: 'U-Substitution: The Chain Rule in Reverse',
      content: [
        {
          type: 'text',
          body: 'The chain rule told us how to differentiate composite functions. U-substitution undoes that -- it lets us integrate composite functions:',
        },
        {
          type: 'math',
          body: '\\int f(g(x)) \\cdot g\'(x)\\,dx = \\int f(u)\\,du \\quad \\text{where } u = g(x)',
        },
        {
          type: 'text',
          body: 'Example: ∫2x·cos(x²) dx. Let u = x², then du = 2x dx. Substituting: ∫cos(u) du = sin(u) + C = sin(x²) + C.',
        },
        {
          type: 'insight',
          body: 'The test for u-substitution: can you identify a function u(x) inside the integrand, and spot its derivative du/dx also sitting there? If yes, you can substitute.',
        },
      ],
    },
    {
      id: 'closing',
      title: 'The View From Here',
      content: [
        {
          type: 'text',
          body: 'You have now learned all the foundational ideas of Calculus I:',
        },
        {
          type: 'text',
          body: '• Functions and rates of change\n• Limits: the engine underneath everything\n• Continuity: no surprises\n• The derivative: instantaneous rate of change\n• Differentiation rules: power, product, quotient, chain\n• Applications: optimization, curve analysis\n• The integral: accumulation and area\n• The Fundamental Theorem: the grand connection',
        },
        {
          type: 'insight',
          body: 'Calculus II is waiting. Techniques of integration, sequences and series, more applications. But you now have the foundation. Everything that comes next is built on what you have learned here.',
        },
        {
          type: 'playground',
          playgroundType: 'antiderivativeSandbox',
          caption: 'Move the lower limit a to see +C in action. Move x to watch F(x) accumulate.',
        },
      ],
    },
  ],
  quiz: {
    id: 'chapter_8_quiz',
    questions: [
      {
        id: 'q1',
        question: 'What does the Fundamental Theorem of Calculus (Part 2) let you do?',
        options: [
          'Find the derivative of a limit',
          'Evaluate a definite integral using an antiderivative',
          'Prove a function is continuous',
          'Compute Riemann sums faster',
        ],
        correct: 1,
        explanation: 'FTC Part 2 says ∫ₐᵇ f(x) dx = F(b) - F(a) where F\' = f. This reduces the problem of computing an integral (an infinite process) to evaluating an antiderivative at two points.',
      },
      {
        id: 'q2',
        question: 'What is ∫₁³ 3x² dx?',
        options: ['6x', '26', '27 - 1 = 26', 'x³'],
        correct: 1,
        explanation: 'Antiderivative of 3x² is x³. Evaluate: F(3) - F(1) = 27 - 1 = 26.',
      },
      {
        id: 'q3',
        question: 'To integrate ∫3x²·sin(x³) dx using u-substitution, the best choice of u is:',
        options: ['u = sin(x)', 'u = x²', 'u = x³', 'u = 3x²'],
        correct: 2,
        explanation: 'Let u = x³. Then du = 3x² dx. The integral becomes ∫sin(u) du = -cos(u) + C = -cos(x³) + C. The 3x² was the derivative of x³ sitting right there -- the substitution collapses the integral.',
      },
      {
        id: 'q4',
        question: 'FTC Part 1 says: if F(x) = ∫₀ˣ f(t) dt, then F\'(x) equals:',
        options: ['F(x)', '∫₀ˣ f\'(t) dt', 'f(x)', 'f(0)'],
        correct: 2,
        explanation: 'The derivative of the accumulation function is the integrand evaluated at the upper limit: F\'(x) = f(x). The rate at which area accumulates equals the height of f at that point.',
      },
    ],
  },
}
