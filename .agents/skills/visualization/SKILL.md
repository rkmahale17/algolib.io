---
name: Visualization Creation or Update
description: Skill for creating, standardizing, or updating algorithm visualizations based on a problem ID.
---

# Visualization Creation or Update Skill

This skill is invoked when the user explicitly mentions keywords like `visual`, `visualization` (or related terms) ALONG WITH a problem ID in the format `/problem/:id`. Simply providing a problem ID without these keywords will not trigger the skill.

## Workflow Process

### 1. Locate Visualization File
- When provided `/problem/:id`, search for the existing visualization file in the codebase. Typical locations include `src/components/visualizations/algorithms/`.
- If the file exists, prepare to update it, aligning it with the latest standards.
- If the file does not exist, notify the user and ask for confirmation to generate a new visualization.

### 2. Implementation Rules & Standards

When creating or updating the visualization, rigidly follow these rules:

1. **Proper Code and Steps Sync:** The execution steps (logic state) MUST be perfectly synchronized with the exact lines of code being executed in the editor view.
2. **No Code Comments:** The algorithm code block displayed to the user MUST NOT contain any comments. Remove all inline or block comments to ensure a clean, distraction-free reading experience.
3. **Proper Commentary:** Implement descriptive, step-by-step narrative commentary for each execution step. The text should clearly explain to the coder *why* an action is taken and *how* the algorithm solves the problem.
4. **Educational Value:** With respect to the problem description, the visualization must be intuitively designed so the coder visually and conceptually understands the algorithm's mechanics.
5. **Instantaneous Transitions (No Click Animations):** Disable all click-based animations to ensure stable, professional, and instant visual transitions when navigating between steps.
6. **Standardized UI/UX Layout:** Maintain consistent placement of variable panels and use intuitive geometric representations for data structures. The layout should typically be a two-column grid on large screens.
7. **No Array Index Labels:** Do not add "idx" labels (or similar index markings) to array visual elements. Keep the array representations clean.
8. **Text Color:** Ensure the color of the text used in visualizations is black for maximum clarity and contrast.
9. **Top-Aligned Controls:** The `SimpleStepControls` component MUST be placed at the top of the visualization, above the main content grid, to ensure immediate user access to navigation.
10. **Use AnimatedCodeEditor:** Always use the `AnimatedCodeEditor` component when an implementation code block is required within the visualization.
11. **Minimal Code Editor Container:** Do NOT include a redundant `div` wrapper, "Implementation" heading, or extra layout containers (like `flex-1 overflow-auto`) within the `Card` that encloses the `AnimatedCodeEditor`. The editor should be the primary child of its container card.

### 3. Verification
- Double-check that there are absolutely no comments inside the code block string.
- Verify array/pointer/variable states correspond exactly to the active execution step.
