import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  courses: number;
  prerequisites: [number, number][];
  currentCourse: number;
  visiting: number[];
  visited: number[];
  hasCycle: boolean;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const CourseScheduleVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const prerequisites: [number, number][] = [[1, 0], [2, 0], [3, 1], [3, 2]];
  const courses = 4;

  const steps: Step[] = [
    {
      courses,
      prerequisites,
      currentCourse: -1,
      visiting: [],
      visited: [],
      hasCycle: false,
      variables: { numCourses: 4, prerequisites: '[[1,0],[2,0],[3,1],[3,2]]' },
      explanation: "4 courses with prerequisites. [1,0] means: take course 0 before course 1. Check if all courses can be completed (no cycles).",
      highlightedLines: [1, 2],
      lineExecution: "function canFinish(numCourses: number, prerequisites: number[][]): boolean"
    },
    {
      courses,
      prerequisites,
      currentCourse: -1,
      visiting: [],
      visited: [],
      hasCycle: false,
      variables: { graph: 'Map()' },
      explanation: "Build adjacency list: graph[course] = array of prerequisites for that course.",
      highlightedLines: [3],
      lineExecution: "const graph = new Map<number, number[]>();"
    },
    {
      courses,
      prerequisites,
      currentCourse: -1,
      visiting: [],
      visited: [],
      hasCycle: false,
      variables: { graph: '{1:[0], 2:[0], 3:[1,2]}' },
      explanation: "Populate graph from prerequisites. Course 3 requires both courses 1 and 2.",
      highlightedLines: [4, 5, 6],
      lineExecution: "for (const [course, prereq] of prerequisites) graph.set(...)"
    },
    {
      courses,
      prerequisites,
      currentCourse: -1,
      visiting: [],
      visited: [],
      hasCycle: false,
      variables: { visiting: 'Set()', visited: 'Set()' },
      explanation: "Create two sets: 'visiting' tracks current DFS path (cycle detection), 'visited' tracks completed courses.",
      highlightedLines: [8, 9],
      lineExecution: "const visiting = new Set(); const visited = new Set();"
    },
    {
      courses,
      prerequisites,
      currentCourse: 0,
      visiting: [],
      visited: [],
      hasCycle: false,
      variables: { i: 0, course: 0 },
      explanation: "Start checking courses: i = 0. Call hasCycle(0) to check if course 0 has cycle.",
      highlightedLines: [23, 24],
      lineExecution: "for (let i = 0; i < numCourses; i++) if (hasCycle(i)) ..."
    },
    {
      courses,
      prerequisites,
      currentCourse: 0,
      visiting: [],
      visited: [],
      hasCycle: false,
      variables: { course: 0, 'visiting.has(0)': false },
      explanation: "Check if course 0 is in current DFS path: visiting.has(0)? No, no cycle yet.",
      highlightedLines: [12],
      lineExecution: "if (visiting.has(course)) return true; // false"
    },
    {
      courses,
      prerequisites,
      currentCourse: 0,
      visiting: [],
      visited: [],
      hasCycle: false,
      variables: { 'visited.has(0)': false },
      explanation: "Check if course 0 already processed: visited.has(0)? No, continue DFS.",
      highlightedLines: [13],
      lineExecution: "if (visited.has(course)) return false; // false"
    },
    {
      courses,
      prerequisites,
      currentCourse: 0,
      visiting: [0],
      visited: [],
      hasCycle: false,
      variables: { visiting: '{0}' },
      explanation: "Mark course 0 as visiting (in current DFS path). Used for cycle detection.",
      highlightedLines: [15],
      lineExecution: "visiting.add(course); // visiting = {0}"
    },
    {
      courses,
      prerequisites,
      currentCourse: 0,
      visiting: [0],
      visited: [],
      hasCycle: false,
      variables: { prerequisites: '[]' },
      explanation: "Check prerequisites for course 0: none. Empty array, loop doesn't execute.",
      highlightedLines: [16, 17],
      lineExecution: "for (const prereq of graph.get(course) || []) // []"
    },
    {
      courses,
      prerequisites,
      currentCourse: 0,
      visiting: [],
      visited: [],
      hasCycle: false,
      variables: { visiting: '{}' },
      explanation: "Course 0 DFS complete. Remove from visiting set (no longer in current path).",
      highlightedLines: [19],
      lineExecution: "visiting.delete(course); // visiting = {}"
    },
    {
      courses,
      prerequisites,
      currentCourse: 0,
      visiting: [],
      visited: [0],
      hasCycle: false,
      variables: { visited: '{0}' },
      explanation: "Mark course 0 as visited (fully processed). Can be safely taken.",
      highlightedLines: [20],
      lineExecution: "visited.add(course); // visited = {0}"
    },
    {
      courses,
      prerequisites,
      currentCourse: 1,
      visiting: [1],
      visited: [0],
      hasCycle: false,
      variables: { course: 1, prerequisites: '[0]' },
      explanation: "Check course 1. Prerequisite: course 0. Add 1 to visiting, recursively check prereq 0.",
      highlightedLines: [15, 16, 17],
      lineExecution: "visiting.add(1); for (const prereq of [0]) hasCycle(0)"
    },
    {
      courses,
      prerequisites,
      currentCourse: 0,
      visiting: [1],
      visited: [0],
      hasCycle: false,
      variables: { 'visited.has(0)': true },
      explanation: "Checking prereq 0: already in visited set. Return false immediately (no cycle).",
      highlightedLines: [13],
      lineExecution: "if (visited.has(course)) return false; // true, return false"
    },
    {
      courses,
      prerequisites,
      currentCourse: 1,
      visiting: [],
      visited: [0, 1],
      hasCycle: false,
      variables: { visited: '{0,1}' },
      explanation: "Course 1 valid. Remove from visiting, add to visited.",
      highlightedLines: [19, 20],
      lineExecution: "visiting.delete(1); visited.add(1);"
    },
    {
      courses,
      prerequisites,
      currentCourse: 2,
      visiting: [],
      visited: [0, 1, 2],
      hasCycle: false,
      variables: { course: 2 },
      explanation: "Check course 2. Prerequisite: course 0 (already visited). Course 2 valid.",
      highlightedLines: [15, 16, 17, 19, 20],
      lineExecution: "Process course 2: prereq 0 in visited, add 2 to visited"
    },
    {
      courses,
      prerequisites,
      currentCourse: 3,
      visiting: [3],
      visited: [0, 1, 2],
      hasCycle: false,
      variables: { course: 3, prerequisites: '[1,2]' },
      explanation: "Check course 3. Prerequisites: courses 1 and 2 (both in visited). Course 3 valid.",
      highlightedLines: [15, 16, 17],
      lineExecution: "visiting.add(3); check prereqs 1 and 2 (both visited)"
    },
    {
      courses,
      prerequisites,
      currentCourse: 3,
      visiting: [],
      visited: [0, 1, 2, 3],
      hasCycle: false,
      variables: { visited: '{0,1,2,3}' },
      explanation: "Course 3 valid. All courses processed, no cycles found!",
      highlightedLines: [19, 20],
      lineExecution: "visiting.delete(3); visited.add(3);"
    },
    {
      courses,
      prerequisites,
      currentCourse: -1,
      visiting: [],
      visited: [0, 1, 2, 3],
      hasCycle: false,
      variables: { result: true },
      explanation: "Loop complete. No cycle detected. Return true - all courses can be finished!",
      highlightedLines: [26],
      lineExecution: "return true;"
    },
    {
      courses,
      prerequisites,
      currentCourse: -1,
      visiting: [],
      visited: [0, 1, 2, 3],
      hasCycle: false,
      variables: { canFinish: true, complexity: 'O(V+E)' },
      explanation: "Algorithm complete! DFS cycle detection. Time: O(V+E) where V=courses, E=prerequisites. Space: O(V).",
      highlightedLines: [26],
      lineExecution: "Result: true (can finish all courses)"
    }
  ];

  const code = `function canFinish(
  numCourses: number, 
  prerequisites: number[][]
): boolean {
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

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`courses-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Courses</h3>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: step.courses }, (_, i) => (
                  <div
                    key={i}
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg ${
                      i === step.currentCourse
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary'
                        : step.visited.includes(i)
                        ? 'bg-green-500/30'
                        : step.visiting.includes(i)
                        ? 'bg-yellow-500/30'
                        : 'bg-muted'
                    }`}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-yellow-500/30 rounded-full"></div> Visiting
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-green-500/30 rounded-full"></div> Visited
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`prereqs-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Prerequisites</h3>
              <div className="space-y-1 text-sm font-mono">
                {step.prerequisites.map((prereq, idx) => (
                  <div key={idx} className="p-2 bg-muted/50 rounded">
                    [{prereq[0]}] needs [{prereq[1]}]
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Current Execution:</div>
                <div className="text-sm font-mono bg-background/50 p-2 rounded">
                  {step.lineExecution}
                </div>
                <div className="text-sm text-muted-foreground pt-2">
                  {step.explanation}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`variables-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <VariablePanel variables={step.variables} />
          </motion.div>
        </>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
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
