---
name: rulcode-development
description: "Develop and extend the RulCode technical interview preparation platform built with React, Vite, TypeScript, and Supabase. Use when adding new algorithm problems, building visualization components, implementing DSA topic pages, updating the problem editor, or modifying the interview preparation UI."
---

# RulCode Development

Build and extend the RulCode platform — a React/Vite/TypeScript application for technical interview preparation covering DSA, system design, and frontend concepts.

## Workflow

### 1. Understand the request

Identify which area of the platform the change targets:

- **Algorithm problems**: Adding or editing problems in `src/` covering arrays, strings, hashing, two pointers, sliding window, recursion, backtracking, trees, graphs, dynamic programming, and greedy algorithms
- **Visualizations**: Step-by-step algorithm animations (see `.agents/skills/visualization/SKILL.md`)
- **UI components**: React components using Tailwind CSS and shadcn/ui (`components.json`)
- **Backend/data**: Supabase integration in `supabase/`

### 2. Set up the development environment

```bash
npm install
npm run dev
```

The project uses Vite (`vite.config.ts`) with TypeScript (`tsconfig.json`) and Tailwind CSS (`tailwind.config.ts`).

### 3. Implement the change

- Follow existing patterns in `src/` for component structure and naming
- Use TypeScript strict mode conventions from `tsconfig.app.json`
- Lint with ESLint (`eslint.config.js`)
- Problems support multiple difficulty levels and multiple language implementations

### 4. Verify

```bash
npm run build
npm run lint
```

Check that the dev server renders the change correctly at the target route.
