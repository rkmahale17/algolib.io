'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useAlgorithm } from '@/hooks/useAlgorithm';
import { useAlgorithms } from '@/hooks/useAlgorithms';
import { useApp } from '@/contexts/AppContext';
import { ListType, DIFFICULTY_MAP } from '@/types/algorithm';
import { cn } from '@/lib/utils';
import { renderVisualization as renderVizFromMapping, hasVisualization } from '@/utils/visualizationMapping';
import { renderBlind75Visualization } from '@/utils/blind75Visualizations';
import { Eye, Target, Maximize, Minimize2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProOverlay } from '@/components/ProOverlay';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const RichText = dynamic(() => import('@/components/RichText').then(mod => mod.RichText), { ssr: false });

export default function VisualLibraryClient() {
  const { data: algorithmsData, isLoading: isLoadingList } = useAlgorithms();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { hasPremiumAccess } = useApp();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedSlug = searchParams.get('problem');

  const coreAlgorithms = useMemo(() => {
    if (!algorithmsData?.algorithms) return [];
    const all = algorithmsData.algorithms.filter(algo => algo.problemType === 'dsa' && algo.published !== false);
    
    const core = all.filter(algo => {
      const types = algo.listTypes || (algo.list_type ? [algo.list_type] : ['core']);
      return types.includes(ListType.Core);
    });

    return core.sort((a, b) => (a.serial_no || 0) - (b.serial_no || 0)).map((algo, index) => {
      const isPro = index >= 10;
      return {
        ...algo,
        is_premium: isPro,
        is_pro: isPro,
        metadata: {
          ...(algo.metadata || {}),
          is_pro: isPro
        }
      };
    });
  }, [algorithmsData]);

  useEffect(() => {
    if (coreAlgorithms.length > 0 && !selectedSlug) {
      router.replace(`${pathname}?problem=${coreAlgorithms[0].slug || coreAlgorithms[0].id}`);
    }
  }, [coreAlgorithms, selectedSlug, pathname, router]);

  const activeAlgorithm = useMemo(() => {
    if (!selectedSlug) return coreAlgorithms[0];
    return coreAlgorithms.find(a => a.slug === selectedSlug || a.id === selectedSlug) || coreAlgorithms[0];
  }, [coreAlgorithms, selectedSlug]);

  const { data: fullAlgorithm, isLoading: isLoadingFull } = useAlgorithm(activeAlgorithm?.id || activeAlgorithm?.slug);

  const renderVisualization = () => {
    if (!activeAlgorithm) return null;

    const dbUrl = activeAlgorithm.metadata?.visualizationUrl || activeAlgorithm.visualizationUrl;
    if (dbUrl && dbUrl.startsWith("http")) {
      return (
        <iframe
          src={dbUrl}
          className="w-full h-full min-h-[600px] border-0"
          title="Visualization"
        />
      );
    }

    const algorithmKey = activeAlgorithm.id || activeAlgorithm.slug;
    if (hasVisualization(algorithmKey)) {
      return (
        <div className="w-full h-full min-h-[600px] overflow-y-auto p-4 sm:p-6">
          {renderVizFromMapping(algorithmKey)}
        </div>
      );
    }

    const blind75Viz = renderBlind75Visualization(algorithmKey);
    if (blind75Viz) {
      return (
        <div className="w-full h-full min-h-[600px] overflow-y-auto p-4 sm:p-6">
          {blind75Viz}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] text-center space-y-3 p-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Eye className="w-8 h-8 text-primary opacity-50" />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">Visualization Unavailable</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-[250px] mx-auto">
            An interactive visualization for this pattern is not yet available in the library.
          </p>
        </div>
      </div>
    );
  };

  if (isLoadingList || (isLoadingFull && !fullAlgorithm)) {
    return (
      <div className="flex min-h-[calc(100vh-68px)] items-center justify-center w-full">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Target className="w-10 h-10 text-primary opacity-50 animate-bounce" />
          <p className="text-muted-foreground font-medium">Loading Visual Library...</p>
        </div>
      </div>
    );
  }

  if (coreAlgorithms.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-68px)] items-center justify-center w-full">
        <p className="text-muted-foreground">No core patterns available.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-68px)] bg-background">
      <div className="max-w-[1000px] mx-auto w-full px-4 sm:px-6 md:px-8 py-8 md:py-12 space-y-10">
        
        {activeAlgorithm && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl font-medium text-foreground">
                    <span className="font-medium mr-1">{activeAlgorithm.serial_no ? `${activeAlgorithm.serial_no}.` : ""}</span>
                    {activeAlgorithm.name}
                  </h1>
                  {(activeAlgorithm?.is_premium || activeAlgorithm?.is_pro || activeAlgorithm?.metadata?.is_pro) && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[11px] font-bold px-2.5 py-0.5 uppercase tracking-wide rounded-full h-6">
                      PRO
                    </Badge>
                  )}
                </div>
                
                <Button asChild size="sm" className="gap-2 shrink-0 shadow-sm">
                  <Link href={`/problem/${activeAlgorithm.slug || activeAlgorithm.id}`} target="_blank" rel="noopener noreferrer">
                    Try this problem
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={cn("font-semibold px-3 py-1 rounded-full text-xs",
                  DIFFICULTY_MAP[(activeAlgorithm.difficulty || "").toLowerCase()] === "Easy" ? "bg-green-500/10 text-green-600 border-green-500/30" :
                  DIFFICULTY_MAP[(activeAlgorithm.difficulty || "").toLowerCase()] === "Hard" ? "bg-red-500/10 text-red-600 border-red-500/30" :
                  "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                )}>
                  {DIFFICULTY_MAP[(activeAlgorithm.difficulty || "").toLowerCase()] || activeAlgorithm.difficulty}
                </Badge>
                {activeAlgorithm.category && (
                  <Badge variant="outline" className="bg-muted/50 text-foreground border-border text-xs px-3 py-1 rounded-full">
                    {activeAlgorithm.category.split(',')[0]}
                  </Badge>
                )}
              </div>
            </div>

            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-[700px] prose-headings:font-semibold prose-a:text-primary">
              {fullAlgorithm?.explanation?.problemStatement ? (
                <RichText content={fullAlgorithm.explanation.problemStatement} />
              ) : (
                <p className="text-muted-foreground italic">No description available for this pattern.</p>
              )}
            </div>
          </div>
        )}

        <Card className="overflow-hidden border-border/50 shadow-sm mt-8">
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Interactive Visualization
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(true)} className="gap-2">
              <Maximize className="w-4 h-4" />
              <span className="hidden sm:inline">Fullscreen</span>
            </Button>
          </div>
          <div className="relative w-full h-[calc(100vh-250px)] min-h-[600px] bg-background overflow-hidden">
            {(!hasPremiumAccess && (activeAlgorithm?.is_premium || activeAlgorithm?.is_pro || activeAlgorithm?.metadata?.is_pro)) ? (
              <ProOverlay className="border-0 flex-1 h-full" />
            ) : (
              renderVisualization()
            )}
          </div>
        </Card>
      </div>

      {isFullscreen && createPortal(
        <div className="fixed inset-0 z-[100] bg-background flex flex-col w-screen h-screen">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-background shrink-0 h-14">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Interactive Visualization
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(false)} className="gap-2">
              <Minimize2 className="w-4 h-4" />
              Exit Fullscreen
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
            {(!hasPremiumAccess && (activeAlgorithm?.is_premium || activeAlgorithm?.is_pro || activeAlgorithm?.metadata?.is_pro)) ? (
              <ProOverlay className="border-0 flex-1 h-full" />
            ) : (
              renderVisualization()
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
