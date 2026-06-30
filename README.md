# Calculus I — A Bottom-Up Journey

An interactive, narrative-driven Calculus I course built as a single-page web app. Instead of starting with formal definitions, each chapter builds intuition first: you feel the need for an idea before you learn its name.

> *A love letter from an older math nerd to a younger one.*

## What this is

Most calculus courses hand you the machinery before you understand the problem it solves. This course does the opposite. You start with functions and slopes, wrestle with limits because you need them, and only then meet derivatives, integrals, and the Fundamental Theorem of Calculus as satisfying answers to questions you have already been asking.

Each chapter includes:

- **Narrator letters** — conversational framing for why the next idea matters
- **Interactive graphs** — D3-powered visualizations you can explore
- **Playgrounds** — sandboxes for secant lines, limits, continuity, derivatives, Riemann sums, and more
- **Mini-games** — quick practice (Slope Sniper, Limit Hunter, Area Estimator)
- **Quizzes** — unlock the next chapter when you pass

Progress is saved in your browser (`localStorage`), so you can leave and come back without losing your place.

## The path

| # | Chapter | Topic |
|---|---------|-------|
| 1 | The Language of Change | Functions, slopes, and why things move |
| 2 | The Art of Getting Close | Limits |
| 3 | When Things Don't Break | Continuity |
| 4 | The Speedometer of Math | The derivative |
| 5 | Rules of the Road | Differentiation techniques |
| 6 | What Derivatives Tell Us | Applications and optimization |
| 7 | Counting Rectangles Forever | The integral |
| 8 | The Grand Reunion | The Fundamental Theorem of Calculus |

Chapters unlock sequentially. Start with the Prologue — it sets the tone for the whole course.

## Getting started

**Requirements:** Node.js 18+ and npm

```bash
# Clone the repo
git clone https://github.com/GTKottman/BottomsUpCalculus.git
cd BottomsUpCalculus

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Other commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |

## Tech stack

- [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- [React Router](https://reactrouter.com/) for navigation
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- [KaTeX](https://katex.org/) / [react-katex](https://github.com/talyssonoc/react-katex) for math rendering
- [D3](https://d3js.org/) for interactive graphs
- [Framer Motion](https://www.framer.com/motion/) for animations

## Project structure

```
src/
├── pages/              # Home, Prologue, Chapter, NotFound
├── components/
│   ├── InteractiveGraph/   # D3 graph components
│   ├── Playground/         # Interactive sandboxes
│   ├── MiniGame/           # Practice games
│   ├── Quiz/               # Chapter quizzes
│   ├── ProgressMap/        # Journey map on the home page
│   └── NarratorLetter/     # Letter-style content blocks
├── data/chapters/      # Chapter metadata and content (chapter1.js … chapter8.js)
├── hooks/useProgress.js    # localStorage progress tracking
└── utils/math.js       # Shared math helpers
```

Chapter content lives in `src/data/chapters/`. Each file exports sections (text, math, graphs, insights), playground and mini-game references, and quiz questions. `index.js` holds chapter metadata; `all.js` aggregates full chapter data.

## Progress

Progress is stored under the key `calc1_progress` in `localStorage`. Completing a chapter's quiz marks it done and unlocks the next one. Use **Reset all progress** on the home page to start over.

---

Built with care for anyone who wants to actually *understand* calculus, not just memorize it.
