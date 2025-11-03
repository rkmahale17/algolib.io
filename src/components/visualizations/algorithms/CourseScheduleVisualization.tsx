import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  currentCourse: number | null;
  visiting: Set<number>;
  visited: Set<number>;
  hasCycle: boolean;
  highlightedLine: number;
  description: string;
}

export const CourseScheduleVisualization = () => {
  const numCourses = 4;
  const prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [steps, setSteps] = useState<Step[]>([]);

  const code = `def canFinish(numCourses, prerequisites):
    graph = {i: [] for i in range(numCourses)}
    for course, prereq in prerequisites:
        graph[course].append(prereq)
    
    visiting = set()
    visited = set()
    
    def dfs(course):
        if course in visiting:
            return False  # Cycle detected
        if course in visited:
            return True
        
        visiting.add(course)
        for prereq in graph[course]:
            if not dfs(prereq):
                return False
        visiting.remove(course)
        visited.add(course)
        return True
    
    for course in range(numCourses):
        if not dfs(course):
            return False
    return True`;

  useEffect(() => {
    generateSteps();
  }, []);

  const generateSteps = () => {
    const newSteps: Step[] = [];
    const graph: { [key: number]: number[] } = {};
    
    for (let i = 0; i < numCourses; i++) {
      graph[i] = [];
    }
    for (const [course, prereq] of prerequisites) {
      graph[course].push(prereq);
    }
    
    const visiting = new Set<number>();
    const visited = new Set<number>();
    let hasCycle = false;

    newSteps.push({
      currentCourse: null,
      visiting: new Set(),
      visited: new Set(),
      hasCycle: false,
      highlightedLine: 0,
      description: "Build dependency graph and detect cycles using DFS"
    });

    const dfs = (course: number): boolean => {
      if (visiting.has(course)) {
        newSteps.push({
          currentCourse: course,
          visiting: new Set(visiting),
          visited: new Set(visited),
          hasCycle: true,
          highlightedLine: 9,
          description: `Cycle detected at course ${course}!`
        });
        hasCycle = true;
        return false;
      }

      if (visited.has(course)) {
        newSteps.push({
          currentCourse: course,
          visiting: new Set(visiting),
          visited: new Set(visited),
          hasCycle: false,
          highlightedLine: 11,
          description: `Course ${course} already visited, skip`
        });
        return true;
      }

      visiting.add(course);
      newSteps.push({
        currentCourse: course,
        visiting: new Set(visiting),
        visited: new Set(visited),
        hasCycle: false,
        highlightedLine: 13,
        description: `Start visiting course ${course}`
      });

      for (const prereq of graph[course]) {
        newSteps.push({
          currentCourse: course,
          visiting: new Set(visiting),
          visited: new Set(visited),
          hasCycle: false,
          highlightedLine: 15,
          description: `Check prerequisite ${prereq} for course ${course}`
        });
        
        if (!dfs(prereq)) {
          return false;
        }
      }

      visiting.delete(course);
      visited.add(course);
      newSteps.push({
        currentCourse: course,
        visiting: new Set(visiting),
        visited: new Set(visited),
        hasCycle: false,
        highlightedLine: 18,
        description: `Course ${course} fully processed`
      });

      return true;
    };

    for (let course = 0; course < numCourses; course++) {
      if (!visited.has(course)) {
        if (!dfs(course)) {
          break;
        }
      }
    }

    newSteps.push({
      currentCourse: null,
      visiting: new Set(visiting),
      visited: new Set(visited),
      hasCycle: hasCycle,
      highlightedLine: 23,
      description: hasCycle ? "Cannot finish all courses (cycle exists)" : "Can finish all courses!"
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, speed]);

  if (steps.length === 0) return <div>Loading...</div>;

  const step = steps[currentStep];

  const getCourseColor = (course: number) => {
    if (step.currentCourse === course) return 'bg-yellow-200 dark:bg-yellow-900 border-yellow-500';
    if (step.visiting.has(course)) return 'bg-blue-200 dark:bg-blue-900 border-blue-500';
    if (step.visited.has(course)) return 'bg-green-100 dark:bg-green-900/20 border-green-500';
    return 'bg-muted border-border';
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Course Schedule (Cycle Detection)</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="font-semibold">Prerequisites:</div>
            {prerequisites.map(([course, prereq], i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="px-2 py-1 bg-muted rounded">Course {course}</span>
                <span>→ requires →</span>
                <span className="px-2 py-1 bg-muted rounded">Course {prereq}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: numCourses }, (_, i) => (
              <div
                key={i}
                className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center font-bold ${getCourseColor(i)}`}
              >
                {i}
              </div>
            ))}
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-200 dark:bg-yellow-900 border-2 border-yellow-500"></div>
              <span className="text-sm">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-200 dark:bg-blue-900 border-2 border-blue-500"></div>
              <span className="text-sm">Visiting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/20 border-2 border-green-500"></div>
              <span className="text-sm">Visited</span>
            </div>
          </div>

          <div className={`p-3 rounded ${step.hasCycle ? 'bg-red-100 dark:bg-red-900/20' : 'bg-muted'}`}>
            {step.description}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeHighlighter
          code={code}
          highlightedLine={step.highlightedLine}
          language="Python"
        />
        <VariablePanel
          variables={{
            current: step.currentCourse !== null ? step.currentCourse : "null",
            visiting: step.visiting.size,
            visited: step.visited.size,
            hasCycle: step.hasCycle ? "yes" : "no"
          }}
        />
      </div>

      <StepControls
        currentStep={currentStep}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStepForward={() => setCurrentStep(Math.min(currentStep + 1, steps.length - 1))}
        onStepBack={() => setCurrentStep(Math.max(currentStep - 1, 0))}
        onReset={() => { setCurrentStep(0); setIsPlaying(false); }}
        speed={speed}
        onSpeedChange={setSpeed}
      />
    </div>
  );
};
