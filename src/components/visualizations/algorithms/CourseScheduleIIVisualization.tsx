import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  currentCourse: number;
  checkingPre: number;
  cycle: number[];
  visit: number[];
  output: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
}

export const CourseScheduleIIVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const courses = 4;

  const steps: Step[] = [
    {
      currentCourse: -1,
      checkingPre: -1,
      cycle: [],
      visit: [],
      output: [],
      variables: { numCourses: 4, prerequisites: '[[1,0],[2,0],[3,1],[3,2]]' },
      explanation: "We are given 4 courses. The prerequisites array defines dependencies. We need to find a valid ordering to take all courses. If impossible, return an empty array.",
      highlightedLines: [1, 2, 3, 4],
    },
    {
      currentCourse: -1,
      checkingPre: -1,
      cycle: [],
      visit: [],
      output: [],
      variables: { adj: '[]' },
      explanation: "Create an adjacency list to represent the graph. adj[course] will store the courses that must be completed before 'course'.",
      highlightedLines: [5],
    },
    {
      currentCourse: -1,
      checkingPre: -1,
      cycle: [],
      visit: [],
      output: [],
      variables: { adj: '[[...], [...], [...], [...]]' },
      explanation: "Populate the adjacency list from the prerequisites. For example, course 3 requires 1 and 2, so adj[3] = [1, 2].",
      highlightedLines: [7, 8, 9],
    },
    {
      currentCourse: -1,
      checkingPre: -1,
      cycle: [],
      visit: [],
      output: [],
      variables: { output: '[]', visit: 'Set()', cycle: 'Set()' },
      explanation: "Initialize the output array to store the final topological ordering, and two sets: 'visit' for completed courses and 'cycle' for cycle detection in DFS.",
      highlightedLines: [11, 12, 13],
    },
    {
      currentCourse: 0,
      checkingPre: -1,
      cycle: [],
      visit: [],
      output: [],
      variables: { course: 0 },
      explanation: "Iterate through each course. Start DFS traversal with course 0 to resolve its prerequisites.",
      highlightedLines: [39, 40],
    },
    {
      currentCourse: 0,
      checkingPre: -1,
      cycle: [],
      visit: [],
      output: [],
      variables: { 'cycle.has(0)': false },
      explanation: "Check if course 0 is in the current recursion stack ('cycle' set). It is not, so there is no circular dependency.",
      highlightedLines: [16, 17, 18],
    },
    {
      currentCourse: 0,
      checkingPre: -1,
      cycle: [],
      visit: [],
      output: [],
      variables: { 'visit.has(0)': false },
      explanation: "Check if course 0 has already been fully processed. It hasn't, so we continue DFS.",
      highlightedLines: [20, 21, 22],
    },
    {
      currentCourse: 0,
      checkingPre: -1,
      cycle: [0],
      visit: [],
      output: [],
      variables: { cycle: '{0}' },
      explanation: "Add course 0 to the 'cycle' set to mark it as being actively visited. This helps detect cycles if we encounter it again.",
      highlightedLines: [24],
    },
    {
      currentCourse: 0,
      checkingPre: -1,
      cycle: [0],
      visit: [],
      output: [],
      variables: { 'adj[0]': '[]' },
      explanation: "Iterate through the prerequisites of course 0. Since adj[0] is empty, it has no prerequisites.",
      highlightedLines: [26, 27, 28, 29, 30],
    },
    {
      currentCourse: 0,
      checkingPre: -1,
      cycle: [],
      visit: [0],
      output: [0],
      variables: { cycle: '{}', visit: '{0}', output: '[0]' },
      explanation: "Course 0 processing is complete. Remove it from 'cycle', mark it as fully 'visit'ed, and append it to our final 'output' sequence.",
      highlightedLines: [32, 33, 34],
    },
    {
      currentCourse: 0,
      checkingPre: -1,
      cycle: [],
      visit: [0],
      output: [0],
      variables: { returned: true },
      explanation: "Return true to indicate course 0 was successfully processed without cycles.",
      highlightedLines: [36],
    },
    {
      currentCourse: 1,
      checkingPre: -1,
      cycle: [],
      visit: [0],
      output: [0],
      variables: { course: 1 },
      explanation: "Move to the next course in the main loop: course 1.",
      highlightedLines: [39, 40],
    },
    {
      currentCourse: 1,
      checkingPre: -1,
      cycle: [],
      visit: [0],
      output: [0],
      variables: { 'cycle.has(1)': false },
      explanation: "Check cycle set for course 1. Not found.",
      highlightedLines: [16, 17, 18],
    },
    {
      currentCourse: 1,
      checkingPre: -1,
      cycle: [],
      visit: [0],
      output: [0],
      variables: { 'visit.has(1)': false },
      explanation: "Check visit set for course 1. Not found.",
      highlightedLines: [20, 21, 22],
    },
    {
      currentCourse: 1,
      checkingPre: -1,
      cycle: [1],
      visit: [0],
      output: [0],
      variables: { cycle: '{1}' },
      explanation: "Add course 1 to 'cycle' set to start processing its dependencies.",
      highlightedLines: [24],
    },
    {
      currentCourse: 1,
      checkingPre: 0,
      cycle: [1],
      visit: [0],
      output: [0],
      variables: { 'adj[1]': '[0]', pre: 0 },
      explanation: "Course 1 has a prerequisite: course 0. Recursively call DFS for course 0.",
      highlightedLines: [26, 27],
    },
    {
      currentCourse: 1,
      checkingPre: 0,
      cycle: [1],
      visit: [0],
      output: [0],
      variables: { 'visit.has(0)': true },
      explanation: "Inside dfs(0), we check 'visit'. Since course 0 is already fully processed, we immediately return true. We don't need to process it again.",
      highlightedLines: [20, 21, 22],
    },
    {
      currentCourse: 1,
      checkingPre: -1,
      cycle: [],
      visit: [0, 1],
      output: [0, 1],
      variables: { cycle: '{}', visit: '{0, 1}', output: '[0, 1]' },
      explanation: "All prerequisites for course 1 are satisfied. Remove from 'cycle', add to 'visit', and push to 'output'.",
      highlightedLines: [32, 33, 34],
    },
    {
      currentCourse: 1,
      checkingPre: -1,
      cycle: [],
      visit: [0, 1],
      output: [0, 1],
      variables: { returned: true },
      explanation: "Return true from dfs(1).",
      highlightedLines: [36],
    },
    {
      currentCourse: 2,
      checkingPre: -1,
      cycle: [],
      visit: [0, 1],
      output: [0, 1],
      variables: { course: 2 },
      explanation: "Move to course 2 in the main loop.",
      highlightedLines: [39, 40],
    },
    {
      currentCourse: 2,
      checkingPre: -1,
      cycle: [],
      visit: [0, 1],
      output: [0, 1],
      variables: { 'cycle.has(2)': false },
      explanation: "Course 2 is not in 'cycle' set.",
      highlightedLines: [16, 17, 18],
    },
    {
      currentCourse: 2,
      checkingPre: -1,
      cycle: [],
      visit: [0, 1],
      output: [0, 1],
      variables: { 'visit.has(2)': false },
      explanation: "Course 2 is not in 'visit' set.",
      highlightedLines: [20, 21, 22],
    },
    {
      currentCourse: 2,
      checkingPre: -1,
      cycle: [2],
      visit: [0, 1],
      output: [0, 1],
      variables: { cycle: '{2}' },
      explanation: "Add course 2 to 'cycle' set.",
      highlightedLines: [24],
    },
    {
      currentCourse: 2,
      checkingPre: 0,
      cycle: [2],
      visit: [0, 1],
      output: [0, 1],
      variables: { 'adj[2]': '[0]', pre: 0 },
      explanation: "Course 2 requires course 0. Recursively call DFS for course 0.",
      highlightedLines: [26, 27],
    },
    {
      currentCourse: 2,
      checkingPre: 0,
      cycle: [2],
      visit: [0, 1],
      output: [0, 1],
      variables: { 'visit.has(0)': true },
      explanation: "Course 0 is already in 'visit' set, so dfs(0) immediately returns true.",
      highlightedLines: [20, 21, 22],
    },
    {
      currentCourse: 2,
      checkingPre: -1,
      cycle: [],
      visit: [0, 1, 2],
      output: [0, 1, 2],
      variables: { cycle: '{}', visit: '{0, 1, 2}', output: '[0, 1, 2]' },
      explanation: "Prerequisites for course 2 are satisfied. Process and add course 2 to 'output'.",
      highlightedLines: [32, 33, 34],
    },
    {
      currentCourse: 2,
      checkingPre: -1,
      cycle: [],
      visit: [0, 1, 2],
      output: [0, 1, 2],
      variables: { returned: true },
      explanation: "Return true from dfs(2).",
      highlightedLines: [36],
    },
    {
      currentCourse: 3,
      checkingPre: -1,
      cycle: [],
      visit: [0, 1, 2],
      output: [0, 1, 2],
      variables: { course: 3 },
      explanation: "Move to course 3 in the main loop.",
      highlightedLines: [39, 40],
    },
    {
      currentCourse: 3,
      checkingPre: -1,
      cycle: [],
      visit: [0, 1, 2],
      output: [0, 1, 2],
      variables: { 'cycle.has(3)': false },
      explanation: "Course 3 is not in 'cycle'.",
      highlightedLines: [16, 17, 18],
    },
    {
      currentCourse: 3,
      checkingPre: -1,
      cycle: [],
      visit: [0, 1, 2],
      output: [0, 1, 2],
      variables: { 'visit.has(3)': false },
      explanation: "Course 3 is not in 'visit'.",
      highlightedLines: [20, 21, 22],
    },
    {
      currentCourse: 3,
      checkingPre: -1,
      cycle: [3],
      visit: [0, 1, 2],
      output: [0, 1, 2],
      variables: { cycle: '{3}' },
      explanation: "Add course 3 to 'cycle' set.",
      highlightedLines: [24],
    },
    {
      currentCourse: 3,
      checkingPre: 1,
      cycle: [3],
      visit: [0, 1, 2],
      output: [0, 1, 2],
      variables: { 'adj[3]': '[1, 2]', pre: 1 },
      explanation: "Course 3 requires courses 1 and 2. Call DFS for the first prerequisite: course 1.",
      highlightedLines: [26, 27],
    },
    {
      currentCourse: 3,
      checkingPre: 1,
      cycle: [3],
      visit: [0, 1, 2],
      output: [0, 1, 2],
      variables: { 'visit.has(1)': true },
      explanation: "Course 1 is already fully processed (in 'visit' set). dfs(1) returns true.",
      highlightedLines: [20, 21, 22],
    },
    {
      currentCourse: 3,
      checkingPre: 2,
      cycle: [3],
      visit: [0, 1, 2],
      output: [0, 1, 2],
      variables: { pre: 2 },
      explanation: "Call DFS for the next prerequisite of course 3: course 2.",
      highlightedLines: [26, 27],
    },
    {
      currentCourse: 3,
      checkingPre: 2,
      cycle: [3],
      visit: [0, 1, 2],
      output: [0, 1, 2],
      variables: { 'visit.has(2)': true },
      explanation: "Course 2 is already fully processed (in 'visit' set). dfs(2) returns true.",
      highlightedLines: [20, 21, 22],
    },
    {
      currentCourse: 3,
      checkingPre: -1,
      cycle: [],
      visit: [0, 1, 2, 3],
      output: [0, 1, 2, 3],
      variables: { cycle: '{}', visit: '{0, 1, 2, 3}', output: '[0, 1, 2, 3]' },
      explanation: "All prerequisites for course 3 are satisfied! Remove from 'cycle', add to 'visit' and 'output'.",
      highlightedLines: [32, 33, 34],
    },
    {
      currentCourse: 3,
      checkingPre: -1,
      cycle: [],
      visit: [0, 1, 2, 3],
      output: [0, 1, 2, 3],
      variables: { returned: true },
      explanation: "Return true from dfs(3).",
      highlightedLines: [36],
    },
    {
      currentCourse: -1,
      checkingPre: -1,
      cycle: [],
      visit: [0, 1, 2, 3],
      output: [0, 1, 2, 3],
      variables: { output: '[0, 1, 2, 3]' },
      explanation: "Main loop finished successfully without finding any cycles. Return the final constructed topological ordering.",
      highlightedLines: [45],
    }
  ];

  const code = `function findOrder(
  numCourses: number,
  prerequisites: number[][]
): number[] {
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  
  for (const [course, pre] of prerequisites) {
    adj[course].push(pre);
  }
  
  const output: number[] = [];
  const visit = new Set<number>();
  const cycle = new Set<number>();
  
  const dfs = (course: number): boolean => {
    if (cycle.has(course)) {
      return false;
    }
    
    if (visit.has(course)) {
      return true;
    }
    
    cycle.add(course);
    
    for (const pre of adj[course]) {
      if (!dfs(pre)) {
        return false;
      }
    }
    
    cycle.delete(course);
    visit.add(course);
    output.push(course);
    
    return true;
  };
  
  for (let course = 0; course < numCourses; course++) {
    if (!dfs(course)) {
      return [];
    }
  }
  
  return output;
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Courses State</h3>
            <div className="flex gap-3 flex-wrap">
              {Array.from({ length: courses }, (_, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-sm border ${
                    step.currentCourse === i || step.checkingPre === i
                      ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-md ring-4 ring-primary/20 transition-all'
                      : step.visit.includes(i)
                      ? 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30'
                      : step.cycle.includes(i)
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30'
                      : 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {i}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-amber-500/20 border border-amber-500/30 rounded-sm"></div> In Cycle (Active DFS)
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-green-500/20 border border-green-500/30 rounded-sm"></div> Visited (Completed)
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Output Topological Ordering</h3>
            <div className="flex gap-2 flex-wrap min-h-12 items-center bg-muted/30 p-2 rounded-lg border border-border/50">
              {step.output.length === 0 ? (
                <span className="text-muted-foreground text-sm italic px-2">Output array is empty</span>
              ) : (
                step.output.map((course, idx) => (
                  <div
                    key={idx}
                    className="w-10 h-10 rounded-md flex items-center justify-center bg-primary text-primary-foreground font-semibold"
                  >
                    {course}
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-4 bg-muted/50 border-l-4 border-l-primary">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-primary">Current Step Explanation:</div>
              <div className="text-sm text-foreground pt-1 leading-relaxed">
                {step.explanation}
              </div>
            </div>
          </Card>

          <VariablePanel variables={step.variables} />
        </div>
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
