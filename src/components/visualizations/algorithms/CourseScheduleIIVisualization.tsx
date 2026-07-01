import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  currentCourse: number;
  checkingPre: number;
  cycle: number[];
  visit: number[];
  output: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function findOrder(numCourses: number, prerequisites: number[][]): number[] {
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
}`,
  python: `def findOrder(numCourses: int, prerequisites: list[list[int]]) -> list[int]:
    adj = [[] for _ in range(numCourses)]
    for course, pre in prerequisites:
        adj[course].append(pre)
    output = []
    visit = set()
    cycle = set()
    def dfs(course: int) -> bool:
        if course in cycle:
            return False
        if course in visit:
            return True
        cycle.add(course)
        for pre_course in adj[course]:
            if not dfs(pre_course):
                return False
        cycle.remove(course)
        visit.add(course)
        output.append(course)
        return True
    for i in range(numCourses):
        if not dfs(i):
            return []
    return output`,
  java: `public static class Solution {
    private List<List<Integer>> adj;
    private int[] visitStatus;
    private List<Integer> result;
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) {
            adj.add(new ArrayList<>());
        }
        for (int[] prereq : prerequisites) {
            int course = prereq[0];
            int pre = prereq[1];
            adj.get(course).add(pre);
        }
        visitStatus = new int[numCourses];
        result = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) {
            if (!dfs(i)) {
                return new int[0];
            }
        }
        int[] order = new int[numCourses];
        for (int i = 0; i < numCourses; i++) {
            order[i] = result.get(i);
        }
        return order;
    }
    private boolean dfs(int course) {
        if (visitStatus[course] == 1) {
            return false;
        }
        if (visitStatus[course] == 2) {
            return true;
        }
        visitStatus[course] = 1;
        for (int pre : adj.get(course)) {
            if (!dfs(pre)) {
                return false;
            }
        }
        visitStatus[course] = 2;
        result.add(course);
        return true;
    }
}`,
  cpp: `class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        vector<int> inDegree(numCourses, 0);
        for (const auto& pre : prerequisites) {
            int course = pre[0];
            int prerequisite = pre[1];
            adj[prerequisite].push_back(course);
            inDegree[course]++;
        }
        queue<int> q;
        for (int i = 0; i < numCourses; ++i) {
            if (inDegree[i] == 0) {
                q.push(i);
            }
        }
        vector<int> order;
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            order.push_back(u);
            for (int v : adj[u]) {
                inDegree[v]--;
                if (inDegree[v] == 0) {
                    q.push(v);
                }
            }
        }
        if (order.size() == numCourses) {
            return order;
        } else {
            return {};
        }
    }
};`
};

export const CourseScheduleIIVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const courses = 4;

  const { steps, stepLineNumbers } = useMemo(() => {
    const list: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const addStep = (
      curr: number,
      check: number,
      cyc: number[],
      vis: number[],
      out: number[],
      explanation: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, jv: number, cp: number
    ) => {
      list.push({
        currentCourse: curr,
        checkingPre: check,
        cycle: [...cyc],
        visit: [...vis],
        output: [...out],
        explanation,
        pseudoStep: pseudo,
        variables: vars
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    addStep(
      -1, -1, [], [], [],
      "We are given 4 courses. The prerequisites array defines dependencies. We need to find a valid ordering to take all courses. If impossible, return an empty array.",
      "findOrder(numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]])",
      { numCourses: 4, prerequisites: '[[1,0],[2,0],[3,1],[3,2]]' },
      1, 1, 2, 3
    );

    addStep(
      -1, -1, [], [], [],
      "Create an adjacency list to represent the graph. adj[course] will store the courses that must be completed before 'course'.",
      "SET adj = [[] for _ in range(numCourses)]",
      { adj: '[]' },
      2, 2, 6, 4
    );

    addStep(
      -1, -1, [], [], [],
      "Populate the adjacency list from the prerequisites. For example, course 3 requires 1 and 2, so adj[3] = [1, 2].",
      "FOR course, pre IN prerequisites: adj[course].append(pre)",
      { adj: '[[...], [...], [...], [...]]' },
      3, 3, 10, 6
    );

    addStep(
      -1, -1, [], [], [],
      "Initialize the output array to store the final topological ordering, and two sets: 'visit' for completed courses and 'cycle' for cycle detection in DFS.",
      "SET output = [], visit = set(), cycle = set()",
      { output: '[]', visit: 'Set()', cycle: 'Set()' },
      6, 5, 15, 12
    );

    addStep(
      0, -1, [], [], [],
      "Iterate through each course. Start DFS traversal with course 0 to resolve its prerequisites.",
      "FOR course = 0 TO numCourses - 1: dfs(0)",
      { course: 0 },
      27, 21, 17, 13
    );

    addStep(
      0, -1, [], [], [],
      "Check if course 0 is in the current recursion stack ('cycle' set). It is not, so there is no circular dependency.",
      "IF course IN cycle  →  0 IN cycle  →  False",
      { 'cycle.has(0)': false },
      10, 9, 29, 19
    );

    addStep(
      0, -1, [], [], [],
      "Check if course 0 has already been fully processed. It hasn't, so we continue DFS.",
      "IF course IN visit  →  0 IN visit  →  False",
      { 'visit.has(0)': false },
      13, 11, 32, 19
    );

    addStep(
      0, -1, [0], [], [],
      "Add course 0 to the 'cycle' set to mark it as being actively visited. This helps detect cycles if we encounter it again.",
      "cycle.add(0)",
      { cycle: '{0}' },
      16, 13, 35, 20
    );

    addStep(
      0, -1, [0], [], [],
      "Iterate through the prerequisites of course 0. Since adj[0] is empty, it has no prerequisites.",
      "FOR pre IN adj[0]  →  []",
      { 'adj[0]': '[]' },
      17, 14, 36, 23
    );

    addStep(
      0, -1, [], [0], [0],
      "Course 0 processing is complete. Remove it from 'cycle', mark it as fully 'visit'ed, and append it to our final 'output' sequence.",
      "cycle.remove(0); visit.add(0); output.append(0)",
      { cycle: '{}', visit: '{0}', output: '[0]' },
      22, 17, 41, 22
    );

    addStep(
      0, -1, [], [0], [0],
      "Return true to indicate course 0 was successfully processed without cycles.",
      "RETURN True",
      { returned: true },
      25, 20, 43, 20
    );

    addStep(
      1, -1, [], [0], [0],
      "Move to the next course in the main loop: course 1.",
      "dfs(1)",
      { course: 1 },
      27, 21, 17, 19
    );

    addStep(
      1, -1, [], [0], [0],
      "Check cycle set for course 1. Not found.",
      "IF course IN cycle  →  1 IN cycle  →  False",
      { 'cycle.has(1)': false },
      10, 9, 29, 19
    );

    addStep(
      1, -1, [], [0], [0],
      "Check visit set for course 1. Not found.",
      "IF course IN visit  →  1 IN visit  →  False",
      { 'visit.has(1)': false },
      13, 11, 32, 19
    );

    addStep(
      1, -1, [1], [0], [0],
      "Add course 1 to 'cycle' set to start processing its dependencies.",
      "cycle.add(1)",
      { cycle: '{1}' },
      16, 13, 35, 20
    );

    addStep(
      1, 0, [1], [0], [0],
      "Course 1 has a prerequisite: course 0. Recursively call DFS for course 0.",
      "dfs(0)",
      { 'adj[1]': '[0]', pre: 0 },
      18, 15, 37, 23
    );

    addStep(
      1, 0, [1], [0], [0],
      "Inside dfs(0), we check 'visit'. Since course 0 is already fully processed, we immediately return true. We don't need to process it again.",
      "IF course IN visit  →  0 IN visit  →  True",
      { 'visit.has(0)': true },
      13, 11, 32, 19
    );

    addStep(
      1, -1, [], [0, 1], [0, 1],
      "All prerequisites for course 1 are satisfied. Remove from 'cycle', add to 'visit', and push to 'output'.",
      "cycle.remove(1); visit.add(1); output.append(1)",
      { cycle: '{}', visit: '{0, 1}', output: '[0, 1]' },
      22, 17, 41, 22
    );

    addStep(
      1, -1, [], [0, 1], [0, 1],
      "Return true from dfs(1).",
      "RETURN True",
      { returned: true },
      25, 20, 43, 20
    );

    addStep(
      2, -1, [], [0, 1], [0, 1],
      "Move to course 2 in the main loop.",
      "dfs(2)",
      { course: 2 },
      27, 21, 17, 19
    );

    addStep(
      2, -1, [], [0, 1], [0, 1],
      "Course 2 is not in 'cycle' set.",
      "IF course IN cycle  →  2 IN cycle  →  False",
      { 'cycle.has(2)': false },
      10, 9, 29, 19
    );

    addStep(
      2, -1, [], [0, 1], [0, 1],
      "Course 2 is not in 'visit' set.",
      "IF course IN visit  →  2 IN visit  →  False",
      { 'visit.has(2)': false },
      13, 11, 32, 19
    );

    addStep(
      2, -1, [2], [0, 1], [0, 1],
      "Add course 2 to 'cycle' set.",
      "cycle.add(2)",
      { cycle: '{2}' },
      16, 13, 35, 20
    );

    addStep(
      2, 0, [2], [0, 1], [0, 1],
      "Course 2 requires course 0. Recursively call DFS for course 0.",
      "dfs(0)",
      { 'adj[2]': '[0]', pre: 0 },
      18, 15, 37, 23
    );

    addStep(
      2, 0, [2], [0, 1], [0, 1],
      "Course 0 is already in 'visit' set, so dfs(0) immediately returns true.",
      "IF course IN visit  →  0 IN visit  →  True",
      { 'visit.has(0)': true },
      13, 11, 32, 19
    );

    addStep(
      2, -1, [], [0, 1, 2], [0, 1, 2],
      "Prerequisites for course 2 are satisfied. Process and add course 2 to 'output'.",
      "cycle.remove(2); visit.add(2); output.append(2)",
      { cycle: '{}', visit: '{0, 1, 2}', output: '[0, 1, 2]' },
      22, 17, 41, 22
    );

    addStep(
      2, -1, [], [0, 1, 2], [0, 1, 2],
      "Return true from dfs(2).",
      "RETURN True",
      { returned: true },
      25, 20, 43, 20
    );

    addStep(
      3, -1, [], [0, 1, 2], [0, 1, 2],
      "Move to course 3 in the main loop.",
      "dfs(3)",
      { course: 3 },
      27, 21, 17, 19
    );

    addStep(
      3, -1, [], [0, 1, 2], [0, 1, 2],
      "Course 3 is not in 'cycle'.",
      "IF course IN cycle  →  3 IN cycle  →  False",
      { 'cycle.has(3)': false },
      10, 9, 29, 19
    );

    addStep(
      3, -1, [], [0, 1, 2], [0, 1, 2],
      "Course 3 is not in 'visit'.",
      "IF course IN visit  →  3 IN visit  →  False",
      { 'visit.has(3)': false },
      13, 11, 32, 19
    );

    addStep(
      3, -1, [3], [0, 1, 2], [0, 1, 2],
      "Add course 3 to 'cycle' set.",
      "cycle.add(3)",
      { cycle: '{3}' },
      16, 13, 35, 20
    );

    addStep(
      3, 1, [3], [0, 1, 2], [0, 1, 2],
      "Course 3 requires courses 1 and 2. Call DFS for the first prerequisite: course 1.",
      "dfs(1)",
      { 'adj[3]': '[1, 2]', pre: 1 },
      18, 15, 37, 23
    );

    addStep(
      3, 1, [3], [0, 1, 2], [0, 1, 2],
      "Course 1 is already fully processed (in 'visit' set). dfs(1) returns true.",
      "IF course IN visit  →  1 IN visit  →  True",
      { 'visit.has(1)': true },
      13, 11, 32, 19
    );

    addStep(
      3, 2, [3], [0, 1, 2], [0, 1, 2],
      "Call DFS for the next prerequisite of course 3: course 2.",
      "dfs(2)",
      { pre: 2 },
      18, 15, 37, 23
    );

    addStep(
      3, 2, [3], [0, 1, 2], [0, 1, 2],
      "Course 2 is already fully processed (in 'visit' set). dfs(2) returns true.",
      "IF course IN visit  →  2 IN visit  →  True",
      { 'visit.has(2)': true },
      13, 11, 32, 19
    );

    addStep(
      3, -1, [], [0, 1, 2, 3], [0, 1, 2, 3],
      "All prerequisites for course 3 are satisfied! Remove from 'cycle', add to 'visit' and 'output'.",
      "cycle.remove(3); visit.add(3); output.append(3)",
      { cycle: '{}', visit: '{0, 1, 2, 3}', output: '[0, 1, 2, 3]' },
      22, 17, 41, 22
    );

    addStep(
      3, -1, [], [0, 1, 2, 3], [0, 1, 2, 3],
      "Return true from dfs(3).",
      "RETURN True",
      { returned: true },
      25, 20, 43, 20
    );

    addStep(
      -1, -1, [], [0, 1, 2, 3], [0, 1, 2, 3],
      "Main loop finished successfully without finding any cycles. Return the final constructed topological ordering.",
      "RETURN output  →  [0, 1, 2, 3]",
      { output: '[0, 1, 2, 3]' },
      32, 24, 26, 30
    );

    return { steps: list, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <Card className="p-6">
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
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30 animate-pulse'
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

          <Card className="p-6">
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

          <Card className="p-4 bg-primary/5 border border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
          </Card>

          <VariablePanel variables={step.variables} />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStep}
          onLanguageChange={() => setCurrentStep(0)}
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
export default CourseScheduleIIVisualization;
