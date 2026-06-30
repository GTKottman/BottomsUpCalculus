export default {
  id: 'chapter_1',
  number: 1,
  title: 'The Language of Change',
  subtitle: 'Functions, slopes, and why things move',
  narratorLetter: {
    date: 'A Tuesday, probably after midnight',
    body: [
      "Let's start with something you already know: a function.",
      "A function is just a machine. You put a number in, you get a number out. That's all. f(x) = x² means: whatever you hand me, I'll square it and hand it back. Nothing magical about that.",
      "But here's what nobody says clearly enough: calculus is the study of how functions change. Not what they equal at a point. How they're moving. How fast. In what direction.",
      "Before we can talk about that, we need to talk about slopes -- because slope is the first, clumsy way we measure change. And before derivatives, before limits, before any of the good stuff -- there is slope.",
      "Bear with me. We're building the foundation.",
    ],
  },
  sections: [
    {
      id: 'functions',
      title: 'Functions: Machines That Transform Numbers',
      content: [
        {
          type: 'text',
          body: 'A function f takes an input x and produces exactly one output f(x). The key word is "exactly one" -- for every input, there is precisely one output. That is what makes something a function.',
        },
        {
          type: 'math',
          body: 'f(x) = x^2 \\qquad g(x) = 2x + 1 \\qquad h(x) = \\sin(x)',
        },
        {
          type: 'text',
          body: 'Think of the graph of a function as the function\'s portrait -- it shows you, all at once, what the machine does to every input. Tall means big output. Flat means small change.',
        },
        {
          type: 'graph',
          graphType: 'basic',
          curve: 'parabola',
          config: { xDomain: [-2.5, 2.5], yDomain: [-0.5, 7] },
          caption: 'The parabola f(x) = x². Symmetric, always non-negative, and bowl-shaped.',
        },
        {
          type: 'insight',
          body: 'Notice the bowl shape. Near x = 0, the function barely changes. Far from 0, it shoots up fast. The function is "changing at different rates" in different places. That observation -- that the rate of change itself varies -- is the seed of differential calculus.',
        },
      ],
    },
    {
      id: 'slopes',
      title: 'Slope: The First Measure of Change',
      content: [
        {
          type: 'text',
          body: 'Between two points on a curve, we can draw a straight line -- called a secant line -- and measure its slope. Slope measures rise over run: how much does the output change per unit of input?',
        },
        {
          type: 'math',
          body: '\\text{slope} = \\frac{\\Delta y}{\\Delta x} = \\frac{f(x_2) - f(x_1)}{x_2 - x_1}',
        },
        {
          type: 'text',
          body: 'This is the average rate of change of f between x₁ and x₂. If you drive 60 miles in 1 hour, your average speed is 60 mph -- that\'s the slope of the distance function over that interval.',
        },
        {
          type: 'insight',
          body: 'The problem with average rate of change: it tells you what happened over an interval, not what\'s happening at a single instant. If you slam the brakes at mile 30, your average speed is still 60 mph. We need something better. We need the instantaneous rate of change.',
        },
        {
          type: 'text',
          body: 'Spoiler: the instantaneous rate of change is exactly what the derivative is. But we can\'t define it yet -- we need limits first. For now, feel the question. It\'s the right question.',
        },
      ],
    },
    {
      id: 'rates',
      title: 'Rates of Change in the Real World',
      content: [
        {
          type: 'text',
          body: 'Rates of change are everywhere. Your car\'s speedometer shows instantaneous rate of change of position. A fever chart shows rate of change of temperature. The slope of a stock chart is rate of change of price.',
        },
        {
          type: 'insight',
          body: 'Every quantity that moves through time (or depends on something that changes) has a rate of change. Calculus is the tool that lets us compute and reason about those rates precisely.',
        },
        {
          type: 'text',
          body: 'Before we get to the precise definition of instantaneous rate of change, we need to ask: what does it mean to approach a value without reaching it? That question is the subject of our next chapter.',
        },
        {
          type: 'playground',
          playgroundType: 'secantSandbox',
          caption: 'Drag x₁ and x₂ toward each other. Watch the secant slope evolve into something sharper.',
        },
      ],
    },
  ],
  quiz: {
    id: 'chapter_1_quiz',
    questions: [
      {
        id: 'q1',
        question: 'If f(x) = x², what is the average rate of change of f between x = 1 and x = 3?',
        options: ['2', '4', '6', '8'],
        correct: 1,
        explanation: 'Average rate of change = (f(3) - f(1)) / (3 - 1) = (9 - 1) / 2 = 8/2 = 4. You computed the slope of the secant line joining those two points.',
      },
      {
        id: 'q2',
        question: 'Which of these is NOT a function?',
        options: [
          'f(x) = x²',
          'g(x) = √x for x ≥ 0',
          'The relation where x = y²',
          'h(x) = |x|',
        ],
        correct: 2,
        explanation: 'x = y² means for x = 4, both y = 2 and y = -2 work. That gives two outputs for one input, violating the definition of a function. The others each give exactly one output per input.',
      },
      {
        id: 'q3',
        question: 'A car travels 120 miles in 2 hours. What does the slope of its distance-time graph represent over that interval?',
        options: [
          'The car\'s instantaneous speed at t = 1',
          'The car\'s average speed: 60 mph',
          'The total distance traveled',
          'The acceleration of the car',
        ],
        correct: 1,
        explanation: 'Slope = rise/run = 120 miles / 2 hours = 60 mph. This is the average rate of change of position over the interval -- average speed.',
      },
      {
        id: 'q4',
        question: 'The key limitation of "average rate of change" is that it:',
        options: [
          'Is too hard to compute',
          'Only works for straight lines',
          'Tells you what happened over an interval, not at a single instant',
          'Requires calculus to define',
        ],
        correct: 2,
        explanation: 'Exactly. Average rate of change smooths over everything that happened between two points. If we want to know exactly how fast something is changing at one specific moment, we need something sharper -- which is what the derivative provides.',
      },
    ],
  },
}
