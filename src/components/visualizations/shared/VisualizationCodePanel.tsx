'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { AnimatedCodeEditor } from './AnimatedCodeEditor';
import { PseudocodeView } from './PseudocodeView';
import {
  VISUALIZATION_LANGUAGES,
  LANGUAGE_LABELS,
  DEFAULT_LANGUAGE_PRIORITY,
  type VisualizationLanguage,
  type VisualizationLanguageMap,
  type StepLineNumberMap,
} from '@/types/visualization';
import { Code2, GitBranch, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LanguageSelector } from '@/components/CodeRunner/LanguageSelector';

interface VisualizationCodePanelProps {
  /**
   * Hardcoded code per language, written directly in the visualization file.
   * Only the languages present here will appear in the dropdown.
   */
  languages: VisualizationLanguageMap;

  /**
   * Per-language line number for each step.
   * `typescript` is the required fallback key — other languages are optional.
   * If a language is absent, the `typescript` line numbers are used instead.
   */
  stepLineNumbers: StepLineNumberMap;

  /** Language-agnostic pseudo-statements — one per step, in step order */
  pseudoSteps: string[];

  activeStepIndex: number;
  className?: string;
  onLanguageChange?: (lang: VisualizationLanguage) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * VisualizationCodePanel
 *
 * Single unified header:
 *   [</> Code]  [🌿 Pseudocode]           [Language ▼]  [👁]  [📋]
 *
 * - Code text is hardcoded in the visualization file (via `languages` prop).
 * - Language dropdown shows only the languages present in `languages`.
 * - Default language: Python if available, else TypeScript.
 * - Eye/Copy only shown in Code mode.
 */
export const VisualizationCodePanel = ({
  languages,
  stepLineNumbers,
  pseudoSteps,
  activeStepIndex,
  className = '',
  onLanguageChange,
}: VisualizationCodePanelProps) => {

  const [viewMode, setViewMode] = useState<'code' | 'pseudocode'>('code');
  const [isBlurred, setIsBlurred] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync blur state with localStorage so it stays consistent with other panels
  useEffect(() => {
    const sync = () => {
      const saved = localStorage.getItem('visualization-code-blurred');
      if (saved !== null) setIsBlurred(saved === 'true');
    };
    sync();
    window.addEventListener('code-blur-change', sync);
    return () => window.removeEventListener('code-blur-change', sync);
  }, []);

  const handleBlurChange = (val: boolean) => {
    setIsBlurred(val);
    localStorage.setItem('visualization-code-blurred', String(val));
    window.dispatchEvent(new Event('code-blur-change'));
  };

  // Languages that actually have code provided
  const availableLanguages = useMemo<VisualizationLanguage[]>(
    () => VISUALIZATION_LANGUAGES.filter((lang) => !!languages[lang]),
    [languages],
  );

  // Default: first from priority list that has code
  const defaultLanguage = useMemo<VisualizationLanguage>(() => {
    for (const lang of DEFAULT_LANGUAGE_PRIORITY) {
      if (languages[lang]) return lang;
    }
    return 'typescript';
  }, [languages]);

  const [activeLanguage, setActiveLanguage] = useState<VisualizationLanguage>(defaultLanguage);

  // Re-sync with default language or load from localStorage on mount/update
  useEffect(() => {
    const saved = localStorage.getItem('visualization-active-language') as VisualizationLanguage | null;
    if (saved && languages[saved]) {
      setActiveLanguage(saved);
    } else {
      setActiveLanguage(defaultLanguage);
    }
  }, [defaultLanguage, languages]);

  const highlightedLine = useMemo<number>(() => {
    const lineMap = stepLineNumbers[activeLanguage] ?? stepLineNumbers.typescript;
    return lineMap?.[activeStepIndex] ?? 1;
  }, [stepLineNumbers, activeLanguage, activeStepIndex]);

  const activeCode = languages[activeLanguage] ?? '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  };

  if (availableLanguages.length === 0 && pseudoSteps.length === 0) return null;

  return (
    <div className={`flex flex-col rounded-lg border border-border overflow-hidden bg-card ${className}`}>

      {/* ── Single unified header bar ── */}
      <div className="bg-muted border-b border-border flex items-center h-10 shrink-0">

        {/* Left: view mode tabs */}
        <div className="flex h-full">
          {viewMode === 'code' ? (
            /* Active Code Tab - renders LanguageSelector dropdown */
            <div className="flex items-center h-full border-r border-border transition-colors bg-background text-foreground border-b-2 border-b-primary">
              <LanguageSelector
                language={activeLanguage as any}
                onLanguageChange={(lang) => {
                  const newLang = lang as VisualizationLanguage;
                  setActiveLanguage(newLang);
                  localStorage.setItem('visualization-active-language', newLang);
                  onLanguageChange?.(newLang);
                }}
                availableLanguages={availableLanguages as any[]}
              />
            </div>
          ) : (
            /* Inactive Code Tab - renders a simple Tab button */
            <button
              onClick={() => setViewMode('code')}
              className="flex items-center gap-1.5 h-full px-3.5 text-xs font-medium border-r border-border transition-colors text-muted-foreground hover:text-foreground hover:bg-background/50"
            >
              <Code2 className="w-3.5 h-3.5" />
              Code
            </button>
          )}

          {/* Logic Tab */}
          <button
            onClick={() => setViewMode('pseudocode')}
            className={`flex items-center gap-1.5 h-full px-3.5 text-xs font-medium border-r border-border transition-colors ${
              viewMode === 'pseudocode'
                ? 'bg-background text-foreground border-b-2 border-b-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            Logic
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: eye + copy — Code mode only */}
        {viewMode === 'code' && (
          <div className="flex items-center h-full">

            {/* Eye toggle */}
            <Button
              variant="ghost" size="sm"
              onClick={() => handleBlurChange(!isBlurred)}
              className="h-10 w-10 p-0 rounded-none border-l border-border hover:bg-primary/10 flex items-center justify-center"
              title={isBlurred ? 'Show Code' : 'Hide Code'}
            >
              {isBlurred
                ? <EyeOff className="w-4 h-4 text-muted-foreground" />
                : <Eye className="w-4 h-4 text-muted-foreground" />}
            </Button>

            {/* Copy */}
            <Button
              variant="ghost" size="sm"
              onClick={handleCopy}
              className="h-10 w-10 p-0 rounded-none border-l border-border hover:bg-primary/10 flex items-center justify-center"
              title="Copy Code"
            >
              {copied
                ? <Check className="w-4 h-4 text-primary" />
                : <Copy className="w-4 h-4 text-muted-foreground" />}
            </Button>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      {viewMode === 'code' ? (
        <AnimatedCodeEditor
          code={activeCode}
          language={activeLanguage}
          highlightedLines={[highlightedLine]}
          hideHeader={true}
          isBlurred={isBlurred}
          onBlurChange={handleBlurChange}
          className="rounded-none border-0"
        />
      ) : (
        <PseudocodeView
          steps={pseudoSteps}
          activeIndex={activeStepIndex}
          hideHeader={true}
          className="rounded-none border-0 h-[500px]"
        />
      )}
    </div>
  );
};
