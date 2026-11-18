# SAC LEARN — Algorithmic Thinking with Python (KTU UCEST105)

An interactive student-assist web app for the KTU B.Tech 2024 course **UCEST105 · Algorithmic Thinking with Python**, built from the official syllabus and module notes.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · framer-motion · lucide-react · Monaco Editor · Pyodide (Python running in WebAssembly)

---

## Run it

You need **Node.js 20 or newer** (https://nodejs.org).

```bash
cd atp-studio
npm install
npm run dev        # open the printed URL, usually http://localhost:5173
```

To make a production build (a static site you can host anywhere):

```bash
npm run build      # outputs to dist/
npm run preview    # check the built site locally
```

`dist/` can be deployed as-is to **Netlify, Vercel, GitHub Pages, Cloudflare Pages** or any static host (it uses hash routing and relative paths, so it works from any folder).

> The Python compiler (Pyodide) and the code editor (Monaco) load from the jsDelivr CDN, so you need an internet connection the first time you open them. After that the browser caches them.

---

## What's inside

| Area | Route | What it does |
|---|---|---|
| Module Explorer | `#/` | All 4 modules → 13 syllabus headings → every subtopic, with progress |
| Topic workspace | `#/topic/<id>` | **Study Notes** (tables, flow infographics, comparison cards, pseudocode, runnable code), **Animate** (algorithm visualizers), **Practice** (flip cards + topic quiz) and a **Try it Yourself** compiler drawer |
| Slide decks | `#/slides/1..4` | Keyboard-navigable (← → Space, F = fullscreen, Esc = exit) |
| Mind map | `#/mindmap` | Clickable course → module → topic → subtopic tree |
| Flashcards | `#/flashcards` | 3D flip cards, filter by module/topic, “Mark as mastered” (saved in the browser) |
| Quiz arena | `#/quiz` | MCQ + predict-the-output, streak multiplier, score summary, review of mistakes |
| Python Playground | `#/playground` | Programiz-style split screen: editor + Run ▶ / Reset / Stop, stdin box, output console. Includes all 18 syllabus lab experiments |
| PYQ Analyzer | `#/pyq` | Ready for phase 2: import KTU question papers (JSON) → auto-map each question to a topic → heatmap and ranking |

### 18 interactive animations
Tower of Hanoi · Backtracking path search · CPU fetch–decode–execute cycle · Operator-precedence evaluator (type any expression) · Pseudocode tracer (FOR / WHILE / REPEAT-UNTIL, factorial, largest of n, KTU grade CASE, 50→1) · Flowchart animator · `for` + `range()` explorer · List slicing explorer · Top-three decomposition · Recursion call stack (factorial, fib, gcd, sum of digits, add) · Brute-force padlock + password search space · Merge sort · Fibonacci: recursion vs memoization vs tabulation · Greedy task scheduling · Greedy coin change (with a counter-example) · Coupon collector · Hat-check · Monte Carlo π

All step-based animations share Play / Pause / Step back / Step forward / First / Last / scrubber / speed (0.5×–4×) controls.

---

## Project structure

```
src/
  data/            ← the data layer (edit content here)
    types.ts         shared types (Topic, Block, Flashcard, QuizQuestion, PyqPaper…)
    m1.ts … m4.ts    notes for each module, written from the uploaded syllabus + notes
    syllabus.ts      course info, module list, helpers
    flashcards.ts    85 flashcards
    quizzes.ts       61 quiz questions (all code-output answers verified by running them)
    labs.ts          the 18 syllabus lab programs
    pyq.ts           PYQ schema, keyword mapper and analysis (phase 2)
  visualizers/     ← one file per animation; registry in index.tsx
  compiler/        ← Pyodide web-worker runner + Monaco split-screen compiler
  components/      ← navbar, sidebar, notes renderer, player controls, drawer
  pages/           ← Home, Module, Topic, Slides, MindMap, Flashcards, Quiz, Playground, PyqAnalyzer
  index.css        ← design tokens (light/dark palette) + Tailwind theme
```

### Adding previous-year questions (phase 2)
Either paste or upload JSON on the PYQ page, or bundle papers in `src/data/pyq.ts → PYQ_PAPERS`:

```json
[{
  "exam": "Dec 2024 (Regular)", "year": 2024,
  "questions": [
    { "id": "d24-1", "exam": "Dec 2024 (Regular)", "part": "A", "number": "1", "marks": 3, "module": 1,
      "text": "Differentiate well-defined and ill-defined problems." },
    { "id": "d24-11a", "exam": "Dec 2024 (Regular)", "part": "B", "number": "11 a", "marks": 5, "module": 2,
      "text": "Draw a flowchart to find the factorial of a number.", "topicIds": ["m2-flowcharts"] }
  ]
}]
```

Questions are mapped with the `keywords` list on each topic (`src/data/m*.ts`); `module` boosts the right module and `topicIds` overrides the mapping.

### Colour system
Light: `#FFFFFF` background, `#F0F7FF` surfaces, `#2563EB` / `#1D4ED8` accents, `#0F172A` text.
Dark: `#060B19` background, `#0F172A` cards, `#38BDF8` / `#3B82F6` glowing accents, `#F8FAFC` text.
Tokens live in `src/index.css`; the toggle in the navbar is saved in `localStorage`.

## PYQ data (phase 2)
- `src/data/pyq-papers.ts` – 145 real questions from 7 papers (KTU Dec 2024, KTU model paper, CET Series 1 & 2, question bank May 2026 / Dec 2025 / May 2025), mapped to topics by hand.
- `src/data/practice.ts` – 36 new practice questions with verified answers (separate from the PYQ statistics).
