---
name: visualization-creation-or-update
description: "Create, standardize, or update step-by-step algorithm visualizations for a given problem ID. Use when the user mentions 'visual', 'visualization', 'animate', or 'step-by-step' alongside a problem ID in /problem/:id format."
---

# Visualization Creation or Update

Create or update algorithm visualizations that synchronize code execution with visual state for problems identified by `/problem/:id`.

## Workflow

### 1. Locate the visualization file

Search `src/components/visualizations/algorithms/` for the file matching the problem ID.

- **File exists**: Update it to match the standards below.
- **File missing**: Confirm with the user before generating a new visualization.

### 2. Implement the visualization

#### Code display rules

- The execution steps MUST be perfectly synchronized with the highlighted lines of code in the editor view.
- The algorithm code block MUST NOT contain any comments — remove all inline and block comments.
- Always use the `AnimatedCodeEditor` component for code blocks. Do not add redundant wrapper `div`s, headings, or extra layout containers around it.

#### Layout rules

- Place `SimpleStepControls` at the top of the visualization, above the main content grid.
- Use a two-column grid on large screens with consistent `VariablePanel` placement.
- Place the descriptive commentary box above the `VariablePanel` to provide immediate context.
- Use theme-aware text classes (`text-foreground`, `text-primary-foreground`) instead of hardcoded colors.
- Do not add index labels (e.g., "idx") to array visual elements.

#### Interaction rules

- Disable all click-based animations — transitions between steps must be instantaneous.
- Only implement multiple test cases if explicitly requested. When implemented, provide a visually polished toggle UI using `lucide-react` icons. Switching cases must reset `currentStepIndex` to 0 and `isPlaying` to false.

#### Commentary rules

- Write descriptive, step-by-step narrative commentary explaining *why* each action is taken and *how* the algorithm progresses toward the solution.

### 3. Verify

Confirm each of the following before completing:

- [ ] No comments inside the code block string
- [ ] Variable/pointer states match the active execution step at every step index
- [ ] `SimpleStepControls` renders above the content grid
- [ ] `AnimatedCodeEditor` has no redundant wrapper elements
- [ ] Text colors use theme-aware classes
