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

### 2. Implementation Rules & Standards

When creating or updating the visualization, rigidly follow these rules:

1. **Proper Code and Steps Sync:** The execution steps (logic state) MUST be perfectly synchronized with the exact lines of code being executed in the editor view.
2. **No Code Comments:** The algorithm code block displayed to the user MUST NOT contain any comments. Remove all inline or block comments to ensure a clean, distraction-free reading experience.
3. **Proper Commentary:** Implement descriptive, step-by-step narrative commentary for each execution step. The text should clearly explain to the coder _why_ an action is taken and _how_ the algorithm solves the problem.
4. **Educational Value:** With respect to the problem description, the visualization must be intuitively designed so the coder visually and conceptually understands the algorithm's mechanics.
5. **Instantaneous Transitions (No Click Animations):** Disable all click-based animations to ensure stable, professional, and instant visual transitions when navigating between steps.
6. **Standardized UI/UX Layout:** Maintain consistent placement of variable panels and use intuitive geometric representations for data structures. The layout should typically be a two-column grid on large screens.
7. **No Array Index Labels:** Do not add "idx" labels (or similar index markings) to array visual elements. Keep the array representations clean.
8. **Text Color:** Ensure the color of the text used in visualizations has high contrast with its background and respects dark mode by using theme-aware classes (e.g., `text-foreground`, `text-primary-foreground`).
9. **Top-Aligned Controls:** The `SimpleStepControls` component MUST be placed at the top of the visualization, above the main content grid, to ensure immediate user access to navigation.
10. **Use VisualizationCodePanel (NOT AnimatedCodeEditor directly):** Always use the `VisualizationCodePanel` component for the right-column code/pseudocode panel. See the multi-language pattern below.
11. **Minimal Code Editor Container:** Do NOT include a redundant `div` wrapper, "Implementation" heading, or extra layout containers within the container that encloses the code panel.
12. **Test Case Selection:** Only implement multiple test cases (and the selection UI) if explicitly requested by the user.
13. **Pedagogical Layout:** Ensure that the descriptive commentary box is placed **at the bottom** of the visualization's left column. The commentary box must be styled as a simple bordered container matching the `VariablePanel` style (`div` with `bg-muted/50 rounded-lg border border-border p-4`), and the commentary description/explanation text color must be `text-muted-foreground` (matching the variable name text color). By default, the `VariablePanel` MUST be placed in the right column **below** the code editor (`VisualizationCodePanel`), allowing the user to change it later.
14. **Include `pseudoStep`** in every Step object (see multi-language pattern below).
15. **Array Box Sizing:** Always use `w-8 h-8` for array element boxes to maintain consistent, readable dimensions across visualizations.
16. **No Uppercase Text:** Do not use all-caps text or the `uppercase` CSS class for words, labels, or headings in the visualization UI. Use standard sentence or title casing. (Note: pseudocode keywords still follow the ALL-CAPS rule in their specific section).

### 3. Multi-Language + Pseudocode Pattern (REQUIRED for all visualization updates)

Every new or updated visualization MUST follow this pattern. See TwoSumVisualization.tsx (or similar) as the canonical reference.

#### Rule: Hardcoded Multi-Language Code (No DB calls at runtime)
- Always support all 4 languages (TypeScript, Python, Java, C++) and Logic pseudocode.
- The exact optimized code implementations must be hardcoded directly inside the visualization component file via the `languages` map.
- The hardcoded code must match the database's optimized implementations exactly (typically provided by the user or fetched from the local clean database codes JSON). Do not make any structural, logic, variable naming, or API changes. The code logic must be identical to the database.
- The code panel strings must not contain any comments or blank lines.
- The step highlight line numbers must be aligned to the clean code offsets exactly.

#### What the visualization file IS responsible for:
1. **`languages`** — the actual comment-free, optimized code strings for each of the 4 supported languages.
2. **`pseudoSteps`** — one language-agnostic pseudo-statement per step.
3. **`stepLineNumbers`** — dynamically built line mappings that match the `steps` array length exactly.

#### Step type
```ts
interface Step {
  // ... data fields specific to this algorithm ...
  explanation: string;  // narrative sentence explaining what/why
  pseudoStep: string;   // language-agnostic pseudo-statement (see style guide)
}
```

#### Language code map
```ts
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

const languages: VisualizationLanguageMap = {
  python: `...`,      // Python implementation (no comments)
  typescript: `...`,  // TypeScript implementation (no comments)
  java: `...`,        // Java implementation (no comments)
  cpp: `...`,         // C++ implementation (no comments)
};
```

#### Dynamic Step and Line Number Generation
Because algorithms have loops and dynamic step counts, **do NOT hardcode `stepLineNumbers` as a static array**. Generate it dynamically alongside the `steps` array so their lengths are guaranteed to match perfectly.

```ts
function generateVisualizationData() {
  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  // Example step creation
  steps.push({ ... });
  addLines(2, 2, 2, 2); // line numbers for ts, py, java, cpp for this exact step

  // ... (loops and logic) ...

  return { steps, stepLineNumbers };
}
```

#### JSX (right column)
```tsx
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';

export const MyVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    // ... layout ...
    <VisualizationCodePanel
      languages={languages}
      stepLineNumbers={stepLineNumbers}
      pseudoSteps={pseudoSteps}
      activeStepIndex={currentStepIndex}
    />
  );
}
```

#### Pseudocode style guide
- Use ALL-CAPS keywords: `SET`, `FOR`, `IF`, `ELSE`, `RETURN`, `WHILE`, `CALL`
- Use plain English for data structures: `seen = {} (empty map)`, `stack = []`
- Show concrete values where helpful: `complement = target − nums[i] → 18 − 2 = 16`
- Keep each statement to one line (under 80 chars)
- Use arrows for results: `→ YES ✓` / `→ NO ✗`

### 4. Verification

- Double-check that there are absolutely no comments inside the code block strings.
- Verify array/pointer/variable states correspond exactly to the active execution step.
- Verify all 4 language code blocks are present in `languages` (Python, TypeScript, Java, C++).
- Verify `stepLineNumbers` are built dynamically using an `addLines()` helper alongside every `steps.push()` so the arrays never fall out of sync.
