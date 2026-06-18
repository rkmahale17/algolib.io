import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Info, CheckCircle2, Plane, Navigation, Check, Undo2 } from 'lucide-react';

interface Step {
  adj: Record<string, string[]>;
  result: string[];
  ticketsRemaining: number;
  currentAirport: string;
  message: string;
  lineNumber: number;
  isMatch?: boolean;
  dfsStack: string[];
  highlightedTickets: number[];
  usedTickets: number[];
  backtrackedTicket: number | null;
}

export const ReconstructItineraryVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const tickets = useMemo(() => [
    { from: "JFK", to: "KUL" }, // Index 0 (lexicographically 1st from JFK)
    { from: "JFK", to: "NRT" }, // Index 1
    { from: "NRT", to: "JFK" }  // Index 2
  ], []);

  const code = `function findItinerary(tickets: string[][]): string[] {
    const adj: Record<string, string[]> = {};

    for (const [src] of tickets) {
        adj[src] = [];
    }

    tickets.sort((a, b) => {
        if (a[0] === b[0]) {
            return a[1].localeCompare(b[1]);
        }
        return a[0].localeCompare(b[0]);
    });

    for (const [src, dst] of tickets) {
        adj[src].push(dst);
    }

    const result: string[] = ["JFK"];

    function dfs(src: string): boolean {
        if (result.length === tickets.length + 1) {
            return true;
        }

        if (!(src in adj)) {
            return false;
        }

        const temp = [...adj[src]];

        for (let i = 0; i < temp.length; i++) {
            const next = temp[i];

            adj[src].splice(i, 1);
            result.push(next);

            if (dfs(next)) {
                return true;
            }

            adj[src].splice(i, 0, next);
            result.pop();
        }

        return false;
    }

    dfs("JFK");

    return result;
}`;

  const steps: Step[] = useMemo(() => [
    {
      adj: {},
      result: ["JFK"],
      ticketsRemaining: 3,
      currentAirport: "JFK",
      message: "Initialize empty adjacency list and itinerary starting at 'JFK'.",
      lineNumber: 2,
      dfsStack: [],
      highlightedTickets: [],
      usedTickets: [],
      backtrackedTicket: null
    },
    {
      adj: { JFK: ["KUL", "NRT"], NRT: ["JFK"], KUL: [] },
      result: ["JFK"],
      ticketsRemaining: 3,
      currentAirport: "JFK",
      message: "Sort tickets lexicographically and build adjacency list. JFK maps to ['KUL', 'NRT'], and NRT maps to ['JFK'].",
      lineNumber: 8,
      dfsStack: [],
      highlightedTickets: [],
      usedTickets: [],
      backtrackedTicket: null
    },
    {
      adj: { JFK: ["KUL", "NRT"], NRT: ["JFK"], KUL: [] },
      result: ["JFK"],
      ticketsRemaining: 3,
      currentAirport: "JFK",
      message: "Initiate itinerary search with DFS from 'JFK'. Target itinerary length is 4 airports (3 tickets + 1).",
      lineNumber: 49,
      dfsStack: ["JFK"],
      highlightedTickets: [],
      usedTickets: [],
      backtrackedTicket: null
    },
    {
      adj: { JFK: ["KUL", "NRT"], NRT: ["JFK"], KUL: [] },
      result: ["JFK"],
      ticketsRemaining: 3,
      currentAirport: "JFK",
      message: "DFS('JFK'): Loop over sorted destination targets. Try first option: 'KUL'.",
      lineNumber: 32,
      dfsStack: ["JFK"],
      highlightedTickets: [0],
      usedTickets: [],
      backtrackedTicket: null
    },
    {
      adj: { JFK: ["NRT"], NRT: ["JFK"], KUL: [] },
      result: ["JFK", "KUL"],
      ticketsRemaining: 2,
      currentAirport: "KUL",
      message: "Use ticket JFK ➔ KUL. Remove 'KUL' from JFK's options and append 'KUL' to current itinerary.",
      lineNumber: 35,
      dfsStack: ["JFK"],
      highlightedTickets: [],
      usedTickets: [0],
      backtrackedTicket: null
    },
    {
      adj: { JFK: ["NRT"], NRT: ["JFK"], KUL: [] },
      result: ["JFK", "KUL"],
      ticketsRemaining: 2,
      currentAirport: "KUL",
      message: "Recurse: Call DFS('KUL') to continue journey.",
      lineNumber: 38,
      dfsStack: ["JFK", "KUL"],
      highlightedTickets: [],
      usedTickets: [0],
      backtrackedTicket: null
    },
    {
      adj: { JFK: ["NRT"], NRT: ["JFK"], KUL: [] },
      result: ["JFK", "KUL"],
      ticketsRemaining: 2,
      currentAirport: "KUL",
      message: "DFS('KUL'): Outgoing check. KUL has no outgoing flights (dead end) and we haven't used all tickets. This search branch fails.",
      lineNumber: 26,
      dfsStack: ["JFK", "KUL"],
      highlightedTickets: [],
      usedTickets: [0],
      backtrackedTicket: null
    },
    {
      adj: { JFK: ["NRT"], NRT: ["JFK"], KUL: [] },
      result: ["JFK", "KUL"],
      ticketsRemaining: 2,
      currentAirport: "KUL",
      message: "Return false from DFS('KUL') back to DFS('JFK').",
      lineNumber: 46,
      dfsStack: ["JFK", "KUL"],
      highlightedTickets: [],
      usedTickets: [0],
      backtrackedTicket: null
    },
    {
      adj: { JFK: ["KUL", "NRT"], NRT: ["JFK"], KUL: [] },
      result: ["JFK"],
      ticketsRemaining: 3,
      currentAirport: "JFK",
      message: "Backtrack! Pop 'KUL' from itinerary and restore flight JFK ➔ KUL back to available choices.",
      lineNumber: 42,
      dfsStack: ["JFK"],
      highlightedTickets: [],
      usedTickets: [],
      backtrackedTicket: 0
    },
    {
      adj: { JFK: ["KUL", "NRT"], NRT: ["JFK"], KUL: [] },
      result: ["JFK"],
      ticketsRemaining: 3,
      currentAirport: "JFK",
      message: "DFS('JFK'): Advance loop. Try next option: 'NRT'.",
      lineNumber: 32,
      dfsStack: ["JFK"],
      highlightedTickets: [1],
      usedTickets: [],
      backtrackedTicket: null
    },
    {
      adj: { JFK: ["KUL"], NRT: ["JFK"], KUL: [] },
      result: ["JFK", "NRT"],
      ticketsRemaining: 2,
      currentAirport: "NRT",
      message: "Use ticket JFK ➔ NRT. Remove 'NRT' from JFK's options and append 'NRT' to itinerary.",
      lineNumber: 35,
      dfsStack: ["JFK"],
      highlightedTickets: [],
      usedTickets: [1],
      backtrackedTicket: null
    },
    {
      adj: { JFK: ["KUL"], NRT: ["JFK"], KUL: [] },
      result: ["JFK", "NRT"],
      ticketsRemaining: 2,
      currentAirport: "NRT",
      message: "Recurse: Call DFS('NRT') to find next connection.",
      lineNumber: 38,
      dfsStack: ["JFK", "NRT"],
      highlightedTickets: [],
      usedTickets: [1],
      backtrackedTicket: null
    },
    {
      adj: { JFK: ["KUL"], NRT: ["JFK"], KUL: [] },
      result: ["JFK", "NRT"],
      ticketsRemaining: 2,
      currentAirport: "NRT",
      message: "DFS('NRT'): Loop over targets. Try first option: 'JFK'.",
      lineNumber: 32,
      dfsStack: ["JFK", "NRT"],
      highlightedTickets: [2],
      usedTickets: [1],
      backtrackedTicket: null
    },
    {
      adj: { JFK: ["KUL"], NRT: [], KUL: [] },
      result: ["JFK", "NRT", "JFK"],
      ticketsRemaining: 1,
      currentAirport: "JFK",
      message: "Use ticket NRT ➔ JFK. Remove 'JFK' from NRT's options and append 'JFK' to itinerary.",
      lineNumber: 35,
      dfsStack: ["JFK", "NRT"],
      highlightedTickets: [],
      usedTickets: [1, 2],
      backtrackedTicket: null
    },
    {
      adj: { JFK: ["KUL"], NRT: [], KUL: [] },
      result: ["JFK", "NRT", "JFK"],
      ticketsRemaining: 1,
      currentAirport: "JFK",
      message: "Recurse: Call DFS('JFK') once more.",
      lineNumber: 38,
      dfsStack: ["JFK", "NRT", "JFK"],
      highlightedTickets: [],
      usedTickets: [1, 2],
      backtrackedTicket: null
    },
    {
      adj: { JFK: ["KUL"], NRT: [], KUL: [] },
      result: ["JFK", "NRT", "JFK"],
      ticketsRemaining: 1,
      currentAirport: "JFK",
      message: "DFS('JFK') (level 2): Loop over targets. Try option: 'KUL'.",
      lineNumber: 32,
      dfsStack: ["JFK", "NRT", "JFK"],
      highlightedTickets: [0],
      usedTickets: [1, 2],
      backtrackedTicket: null
    },
    {
      adj: { JFK: [], NRT: [], KUL: [] },
      result: ["JFK", "NRT", "JFK", "KUL"],
      ticketsRemaining: 0,
      currentAirport: "KUL",
      message: "Use ticket JFK ➔ KUL. Remove 'KUL' from JFK's options and append 'KUL' to itinerary.",
      lineNumber: 35,
      dfsStack: ["JFK", "NRT", "JFK"],
      highlightedTickets: [],
      usedTickets: [0, 1, 2],
      backtrackedTicket: null
    },
    {
      adj: { JFK: [], NRT: [], KUL: [] },
      result: ["JFK", "NRT", "JFK", "KUL"],
      ticketsRemaining: 0,
      currentAirport: "KUL",
      message: "Recurse: Call DFS('KUL').",
      lineNumber: 38,
      dfsStack: ["JFK", "NRT", "JFK", "KUL"],
      highlightedTickets: [],
      usedTickets: [0, 1, 2],
      backtrackedTicket: null
    },
    {
      adj: { JFK: [], NRT: [], KUL: [] },
      result: ["JFK", "NRT", "JFK", "KUL"],
      ticketsRemaining: 0,
      currentAirport: "KUL",
      message: "DFS('KUL'): Check success condition. Itinerary size is 4 (target size 3 + 1 reached). All tickets successfully utilized! Return true.",
      lineNumber: 22,
      dfsStack: ["JFK", "NRT", "JFK", "KUL"],
      highlightedTickets: [],
      usedTickets: [0, 1, 2],
      backtrackedTicket: null,
      isMatch: true
    },
    {
      adj: { JFK: [], NRT: [], KUL: [] },
      result: ["JFK", "NRT", "JFK", "KUL"],
      ticketsRemaining: 0,
      currentAirport: "KUL",
      message: "Success propagates back to all callers. Return final itinerary result.",
      lineNumber: 51,
      dfsStack: [],
      highlightedTickets: [],
      usedTickets: [0, 1, 2],
      backtrackedTicket: null,
      isMatch: true
    }
  ], []);

  const step = steps[currentStep] || steps[0];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          {/* Main Visual Board */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden min-h-[440px] flex flex-col shadow-lg shadow-primary/5">
            <h3 className="text-sm font-semibold mb-6 flex items-center justify-center gap-2 text-muted-foreground uppercase tracking-widest">
              <Navigation className="w-4 h-4 text-sky-500 animate-pulse" /> Reconstruct Itinerary Map
            </h3>

            {/* Airport Nodes Grid */}
            <div className="grid grid-cols-3 gap-6 justify-center items-center py-4 max-w-[400px] mx-auto w-full relative">
              {["JFK", "NRT", "KUL"].map((airport) => {
                const isActive = step.currentAirport === airport && step.dfsStack.length > 0;
                const inItinerary = step.result.includes(airport);
                
                let borderClass = "border-border";
                let textClass = "text-muted-foreground";
                let bgClass = "bg-muted/10";
                
                if (isActive) {
                  borderClass = "border-amber-500 scale-110 shadow-lg shadow-amber-500/20 ring-2 ring-amber-500 ring-offset-2 ring-offset-background";
                  textClass = "text-amber-800 dark:text-amber-300 font-extrabold";
                  bgClass = "bg-amber-500/25";
                } else if (inItinerary) {
                  borderClass = "border-violet-500/50";
                  textClass = "text-violet-800 dark:text-violet-200 font-bold";
                  bgClass = "bg-violet-500/15";
                }

                return (
                  <div key={airport} className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${borderClass} ${bgClass}`}>
                      <span className={`text-sm font-mono tracking-wider ${textClass}`}>{airport}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 font-bold mt-2">
                      {airport === "JFK" ? "Start / Hub" : "Airport"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Boarding Passes (Tickets representation) */}
            <div className="space-y-3 mt-6">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Available Flights (Tickets)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {tickets.map((t, idx) => {
                  const isUsed = step.usedTickets.includes(idx);
                  const isHighlighted = step.highlightedTickets.includes(idx);
                  const isBacktracked = step.backtrackedTicket === idx;

                  let borderClass = "border-border bg-background/40";
                  let badge = "bg-muted/20 text-muted-foreground border-transparent";
                  let badgeText = "Unused";
                  let decoration = "";

                  if (isHighlighted) {
                    borderClass = "border-sky-500 bg-sky-500/10 scale-102 shadow-md shadow-sky-500/10";
                    badge = "bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-400/40";
                    badgeText = "Testing";
                    decoration = "animate-pulse";
                  } else if (isBacktracked) {
                    borderClass = "border-rose-500 bg-rose-500/10 scale-102 animate-bounce";
                    badge = "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-400/40";
                    badgeText = "Backtracked";
                  } else if (isUsed) {
                    borderClass = "border-violet-500/30 bg-violet-500/5 opacity-50";
                    badge = "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-400/20";
                    badgeText = "Exhausted";
                  }

                  return (
                    <Card key={idx} className={`p-3 border flex flex-col justify-between transition-all duration-200 ${borderClass}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold tracking-wider">{t.from}</span>
                        <Plane className={`w-3.5 h-3.5 text-muted-foreground/60 ${decoration}`} />
                        <span className="text-xs font-mono font-bold tracking-wider">{t.to}</span>
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/40">
                        <span className="text-[9px] text-muted-foreground/50 font-bold">Flight #{idx + 1}</span>
                        <div className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold border ${badge}`}>
                          {badgeText}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Adjacency list status */}
            <div className="mt-6 p-4 bg-muted/10 border border-border/50 rounded-xl">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Adjacency List (Targets sorted)</h4>
              <div className="space-y-2">
                {Object.keys(step.adj).map((src) => {
                  const destinations = step.adj[src];
                  return (
                    <div key={src} className="flex items-center gap-3 text-xs font-mono">
                      <span className="font-bold text-sky-600 dark:text-sky-400 w-8">{src}</span>
                      <span className="text-muted-foreground">➔</span>
                      <div className="flex gap-2">
                        {destinations.length === 0 ? (
                          <span className="text-[10px] text-muted-foreground/40 italic">[empty]</span>
                        ) : (
                          destinations.map((dst, i) => (
                            <span key={i} className="px-2 py-0.5 bg-background border rounded text-[11px] font-bold shadow-sm">
                              {dst}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Reconstructed Path Banner */}
          <Card className="p-4 bg-card/40 border-primary/10 shadow-md space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" /> Reconstructed Itinerary Path
            </h4>
            <div className="flex flex-wrap items-center gap-2.5 p-3 bg-muted/20 border border-border/50 rounded-xl min-h-[52px]">
              {step.result.map((airport, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-muted-foreground/30 text-sm font-bold">➔</span>}
                  <div className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border shadow-sm transition-all duration-200 ${
                    idx === step.result.length - 1 && step.dfsStack.length > 0
                      ? 'bg-amber-500/25 border-amber-500 text-amber-700 dark:text-amber-300 scale-102'
                      : 'bg-background border-border text-foreground/80'
                  }`}>
                    {airport}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </Card>

          {/* Stack Visualizer */}
          <Card className="p-4 bg-card/40 border-primary/10 shadow-md space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> DFS Call Stack
            </h4>
            <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/20 border border-border/50 rounded-xl min-h-[52px]">
              {step.dfsStack.length === 0 ? (
                <span className="text-xs text-muted-foreground italic font-medium">Stack is empty</span>
              ) : (
                step.dfsStack.map((node, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-muted-foreground/30 text-xs">➔</span>}
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border shadow-sm ${
                      idx === step.dfsStack.length - 1 
                        ? 'bg-amber-500/25 border-amber-500 text-amber-700 dark:text-amber-300 font-extrabold animate-pulse'
                        : 'bg-background border-border text-foreground/70'
                    }`}>
                      dfs("{node}")
                    </div>
                  </React.Fragment>
                ))
              )}
            </div>
          </Card>

          {/* Commentary */}
          <Card className={`p-5 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm min-h-[110px] flex items-center ${
            step.isMatch ? 'bg-primary/10 border-primary' : 'bg-accent/40 border-primary/40'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-xl shrink-0 ${step.isMatch ? 'bg-primary text-primary-foreground' : 'bg-primary/15 text-primary'}`}>
                {step.isMatch ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary/80">
                  Step Logic
                </h4>
                <p className="text-[14px] font-medium leading-relaxed text-foreground/90">
                  {step.message}
                </p>
              </div>
            </div>
          </Card>

          {/* Variables Panel */}
          <VariablePanel
            variables={{
              'Current Node (src)': step.dfsStack.length > 0 ? `"${step.currentAirport}"` : 'N/A',
              'Itinerary Size': `${step.result.length}`,
              'Remaining Tickets': `${step.ticketsRemaining}`,
              'Current Search Path': `[${step.result.map(a => `"${a}"`).join(', ')}]`
            }}
          />
        </div>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          highlightedLines={[step.lineNumber]}
          language="typescript"
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};
