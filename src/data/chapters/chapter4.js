export default {
  id: 'chapter_4',
  number: 4,
  title: 'The Speedometer of Math',
  subtitle: 'The Derivative',
  narratorLetter: {
    date: 'A long Sunday afternoon',
    body: [
      "Here it is. This is the thing.",
      "We have been building toward this for three chapters. Functions, slopes, limits, continuity -- all of it was scaffolding. Now we remove the scaffolding and see the building.",
      "The derivative answers the question: what is the instantaneous rate of change of f at x?",
      "Remember the problem from Chapter 1? Average rate of change tells you what happened over an interval. But we wanted the rate at a single point -- the speedometer reading at exactly t = 2.3 seconds, not the average from t = 2 to t = 3.",
      "The answer is breathtaking in its simplicity: take the average rate of change, and then take the limit as the interval shrinks to nothing.",
      "That's it. That's the derivative.",
    ],
  },
  sections: [
    {
      id: 'definition',
      title: 'The Limit Definition',
      content: [
        {
          type: 'text',
          body: 'We want the slope of the curve at a single point. Start with the slope of a secant line between x and x + h. Then take the limit as h → 0:',
        },
        {
          type: 'math',
          body: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
        },
        {
          type: 'text',
          body: 'This is the derivative. We\'re computing the slope of tinier and tinier secant lines until they become the tangent line -- the line that touches the curve at exactly one point with the exact slope of the curve there.',
        },
        {
          type: 'insight',
          body: 'Notice: the numerator f(x+h) - f(x) → 0 as h → 0, and the denominator h → 0 too. This is the 0/0 indeterminate form from Chapter 2. The derivative is literally the resolution of that form.',
        },
      ],
    },
    {
      id: 'tangent',
      title: 'The Tangent Line Explorer',
      content: [
        {
          type: 'text',
          body: 'The derivative at a point is the slope of the tangent line at that point. Drag the slider to move the point along the parabola and watch the tangent line rotate.',
        },
        {
          type: 'graph',
          graphType: 'derivative',
          curve: 'parabola',
          config: { xDomain: [-2.5, 2.5], yDomain: [-0.5, 6.5], initialX: 1 },
          caption: 'The pink line is the tangent at the current point. Its slope is f\'(x).',
        },
        {
          type: 'insight',
          body: 'For f(x) = x², the tangent at x = 1 has slope 2. At x = 2, slope 4. At x = -1, slope -2. The pattern? f\'(x) = 2x. The derivative of x² is 2x.',
        },
      ],
    },
    {
      id: 'example',
      title: 'Computing the Derivative of x²',
      content: [
        {
          type: 'text',
          body: 'Let\'s use the limit definition directly for f(x) = x²:',
        },
        {
          type: 'math',
          body: "f'(x) = \\lim_{h \\to 0} \\frac{(x+h)^2 - x^2}{h}",
        },
        {
          type: 'math',
          body: "= \\lim_{h \\to 0} \\frac{x^2 + 2xh + h^2 - x^2}{h} = \\lim_{h \\to 0} \\frac{2xh + h^2}{h}",
        },
        {
          type: 'math',
          body: "= \\lim_{h \\to 0} (2x + h) = 2x",
        },
        {
          type: 'text',
          body: 'So f\'(x) = 2x. At x = 3, the slope is 6. At x = 0, the slope is 0 (the flat bottom of the bowl). At x = -2, the slope is -4 (going downhill).',
        },
        {
          type: 'insight',
          body: 'Every time we move to a new function, we could grind through this limit. But that\'s tedious. In Chapter 5, we derive the rules that let us skip the grind -- after understanding why the rules work.',
        },
      ],
    },
    {
      id: 'game',
      title: 'Slope Sniper',
      content: [
        {
          type: 'minigame',
          gameType: 'slopeSniper',
          caption: 'Estimate the slope of the tangent line. How close can you get?',
        },
        {
          type: 'playground',
          playgroundType: 'derivativePairing',
          caption: 'Drag the cursor. Watch f and f\u2019 move in lockstep -- every slope above appears as a height below.',
        },
      ],
    },
  ],
  quiz: {
    id: 'chapter_4_quiz',
    questions: [
      {
        id: 'q1',
        question: 'Using the limit definition, what is the derivative of f(x) = 3x + 5?',
        options: ['3', '5', '3x', '8'],
        correct: 0,
        explanation: 'f\'(x) = lim(h→0) [(3(x+h)+5 - (3x+5)]/h = lim(h→0) [3h/h] = lim(h→0) 3 = 3. The derivative of any linear function is just its slope -- the constant multiplier of x.',
      },
      {
        id: 'q2',
        question: 'Geometrically, f\'(a) equals:',
        options: [
          'The y-value of f at a',
          'The area under f at a',
          'The slope of the tangent line to f at (a, f(a))',
          'The average rate of change of f',
        ],
        correct: 2,
        explanation: 'The derivative f\'(a) is exactly the slope of the tangent line at the point (a, f(a)). This is the geometric meaning of the derivative.',
      },
      {
        id: 'q3',
        question: 'If f\'(a) = 0, what does this tell us about the graph of f at x = a?',
        options: [
          'f(a) = 0',
          'The tangent line is horizontal at x = a',
          'f is discontinuous at a',
          'f is at a minimum at a',
        ],
        correct: 1,
        explanation: 'f\'(a) = 0 means the slope of the tangent line is 0 -- horizontal. This could indicate a local max, local min, or neither (like an inflection point). We need more info to decide which.',
      },
      {
        id: 'q4',
        question: 'Why does the derivative use a limit rather than just computing (f(x+h) - f(x))/h for a small h?',
        options: [
          'Limits are easier to compute',
          'Any finite h gives an approximation; only the limit gives the exact instantaneous rate',
          'h must be a whole number',
          'Limits give a different value than small h',
        ],
        correct: 1,
        explanation: 'For any fixed h > 0, no matter how tiny, we\'re computing an average rate over an interval. Only by taking h → 0 do we compress that interval to a point and get the truly instantaneous rate. The limit is what makes it exact.',
      },
    ],
  },
}
