import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  courses: number;
  prerequisites: [number, number][];
  currentCourse: number;
  visiting: number[];
  visited: number[];
  hasCycle: boolean;
  message: string;
  lineNumber: number;
}

export const CourseScheduleVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { courses: 4, prerequisites: [[1,0],[2,0],[3,1],[3,2]], currentCourse: -1, visiting: [], visited: [], hasCycle: false, message: "4 courses, prerequisites: [1,0]=take 0 before 1. Check for cycles", lineNumber: 2 },
    { courses: 4, prerequisites: [[1,0],[2,0],[3,1],[3,2]], currentCourse: 0, visiting: [0], visited: [], hasCycle: false, message: "DFS from course 0. Mark as visiting", lineNumber: 13 },
    { courses: 4, prerequisites: [[1,0],[2,0],[3,1],[3,2]], currentCourse: 0, visiting: [], visited: [0], hasCycle: false, message: "Course 0 has no prerequisites. Mark as visited", lineNumber: 18 },
    { courses: 4, prerequisites: [[1,0],[2,0],[3,1],[3,2]], currentCourse: 1, visiting: [1], visited: [0], hasCycle: false, message: "DFS from course 1. Depends on course 0 (visited ✓)", lineNumber: 13 },
    { courses: 4, prerequisites: [[1,0],[2,0],[3,1],[3,2]], currentCourse: 1, visiting: [], visited: [0, 1], hasCycle: false, message: "Course 1 valid. Mark as visited", lineNumber: 18 },
    { courses: 4, prerequisites: [[1,0],[2,0],[3,1],[3,2]], currentCourse: 2, visiting: [2], visited: [0, 1], hasCycle: false, message: "DFS from course 2. Depends on course 0 (visited ✓)", lineNumber: 13 },
    { courses: 4, prerequisites: [[1,0],[2,0],[3,1],[3,2]], currentCourse: 2, visiting: [], visited: [0, 1, 2], hasCycle: false, message: "Course 2 valid. Mark as visited", lineNumber: 18 },
    { courses: 4, prerequisites: [[1,0],[2,0],[3,1],[3,2]], currentCourse: 3, visiting: [3], visited: [0, 1, 2], hasCycle: false, message: "DFS from course 3. Depends on 1 and 2 (both visited ✓)", lineNumber: 13 },
    { courses: 4, prerequisites: [[1,0],[2,0],[3,1],[3,2]], currentCourse: 3, visiting: [], visited: [0, 1, 2, 3], hasCycle: false, message: "No cycle detected! Can finish all courses. Time: O(V+E), Space: O(V)", lineNumber: 24 }
  ];

  const code = `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const graph = new Map<number, number[]>();
  for (const [course, prereq] of prerequisites) {
    if (!graph.has(course)) graph.set(course, []);
    graph.get(course)!.push(prereq);
  }
  
  const visiting = new Set<number>();
  const visited = new Set<number>();
  
  function hasCycle(course: number): boolean {
    if (visiting.has(course)) return true;
    if (visited.has(course)) return false;
    
    visiting.add(course);
    for (const prereq of graph.get(course) || []) {
      if (hasCycle(prereq)) return true;
    }
    visiting.delete(course);
    visited.add(course);
    return false;
  }
  
  for (let i = 0; i < numCourses; i++) {
    if (hasCycle(i)) return false;
  }
  return true;
}`;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(0)} disabled={currentStepIndex === 0}><RotateCcw className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0}><SkipBack className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1}><SkipForward className="h-4 w-4" /></Button>
          </div>
          <div className="text-sm">Step {currentStepIndex + 1} / {steps.length}</div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Course Schedule</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Courses:</div>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: currentStep.courses }, (_, i) => (
                  <div key={i} className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg ${
                    i === currentStep.currentCourse ? 'bg-primary text-primary-foreground ring-4 ring-primary' :
                    currentStep.visited.includes(i) ? 'bg-green-500/30' :
                    currentStep.visiting.includes(i) ? 'bg-yellow-500/30' :
                    'bg-muted'
                  }`}>
                    {i}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Prerequisites:</div>
              <div className="space-y-1 text-sm font-mono">
                {currentStep.prerequisites.map((prereq, idx) => (
                  <div key={idx} className="p-2 bg-muted/50 rounded">[{prereq[0]}] needs [{prereq[1]}]</div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Status:</div>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-yellow-500/30 rounded-full"></div> Visiting</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-green-500/30 rounded-full"></div> Visited</div>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
          </div>
        </Card>
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript</h3>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter language="typescript" style={vscDarkPlus} showLineNumbers lineProps={(lineNumber) => ({ style: { backgroundColor: lineNumber === currentStep.lineNumber ? 'rgba(255, 255, 0, 0.2)' : 'transparent', display: 'block' } })}>
              {code}
            </SyntaxHighlighter>
          </div>
        </Card>
      </div>
    </div>
  );
};
