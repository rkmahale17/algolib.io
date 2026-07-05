import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Info, CheckCircle2, Plane, Navigation } from 'lucide-react';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  adj: Record<string, string[]>;
  result: string[];
  ticketsRemaining: number;
  currentAirport: string;
  message: string;
  isMatch?: boolean;
  dfsStack: string[];
  highlightedTickets: number[];
  usedTickets: number[];
  backtrackedTicket: number | null;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function findItinerary(tickets: string[][]): string[] {
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
}`,
  python: `import collections

def findItinerary(tickets: list[list[str]]) -> list[str]:
    adj = collections.defaultdict(list)
    tickets.sort(key=lambda x: (x[0], x[1]))
    for src, dst in tickets:
        adj[src].append(dst)
    result: list[str] = ["JFK"]
    num_tickets = len(tickets)
    def dfs(src: str) -> bool:
        if len(result) == num_tickets + 1:
            return True
        temp_destinations = list(adj[src])
        for i in range(len(temp_destinations)):
            next_airport = temp_destinations[i]
            adj[src].pop(i)
            result.append(next_airport)
            if dfs(next_airport):
                return True
            adj[src].insert(i, next_airport)
            result.pop()
        return False
    dfs("JFK")
    return result`,
  java: `public static class Solution {
    private Map<String, List<String>> adj;
    private List<String> result;
    private int numTickets;
    public List<String> findItinerary(List<List<String>> tickets) {
        adj = new HashMap<>();
        result = new ArrayList<>();
        numTickets = tickets.size();
        for (List<String> ticket : tickets) {
            adj.putIfAbsent(ticket.get(0), new ArrayList<>());
        }
        Collections.sort(tickets, (a, b) -> {
            int cmp = a.get(0).compareTo(b.get(0));
            if (cmp == 0) {
                return a.get(1).compareTo(b.get(1));
            }
            return cmp;
        });
        for (List<String> ticket : tickets) {
            adj.get(ticket.get(0)).add(ticket.get(1));
        }
        result.add("JFK");
        dfs("JFK");
        return result;
    }
    private boolean dfs(String src) {
        if (result.size() == numTickets + 1) {
            return true;
        }
        if (!adj.containsKey(src)) {
            return false;
        }
        List<String> destinations = new ArrayList<>(adj.get(src));
        for (int i = 0; i < destinations.size(); i++) {
            String next = destinations.get(i);
            adj.get(src).remove(i);
            result.add(next);
            if (dfs(next)) {
                return true;
            }
            adj.get(src).add(i, next);
            result.remove(result.size() - 1);
        }
        return false;
    }
}`,
  cpp: `class Solution {
public:
    map<string, vector<string>> adj;
    vector<string> result;
    int numTickets;
    vector<string> findItinerary(vector<vector<string>>& tickets) {
        numTickets = tickets.size();
        sort(tickets.begin(), tickets.end(), [](const vector<string>& a, const vector<string>& b) {
            if (a[0] == b[0]) {
                return a[1] < b[1];
            }
            return a[0] < b[0];
        });
        for (const auto& ticket : tickets) {
            adj[ticket[0]].push_back(ticket[1]);
        }
        result.push_back("JFK");
        dfs("JFK");
        return result;
    }
    bool dfs(string src) {
        if (result.size() == numTickets + 1) {
            return true;
        }
        vector<string> temp_destinations = adj[src];
        for (int i = 0; i < temp_destinations.size(); ++i) {
            string next_airport = temp_destinations[i];
            adj[src].erase(adj[src].begin() + i);
            result.push_back(next_airport);
            if (dfs(next_airport)) {
                return true;
            }
            adj[src].insert(adj[src].begin() + i, next_airport);
            result.pop_back();
        }
        return false;
    }
};`
};

export const ReconstructItineraryVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const tickets = useMemo(() => [
    { from: "JFK", to: "KUL" }, // Index 0 (lexicographically 1st from JFK)
    { from: "JFK", to: "NRT" }, // Index 1
    { from: "NRT", to: "JFK" }  // Index 2
  ], []);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const getVariables = (currentAirport: string, result: string[], ticketsRemaining: number) => {
      return {
        'Current Node (src)': result.length > 0 ? `"${currentAirport}"` : 'N/A',
        'Itinerary Size': `${result.length}`,
        'Remaining Tickets': `${ticketsRemaining}`,
        'Current Search Path': `[${result.map(a => `"${a}"`).join(', ')}]`
      };
    };

    const pushStep = (
      ts: number, py: number, jv: number, cp: number,
      message: string,
      pseudo: string,
      adj: Record<string, string[]>,
      result: string[],
      ticketsRemaining: number,
      currentAirport: string,
      dfsStack: string[],
      highlightedTickets: number[],
      usedTickets: number[],
      backtrackedTicket: number | null,
      isMatch = false
    ) => {
      s.push({
        adj,
        result: [...result],
        ticketsRemaining,
        currentAirport,
        message,
        isMatch,
        dfsStack: [...dfsStack],
        highlightedTickets: [...highlightedTickets],
        usedTickets: [...usedTickets],
        backtrackedTicket,
        pseudoStep: pseudo,
        variables: getVariables(currentAirport, result, ticketsRemaining)
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    pushStep(
      1, 3, 5, 6,
      "Initialize empty adjacency list and itinerary starting at 'JFK'.",
      "findItinerary(tickets)",
      {}, ["JFK"], 3, "JFK", [], [], [], null
    );

    pushStep(
      6, 5, 12, 8,
      "Sort tickets lexicographically and build adjacency list. JFK maps to ['KUL', 'NRT'], and NRT maps to ['JFK'].",
      "tickets.sort()",
      { JFK: ["KUL", "NRT"], NRT: ["JFK"], KUL: [] }, ["JFK"], 3, "JFK", [], [], [], null
    );

    pushStep(
      36, 23, 23, 18,
      "Initiate itinerary search with DFS from 'JFK'. Target itinerary length is 4 airports (3 tickets + 1).",
      "dfs(\"JFK\")",
      { JFK: ["KUL", "NRT"], NRT: ["JFK"], KUL: [] }, ["JFK"], 3, "JFK", ["JFK"], [], [], null
    );

    pushStep(
      24, 14, 34, 26,
      "DFS('JFK'): Loop over sorted destination targets. Try first option: 'KUL'.",
      "FOR next in adj[src]  →  KUL",
      { JFK: ["KUL", "NRT"], NRT: ["JFK"], KUL: [] }, ["JFK"], 3, "JFK", ["JFK"], [0], [], null
    );

    pushStep(
      26, 16, 36, 28,
      "Use ticket JFK ➔ KUL. Remove 'KUL' from JFK's options and append 'KUL' to current itinerary.",
      "adj[src].pop(0), result.append(next)",
      { JFK: ["NRT"], NRT: ["JFK"], KUL: [] }, ["JFK", "KUL"], 2, "KUL", ["JFK"], [], [0], null
    );

    pushStep(
      28, 18, 38, 30,
      "Recurse: Call DFS('KUL') to continue journey.",
      "dfs(\"KUL\")",
      { JFK: ["NRT"], NRT: ["JFK"], KUL: [] }, ["JFK", "KUL"], 2, "KUL", ["JFK", "KUL"], [], [0], null
    );

    pushStep(
      20, 13, 30, 25,
      "DFS('KUL'): Outgoing check. KUL has no outgoing flights (dead end) and we haven't used all tickets. This search branch fails.",
      "IF src NOT in adj  →  False",
      { JFK: ["NRT"], NRT: ["JFK"], KUL: [] }, ["JFK", "KUL"], 2, "KUL", ["JFK", "KUL"], [], [0], null
    );

    pushStep(
      34, 22, 44, 36,
      "Return false from DFS('KUL') back to DFS('JFK').",
      "RETURN False",
      { JFK: ["NRT"], NRT: ["JFK"], KUL: [] }, ["JFK", "KUL"], 2, "KUL", ["JFK", "KUL"], [], [0], null
    );

    pushStep(
      31, 20, 41, 33,
      "Backtrack! Pop 'KUL' from itinerary and restore flight JFK ➔ KUL back to available choices.",
      "adj[src].insert(i, next), result.pop()",
      { JFK: ["KUL", "NRT"], NRT: ["JFK"], KUL: [] }, ["JFK"], 3, "JFK", ["JFK"], [], [], 0
    );

    pushStep(
      24, 14, 34, 26,
      "DFS('JFK'): Advance loop. Try next option: 'NRT'.",
      "FOR next in adj[src]  →  NRT",
      { JFK: ["KUL", "NRT"], NRT: ["JFK"], KUL: [] }, ["JFK"], 3, "JFK", ["JFK"], [1], [], null
    );

    pushStep(
      26, 16, 36, 28,
      "Use ticket JFK ➔ NRT. Remove 'NRT' from JFK's options and append 'NRT' to itinerary.",
      "adj[src].pop(1), result.append(next)",
      { JFK: ["KUL"], NRT: ["JFK"], KUL: [] }, ["JFK", "NRT"], 2, "NRT", ["JFK"], [], [1], null
    );

    pushStep(
      28, 18, 38, 30,
      "Recurse: Call DFS('NRT') to find next connection.",
      "dfs(\"NRT\")",
      { JFK: ["KUL"], NRT: ["JFK"], KUL: [] }, ["JFK", "NRT"], 2, "NRT", ["JFK", "NRT"], [], [1], null
    );

    pushStep(
      24, 14, 34, 26,
      "DFS('NRT'): Loop over targets. Try first option: 'JFK'.",
      "FOR next in adj[src]  →  JFK",
      { JFK: ["KUL"], NRT: ["JFK"], KUL: [] }, ["JFK", "NRT"], 2, "NRT", ["JFK", "NRT"], [2], [1], null
    );

    pushStep(
      26, 16, 36, 28,
      "Use ticket NRT ➔ JFK. Remove 'JFK' from NRT's options and append 'JFK' to itinerary.",
      "adj[src].pop(0), result.append(next)",
      { JFK: ["KUL"], NRT: [], KUL: [] }, ["JFK", "NRT", "JFK"], 1, "JFK", ["JFK", "NRT"], [], [1, 2], null
    );

    pushStep(
      28, 18, 38, 30,
      "Recurse: Call DFS('JFK') once more.",
      "dfs(\"JFK\")",
      { JFK: ["KUL"], NRT: [], KUL: [] }, ["JFK", "NRT", "JFK"], 1, "JFK", ["JFK", "NRT", "JFK"], [], [1, 2], null
    );

    pushStep(
      24, 14, 34, 26,
      "DFS('JFK') (level 2): Loop over targets. Try option: 'KUL'.",
      "FOR next in adj[src]  →  KUL",
      { JFK: ["KUL"], NRT: [], KUL: [] }, ["JFK", "NRT", "JFK"], 1, "JFK", ["JFK", "NRT", "JFK"], [0], [1, 2], null
    );

    pushStep(
      26, 16, 36, 28,
      "Use ticket JFK ➔ KUL. Remove 'KUL' from JFK's options and append 'KUL' to itinerary.",
      "adj[src].pop(0), result.append(next)",
      { JFK: [], NRT: [], KUL: [] }, ["JFK", "NRT", "JFK", "KUL"], 0, "KUL", ["JFK", "NRT", "JFK"], [], [0, 1, 2], null
    );

    pushStep(
      28, 18, 38, 30,
      "Recurse: Call DFS('KUL').",
      "dfs(\"KUL\")",
      { JFK: [], NRT: [], KUL: [] }, ["JFK", "NRT", "JFK", "KUL"], 0, "KUL", ["JFK", "NRT", "JFK", "KUL"], [], [0, 1, 2], null
    );

    pushStep(
      17, 11, 27, 22,
      "DFS('KUL'): Check success condition. Itinerary size is 4 (target size 3 + 1 reached). All tickets successfully utilized! Return true.",
      "IF len(result) == num_tickets + 1  →  True",
      { JFK: [], NRT: [], KUL: [] }, ["JFK", "NRT", "JFK", "KUL"], 0, "KUL", ["JFK", "NRT", "JFK", "KUL"], [], [0, 1, 2], null,
      true
    );

    pushStep(
      37, 24, 24, 19,
      "Success propagates back to all callers. Return final itinerary result.",
      "RETURN result",
      { JFK: [], NRT: [], KUL: [] }, ["JFK", "NRT", "JFK", "KUL"], 0, "KUL", [], [], [0, 1, 2], null,
      true
    );

    return { steps: s, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStep] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  return (
    <div className="space-y-6">
      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
            {/* Main Visual Board */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border border-border/50 relative overflow-hidden min-h-[440px] flex flex-col shadow-lg">
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
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-350 z-10 ${borderClass} ${bgClass}`}>
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
                      <Card key={idx} className={`p-3 border flex flex-col justify-between transition-all duration-205 ${borderClass}`}>
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
                    {idx > 0 && <span className="text-muted-foreground/30 text-xs font-bold">➔</span>}
                    <div className={`w-8 h-8 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center border shadow-sm transition-all duration-200 ${
                      idx === step.result.length - 1 && step.dfsStack.length > 0
                        ? 'bg-amber-500/25 border-amber-500 text-amber-700 dark:text-amber-300'
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
          </div>
        }
        rightContent={
          <div className="space-y-4">
            <VisualizationCodePanel
              languages={languages}
              stepLineNumbers={stepLineNumbers}
              pseudoSteps={pseudoSteps}
              activeStepIndex={currentStep}
              onLanguageChange={() => setCurrentStep(0)}
            />
            {/* Commentary */}
            <Card className={`p-4 border-l-4 relative overflow-hidden transition-all duration-305 shadow-sm min-h-[70px] flex items-center ${
              step.isMatch ? 'bg-primary/10 border-primary' : 'bg-primary/5 border-primary/20'
            }`}>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl shrink-0 bg-primary/10 text-primary">
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                    Step Logic
                  </h4>
                  <p className="text-xs font-medium leading-relaxed text-foreground/90">
                    {step.message}
                  </p>
                </div>
              </div>
            </Card>

            {/* Variables Panel */}
            <VariablePanel variables={step.variables} />
          </div>
        }
        controls={
          <SimpleStepControls
            currentStep={currentStep}
            totalSteps={steps.length}
            onStepChange={setCurrentStep}
          />
        }
      />
    </div>
  );
};
export default ReconstructItineraryVisualization;
