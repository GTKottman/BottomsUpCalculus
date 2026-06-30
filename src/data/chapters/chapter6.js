export default {
  id: 'chapter_6',
  number: 6,
  title: 'What Derivatives Tell Us',
  subtitle: 'Applications and Optimization',
  narratorLetter: {
    date: 'A bright morning',
    body: [
      "Now that you can compute derivatives, let us talk about what they actually say about a function.",
      "A derivative tells you slope. But slope tells you direction. Direction tells you shape. And shape tells you where the highs and lows are.",
      "This chapter is about reading a function like a topographic map. Where are the peaks? Where are the valleys? Where is the function climbing fastest? These are not abstract questions -- they are the questions that engineers, economists, and scientists care about every single day.",
      "The derivative is not just a formula you compute. It is a lens that reveals the geometry of the world.",
    ],
  },
  sections: [
    {
      id: 'increasing_decreasing',
      title: 'Increasing, Decreasing, and the Sign of f\'',
      content: [
        {
          type: 'text',
          body: 'The sign of the derivative tells you which way the function is moving:',
        },
        {
          type: 'math',
          body: "f'(x) > 0 \\implies f \\text{ is increasing} \\qquad f'(x) < 0 \\implies f \\text{ is decreasing}",
        },
        {
          type: 'graph',
          graphType: 'derivative',
          curve: 'cubic',
          config: { xDomain: [-2.2, 2.2], yDomain: [-3, 3], initialX: 0.5 },
          caption: 'f(x) = x³ - 3x. Drag along it -- watch the slope change sign twice.',
        },
        {
          type: 'insight',
          body: 'The function x³ - 3x has f\'(x) = 3x² - 3. Setting f\'(x) = 0: 3x² = 3, so x = ±1. These are the critical points -- places where the tangent is horizontal. Between them, the function decreases.',
        },
      ],
    },
    {
      id: 'critical_points',
      title: 'Critical Points and Local Extrema',
      content: [
        {
          type: 'text',
          body: 'A critical point is where f\'(x) = 0 or f\'(x) is undefined. At a critical point, the function might have a local maximum, local minimum, or neither.',
        },
        {
          type: 'math',
          body: "\\text{First Derivative Test: if } f'(x) \\text{ changes } + \\to - \\text{ at } c \\Rightarrow \\text{local max}",
        },
        {
          type: 'math',
          body: "\\text{If } f'(x) \\text{ changes } - \\to + \\text{ at } c \\Rightarrow \\text{local min}",
        },
        {
          type: 'text',
          body: 'The second derivative test is often faster: if f\'(c) = 0 and f\'\'(c) > 0, you have a local minimum (concave up). If f\'\'(c) < 0, local maximum (concave down).',
        },
      ],
    },
    {
      id: 'optimization',
      title: 'Optimization: Finding the Best',
      content: [
        {
          type: 'text',
          body: 'Optimization is finding the global maximum or minimum of a function over some domain. The strategy: find all critical points, check the endpoints, compare all values.',
        },
        {
          type: 'insight',
          body: 'Classic example: a farmer has 200m of fence and wants to enclose a rectangular area, one side against a barn (no fence needed there). Maximize area. Set up A = x·y with constraint 2x + y = 200. Substitute, differentiate, find critical point. This is the template for every optimization problem.',
        },
        {
          type: 'text',
          body: 'The global maximum of a continuous function on a closed interval [a,b] occurs either at a critical point inside the interval, or at one of the endpoints. Check all three types.',
        },
      ],
    },
    {
      id: 'lhopital',
      title: "L'Hopital's Rule",
      content: [
        {
          type: 'text',
          body: 'A powerful shortcut for limits of indeterminate forms 0/0 or ∞/∞:',
        },
        {
          type: 'math',
          body: "\\text{If } \\lim_{x\\to a}\\frac{f(x)}{g(x)} = \\frac{0}{0} \\text{ or } \\frac{\\infty}{\\infty}, \\text{ then } \\lim_{x\\to a}\\frac{f(x)}{g(x)} = \\lim_{x\\to a}\\frac{f'(x)}{g'(x)}",
        },
        {
          type: 'insight',
          body: 'L\'Hopital\'s rule says: when a limit gives an indeterminate form, differentiate the numerator and denominator separately (NOT the quotient -- separately), and try again. Repeat if needed.',
        },
        {
          type: 'playground',
          playgroundType: 'optimizationExplorer',
          caption: 'Drag the cursor to find where f\u2019 = 0. Critical points are auto-detected and labeled.',
        },
      ],
    },
  ],
  quiz: {
    id: 'chapter_6_quiz',
    questions: [
      {
        id: 'q1',
        question: 'f(x) = x³ - 12x. Where are the local extrema?',
        options: [
          'x = 0 only',
          'x = 2 (local min) and x = -2 (local max)',
          'x = 2 (local max) and x = -2 (local min)',
          'No local extrema',
        ],
        correct: 1,
        explanation: 'f\'(x) = 3x² - 12. Set to 0: x² = 4, x = ±2. f\'\'(x) = 6x. At x = 2: f\'\'(2) = 12 > 0, local min. At x = -2: f\'\'(-2) = -12 < 0, local max.',
      },
      {
        id: 'q2',
        question: 'What is lim(x→0) sin(x)/x using L\'Hopital?',
        options: ['0', '1', '∞', 'Does not exist'],
        correct: 1,
        explanation: 'Form 0/0 at x = 0. Differentiate top and bottom: d/dx(sin x) = cos x, d/dx(x) = 1. New limit: lim(x→0) cos(x)/1 = cos(0) = 1.',
      },
      {
        id: 'q3',
        question: 'If f\'(x) > 0 on (1, 5), then f is:',
        options: ['Decreasing on (1, 5)', 'Increasing on (1, 5)', 'Constant on (1, 5)', 'Concave up on (1, 5)'],
        correct: 1,
        explanation: 'Positive derivative means the function is going uphill -- increasing. f\'(x) > 0 means the slope is positive, which means the function rises as x increases.',
      },
    ],
  },
}
