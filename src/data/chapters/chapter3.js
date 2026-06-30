export default {
  id: 'chapter_3',
  number: 3,
  title: "When Things Don't Break",
  subtitle: 'Continuity',
  narratorLetter: {
    date: 'Saturday morning, first coffee',
    body: [
      "You have seen limits. Good. Now we use them to define one of the most useful ideas in all of analysis: continuity.",
      "A continuous function is one with no surprises. No jumps. No holes. No sudden teleportations to a different value. If you were drawing it with a pen, you would never need to lift the pen off the paper.",
      "That is the intuition. The formal definition -- which you will see in a moment -- is just limits in a trench coat. It says: f is continuous at a if the limit of f(x) as x approaches a actually equals f(a).",
      "Seems obvious? It is obvious -- for most functions you will ever encounter. But the exceptions are where calculus gets honest. And understanding continuity precisely is what lets us prove the big theorems that make the subject work.",
    ],
  },
  sections: [
    {
      id: 'definition',
      title: 'The Definition of Continuity',
      content: [
        {
          type: 'text',
          body: 'A function f is continuous at a point x = a if three conditions hold simultaneously:',
        },
        {
          type: 'text',
          body: '1. f(a) is defined (the function exists at a).\n2. lim(x→a) f(x) exists (the limit exists from both sides).\n3. lim(x→a) f(x) = f(a) (the limit equals the actual value).',
        },
        {
          type: 'math',
          body: 'f \\text{ is continuous at } a \\iff \\lim_{x \\to a} f(x) = f(a)',
        },
        {
          type: 'insight',
          body: 'All three conditions must hold. A function can fail condition 1 (hole), condition 2 (jump), or condition 3 (the value doesn\'t match the limit). Each gives a different type of discontinuity.',
        },
      ],
    },
    {
      id: 'types',
      title: 'Types of Discontinuity',
      content: [
        {
          type: 'text',
          body: 'There are three main ways a function can fail to be continuous at a point:',
        },
        {
          type: 'text',
          body: 'Removable (hole): lim(x→a) f(x) exists, but either f(a) is undefined or f(a) ≠ the limit. The function has a hole that could be "patched."',
        },
        {
          type: 'text',
          body: 'Jump: the left and right limits both exist but are unequal. The function leaps from one value to another.',
        },
        {
          type: 'text',
          body: 'Infinite: f(x) → ±∞ as x → a. The function blows up at a vertical asymptote.',
        },
        {
          type: 'graph',
          graphType: 'basic',
          curve: 'reciprocal',
          config: { xDomain: [-3, 3], yDomain: [-5, 5] },
          caption: 'f(x) = 1/x. Infinite discontinuity at x = 0. The function blows up.',
        },
      ],
    },
    {
      id: 'ivt',
      title: 'The Intermediate Value Theorem',
      content: [
        {
          type: 'text',
          body: 'Here is the first big theorem continuity earns us. It seems obvious, but it is enormously powerful.',
        },
        {
          type: 'math',
          body: '\\text{If } f \\text{ is continuous on } [a, b] \\text{ and } f(a) < N < f(b), \\text{ then } \\exists c \\in (a,b): f(c) = N',
        },
        {
          type: 'text',
          body: 'In plain English: if a continuous function starts below a value and ends above it, it must cross that value somewhere in between. It cannot jump over it, because it has no jumps.',
        },
        {
          type: 'insight',
          body: 'Classic application: f(x) = x³ - x - 1. Notice f(1) = -1 < 0 and f(2) = 5 > 0. By IVT, there must be a root between 1 and 2. We have proved the root exists without ever finding it. That is a pure existence proof.',
        },
        {
          type: 'playground',
          playgroundType: 'continuitySculptor',
          caption: 'Three sliders, one breakpoint. Arrange them to achieve continuity -- or break it deliberately.',
        },
      ],
    },
  ],
  quiz: {
    id: 'chapter_3_quiz',
    questions: [
      {
        id: 'q1',
        question: 'Which condition is NOT part of the definition of continuity at x = a?',
        options: [
          'f(a) is defined',
          'lim(x→a) f(x) exists',
          'lim(x→a) f(x) = f(a)',
          'f is differentiable at a',
        ],
        correct: 3,
        explanation: 'Differentiability is a stronger condition than continuity -- it comes later. Continuity only requires: (1) f(a) defined, (2) limit exists, (3) they\'re equal. A function can be continuous without being differentiable.',
      },
      {
        id: 'q2',
        question: 'f(x) = (x² - 4)/(x - 2) has what type of discontinuity at x = 2?',
        options: ['Jump discontinuity', 'Infinite discontinuity', 'Removable discontinuity', 'It is continuous at x = 2'],
        correct: 2,
        explanation: '(x² - 4)/(x - 2) = (x+2)(x-2)/(x-2) = x + 2 for x ≠ 2. The limit as x → 2 is 4, but f(2) is undefined (0/0). This is a removable discontinuity -- a single hole that could be filled by defining f(2) = 4.',
      },
      {
        id: 'q3',
        question: 'The IVT guarantees a root of f(x) = x⁵ - 3x + 1 on which interval?',
        options: ['[0, 1]', '[1, 2]', '[-2, -1]', 'All of the above'],
        correct: 3,
        explanation: 'Check: f(0) = 1 > 0, f(1) = -1 < 0 (sign change on [0,1]). f(1) = -1 < 0, f(2) = 27 > 0 (sign change on [1,2]). f(-2) = -29 < 0, f(-1) = 3 > 0 (sign change on [-2,-1]). All three intervals contain roots by IVT.',
      },
    ],
  },
}
