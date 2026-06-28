/**
 * Types for multi-language and pseudocode visualization support.
 *
 * Architecture overview:
 * - Each visualization file provides `stepLineNumbers` (per-language line indices per step)
 *   and `languages` (hardcoded code per language as a fallback).
 * - Code text can also come from the DB `algorithm.implementations` field.
 * - The `VisualizationCodePanel` component merges both sources and renders
 *   either a code editor (with language tabs) or a pseudocode list view.
 */

/** Languages supported in visualization code panels */
export type VisualizationLanguage = 'typescript' | 'python' | 'java' | 'cpp';

/** Ordered list of all supported visualization languages */
export const VISUALIZATION_LANGUAGES: VisualizationLanguage[] = [
  'python',
  'cpp',
  'java',
  'typescript',
];

/** Display labels for each language */
export const LANGUAGE_LABELS: Record<VisualizationLanguage, string> = {
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
};

/**
 * Priority order when picking the default language to display.
 * Python is preferred; TypeScript is the final guaranteed fallback.
 */
export const DEFAULT_LANGUAGE_PRIORITY: VisualizationLanguage[] = [
  'python',
  'cpp',
  'java',
  'typescript',
];

/**
 * A map from language → code string.
 * Used by visualization files to provide hardcoded fallback code.
 * Keys are optional — only the languages the author has written are required.
 */
export type VisualizationLanguageMap = Partial<Record<VisualizationLanguage, string>>;

/**
 * Per-step, per-language line number mapping.
 *
 * The array index corresponds to the step index in the visualization.
 * Example:
 *   stepLineNumbers = {
 *     typescript: [2, 3, 4, 5, 5, 6, 8],  // line to highlight at each step
 *     python:     [1, 2, 3, 4, 4, 5, 7],
 *   }
 *
 * If a language key is absent, the `typescript` entry is used as a fallback.
 * `typescript` is therefore the required key.
 */
export type StepLineNumberMap = { typescript: number[] } & Partial<
  Record<VisualizationLanguage, number[]>
>;
