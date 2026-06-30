export default {
  id: 'chapter_2',
  number: 2,
  title: 'The Art of Getting Close',
  subtitle: 'Limits',
  narratorLetter: {
    date: 'A rainy Friday, around 2am',
    body: [
      "Here is the most important idea in all of calculus. Not derivatives. Not integrals. Limits.",
      "Everything -- and I mean everything -- in calculus is secretly a limit. The derivative is a limit. The integral is a limit. The whole machine runs on this one idea.",
      "So what is a limit? It's surprisingly simple once you see it right. A limit asks: what value does f(x) approach as x sneaks up on some number a -- without actually touching a?",
      "Notice: we are not asking what f(a) equals. We are asking what f(x) is heading toward. Those are different questions, and that difference turns out to matter enormously.",
      "Alright. Let's hunt some limits.",
    ],
  },
  sections: [
    {
      id: 'intuition',
      title: 'The Intuition: Sneaking Up on a Value',
      content: [
        {
          type: 'text',
          body: 'Imagine walking along the curve f(x) = x². You\'re at x = 1.5. You take a step toward x = 2. You\'re at 1.8. Then 1.9. Then 1.99. Then 1.999. Where is f(x) heading? It\'s heading to f(2) = 4. The limit is 4.',
        },
        {
          type: 'text',
          body: 'For most "nice" functions, the limit as x → a is just f(a). But the limit becomes interesting when f(a) is undefined, or when the function does something strange at x = a.',
        },
        {
          type: 'graph',
          graphType: 'limit',
          curve: 'parabola',
          config: { xDomain: [0, 3.5], yDomain: [-0.5, 5], targetX: 2, approachFrom: 1.3 },
          caption: 'Drag the slider toward x = 2. Watch f(x) approach the limit even as you never quite arrive.',
        },
        {
          type: 'insight',
          body: 'The green dot sneaks toward x = 2 from the left. The orange dashed line shows where the function is headed. This is the limit in action.',
        },
      ],
    },
    {
      id: 'notation',
      title: 'Notation and the Formal Idea',
      content: [
        {
          type: 'text',
          body: 'We write limits like this:',
        },
        {
          type: 'math',
          body: '\\lim_{x \\to a} f(x) = L',
        },
        {
          type: 'text',
          body: 'Read it as: "the limit of f(x) as x approaches a equals L." It means: as x gets arbitrarily close to a (from either side), f(x) gets arbitrarily close to L.',
        },
        {
          type: 'text',
          body: 'One-sided limits let us approach from only one direction:',
        },
        {
          type: 'math',
          body: '\\lim_{x \\to a^-} f(x) = L_1 \\qquad \\lim_{x \\to a^+} f(x) = L_2',
        },
        {
          type: 'insight',
          body: 'The two-sided limit exists only when both one-sided limits exist AND are equal. If the function approaches different values from the left and right, the limit does not exist.',
        },
      ],
    },
    {
      id: 'limit_laws',
      title: 'Limit Laws: Arithmetic Still Works',
      content: [
        {
          type: 'text',
          body: 'Good news: limits play nicely with arithmetic. If both lim f(x) and lim g(x) exist as x→a, then:',
        },
        {
          type: 'math',
          body: '\\lim_{x \\to a}[f(x) + g(x)] = \\lim_{x \\to a}f(x) + \\lim_{x \\to a}g(x)',
        },
        {
          type: 'math',
          body: '\\lim_{x \\to a}[f(x) \\cdot g(x)] = \\lim_{x \\to a}f(x) \\cdot \\lim_{x \\to a}g(x)',
        },
        {
          type: 'text',
          body: 'These laws mean that for polynomials and most familiar functions, you can often just plug in -- direct substitution. The limit is just the function value.',
        },
        {
          type: 'insight',
          body: 'Limits become genuinely interesting for forms like 0/0 or ∞/∞. These "indeterminate forms" require more work -- and they\'re exactly what shows up in the definition of the derivative.',
        },
      ],
    },
    {
      id: 'game',
      title: 'Limit Hunter',
      content: [
        {
          type: 'minigame',
          gameType: 'limitHunter',
          caption: 'Hunt the limit from both sides. See if they agree.',
        },
        {
          type: 'playground',
          playgroundType: 'limitTableSandbox',
          caption: 'Read the numbers. Watch convergence -- or divergence -- emerge row by row.',
        },
      ],
    },
  ],
  quiz: {
    id: 'chapter_2_quiz',
    questions: [
      {
        id: 'q1',
        question: 'What does lim(x→3) of (x² - 9)/(x - 3) equal?',
        options: ['0', '3', '6', 'Does not exist'],
        correct: 2,
        explanation: 'Factor: (x² - 9)/(x - 3) = (x+3)(x-3)/(x-3) = x+3 (for x ≠ 3). As x → 3, this approaches 3 + 3 = 6. This is a classic 0/0 indeterminate form that resolves by cancellation.',
      },
      {
        id: 'q2',
        question: 'The limit lim(x→0) of |x|/x:',
        options: ['Equals 0', 'Equals 1', 'Equals -1', 'Does not exist'],
        correct: 3,
        explanation: 'From the right (x > 0): |x|/x = x/x = 1. From the left (x < 0): |x|/x = -x/x = -1. The left and right limits disagree, so the two-sided limit does not exist.',
      },
      {
        id: 'q3',
        question: 'If lim(x→2) f(x) = 5 and lim(x→2) g(x) = 3, what is lim(x→2) [f(x)·g(x)]?',
        options: ['8', '15', '2', 'Cannot be determined'],
        correct: 1,
        explanation: 'By the product limit law: lim[f·g] = lim(f) · lim(g) = 5 · 3 = 15. Limit laws let us break apart complex expressions.',
      },
      {
        id: 'q4',
        question: 'The key difference between lim(x→a) f(x) and f(a) is:',
        options: [
          'They are always equal',
          'The limit asks where f is heading, f(a) is the actual value',
          'The limit is always larger',
          'f(a) requires calculus to compute',
        ],
        correct: 1,
        explanation: 'The limit describes behavior near a, not at a. f(a) might not even be defined! A function can have a perfectly good limit at a point where it has a hole or is undefined.',
      },
    ],
  },
}
