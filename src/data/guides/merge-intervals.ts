export const content = `
# Merge Intervals: The Art of Combining Overlaps!

##  Introduction: The Colorful Train Tracks

Imagine you are a seven-year-old playing with your favorite set of toy trains. You have a massive, long train track stretching all the way across your living room floor. You and your friends decide to decorate the track by placing colorful stickers on different sections. 

You take your blue stickers and put them from track piece number 1 to track piece number 5. Then, your best friend takes red stickers and puts them from track piece number 4 to track piece number 8. Another friend puts green stickers from track piece number 10 to track piece number 12.

When you stand back and look at the whole train track, what do you see? 

You don't see three completely separate decorated sections. Because the blue stickers (1 to 5) and the red stickers (4 to 8) overlap at track pieces 4 and 5, they actually merge together into one giant, continuous, beautifully decorated super-section that stretches all the way from piece 1 to piece 8! The green stickers (10 to 12) are sitting all by themselves because they don't touch the others.

This exact situation happens in computer programming all the time, and the clever technique we use to solve it is called the **Merge Intervals** pattern!

---

##  What Exactly IS an Interval?

Before we dive into the magic of merging, we need to understand what an "interval" is. In simple terms, an interval is just a chunk of time or space that has a specific **start** and a specific **end**. 

Think about your daily schedule:
* Watching your favorite cartoon: Starts at 3:00 PM, Ends at 4:00 PM. (This is an interval: \`[3, 4]\`)
* Doing homework: Starts at 3:30 PM, Ends at 5:00 PM. (This is another interval: \`[3.5, 5]\`)

In computer science, we write intervals as a pair of numbers inside square brackets. The first number is the start, and the second number is the end. For example, \`[1, 5]\` means an interval that starts at 1 and ends at 5. 

We use intervals to represent all sorts of real-world data:
* **Meeting schedules** at a busy office.
* **Computer network connections** logging the start and end times of user sessions.
* **Reserving hotel rooms** for different dates.
* **Video rendering** where different effects are applied to different timestamps of a movie.

---

##  Why Do We Need To Merge Them?

Let's go back to your daily schedule. You want to watch cartoons from 3:00 to 4:00, but you also scheduled homework from 3:30 to 5:00. These two activities overlap! If your mom asks you, "During what continuous block of time are you busy this afternoon?", you wouldn't say "I'm busy from 3 to 4, and also from 3:30 to 5." That sounds confusing!

Instead, you would merge those two blocks of time in your head and say, "I am totally busy from 3:00 PM to 5:00 PM."

When a computer application manages thousands of meetings, hotel bookings, or network logs, it often ends up with a giant list of messy, overlapping intervals. The computer needs a fast and reliable way to clean up this list, combine the overlapping parts, and figure out the exact continuous blocks of time. 

If we tried to use simple, naive loops to check every single interval against every other interval, the computer would take forever! It would get confused, just like trying to untangle a massive ball of yarn by pulling random strings. We need a smart strategy. We need the Merge Intervals pattern.

---

##  The Two Magic Steps of Merge Intervals

The Merge Intervals algorithm is brilliant because it relies on two very simple, logical steps. If you follow these two steps, you can solve almost any interval problem!

### Step 1: The Great Sorting!
Imagine you have a deck of cards, and each card has an interval written on it. If you throw them all on the table, they are in a completely random order. Trying to find which ones overlap in this mess is a nightmare.

So, what is the secret? **We sort them by their START time!** 

We line up all the cards from left to right, making sure the interval that starts the earliest is at the very front of the line, and the one that starts the latest is at the back. 

Why is this so magical? Because once they are sorted by their start times, any intervals that *might* overlap are guaranteed to be sitting right next to each other in the line! You never have to worry about interval #1 overlapping with interval #100 without overlapping with the ones in between. Sorting turns chaos into order.

### Step 2: The Merging Engine
Now that they are in a neat line, we can walk down the line just one time. We keep track of our "current" interval.

When we look at the next interval in the line, we ask a simple question: **"Does the start time of this next interval happen BEFORE or EXACTLY WHEN my current interval ends?"**

*   **YES, they overlap!** We have a collision! We don't start a new interval; instead, we just stretch our "current" interval's end time to cover the new one. We take the maximum end time between the two.
*   **NO, they don't overlap!** They are completely separate. We safely put our "current" interval into our final "completed" basket, and the new interval becomes our brand new "current" interval.

We keep doing this until we reach the end of the line. And just like that, we have beautifully merged all the intervals!

---

##  A Detailed Step-by-Step Example

Let's watch the algorithm in action. Imagine we are given this messy, unsorted list of intervals: 
\`[[1, 3], [8, 10], [2, 6], [15, 18]]\`

**Action 1: Sort by start time!**
We organize them based on the first number in each pair.
Sorted list: \`[[1, 3], [2, 6], [8, 10], [15, 18]]\`

**Action 2: Start the Merging Engine!**
*   We pick up the very first one: \`[1, 3]\`. This is our **Current Interval**.
*   We look at the next one: \`[2, 6]\`. 
    *   *Question:* Does \`[2, 6]\` start before or exactly when \`[1, 3]\` ends? 
    *   *Answer:* Yes! The start time \`2\` is less than the end time \`3\`. They overlap!
    *   *Merge:* We stretch our Current Interval. It started at \`1\`. The new end time will be the bigger of \`3\` and \`6\`. So, our Current Interval becomes \`[1, 6]\`.
*   We look at the next one: \`[8, 10]\`.
    *   *Question:* Does \`[8, 10]\` start before or exactly when \`[1, 6]\` ends?
    *   *Answer:* No! The start time \`8\` is strictly greater than the end time \`6\`. There is a gap!
    *   *Action:* We save our completed \`[1, 6]\` to our final answer list. Now, \`[8, 10]\` becomes our new Current Interval.
*   We look at the last one: \`[15, 18]\`.
    *   *Question:* Does \`[15, 18]\` start before or exactly when \`[8, 10]\` ends?
    *   *Answer:* No! \`15\` is greater than \`10\`. Gap!
    *   *Action:* We save \`[8, 10]\` to our final answer list. \`[15, 18]\` becomes our new Current Interval.
*   We have reached the end of the list. We save our final Current Interval \`[15, 18]\` to the answer list.

**Final Result:** \`[[1, 6], [8, 10], [15, 18]]\`
Wow! It worked perfectly, and we only had to walk through the list one single time after sorting. This is incredibly fast and efficient.

---

##  Problem 1: Merge Intervals (The Classic Template)

This is the most famous interval problem, and the exact implementation of the steps we just discussed. Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

[Visualize Merge Intervals in the Interactive Simulator](viz:merge-intervals)

### The Strategy
We will implement the exact two magic steps: Sort by the start index, and then iterate through, merging overlapping ones and pushing non-overlapping ones to an output array.

#### Complete Implementations

##### Python
\`\`\`python
class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        # Edge case: if there are no intervals, return an empty list
        if not intervals:
            return []
            
        # Step 1: The Great Sorting!
        # We sort the intervals based on the 0th element (the start time)
        intervals.sort(key=lambda x: x[0])
        
        # We create a list to hold our merged intervals
        merged = []
        
        # We walk through our sorted intervals one by one
        for interval in intervals:
            # If the merged list is empty, OR if the current interval 
            # starts strictly AFTER the last merged interval ends, there is no overlap
            if not merged or merged[-1][1] < interval[0]:
                # We can safely add it as a distinct new interval to our merged list
                merged.append(interval)
            else:
                # There IS an overlap! 
                # We stretch the end time of the last interval in our merged list
                # to cover both intervals by taking the maximum of the two ending times.
                merged[-1][1] = max(merged[-1][1], interval[1])
                
        return merged
\`\`\`

##### Java
\`\`\`java
class Solution {
    public int[][] merge(int[][] intervals) {
        // Edge case
        if (intervals.length <= 1) {
            return intervals;
        }

        // Step 1: The Great Sorting!
        // We use a custom comparator to sort by the start time (index 0)
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        List<int[]> merged = new ArrayList<>();
        
        // Grab the first interval to start our "Current Interval" tracker
        int[] currentInterval = intervals[0];
        merged.add(currentInterval);

        // Step 2: The Merging Engine
        for (int[] interval : intervals) {
            int currentEnd = currentInterval[1];
            int nextBegin = interval[0];
            int nextEnd = interval[1];

            // If the current interval's end overlaps or touches the next interval's start
            if (currentEnd >= nextBegin) {
                // They overlap! Stretch the end time.
                // We update the object that is already inside the 'merged' list
                currentInterval[1] = Math.max(currentEnd, nextEnd);
            } else {
                // No overlap! 
                // We make the new interval our "Current Interval" and add it to the list as a distinct entry
                currentInterval = interval;
                merged.add(currentInterval);
            }
        }

        // Convert our dynamic ArrayList back into a standard 2D array
        return merged.toArray(new int[merged.size()][]);
    }
}
\`\`\`

##### C++
\`\`\`cpp
class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        // Edge case
        if (intervals.empty()) {
            return {};
        }
        
        // Step 1: The Great Sorting!
        // std::sort automatically sorts a vector of vectors by their first elements (start time)
        sort(intervals.begin(), intervals.end());
        
        vector<vector<int>> merged;
        merged.push_back(intervals[0]);
        
        // Step 2: The Merging Engine
        for (int i = 1; i < intervals.size(); i++) {
            // If the end of the last merged interval overlaps with the start of the current one
            if (merged.back()[1] >= intervals[i][0]) {
                // Overlap! Stretch the end time to cover both intervals by taking the maximum
                merged.back()[1] = max(merged.back()[1], intervals[i][1]);
            } else {
                // No overlap! Add it as a new distinct interval to the list
                merged.push_back(intervals[i]);
            }
        }
        
        return merged;
    }
};
\`\`\`

##### TypeScript
\`\`\`typescript
function merge(intervals: number[][]): number[][] {
    // Edge case
    if (intervals.length === 0) return [];
    
    // Step 1: The Great Sorting!
    // Sort intervals based on the start values (index 0)
    intervals.sort((a, b) => a[0] - b[0]);
    
    // Initialize our merged array with the first interval
    const merged: number[][] = [intervals[0]];
    
    // Step 2: The Merging Engine
    for (let i = 1; i < intervals.length; i++) {
        const lastMerged = merged[merged.length - 1];
        const current = intervals[i];
        
        // If the end of the last merged interval overlaps or touches the start of the current interval
        if (lastMerged[1] >= current[0]) {
            // They overlap! Stretch the end of the last merged interval to cover both
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
        } else {
            // No overlap! Push the current interval as a new distinct entry
            merged.push(current);
        }
    }
    
    return merged;
}
\`\`\`

---

##  Problem 2: Insert Interval (The Three-Phase Approach)

What if you already have a perfectly sorted, non-overlapping list of intervals, and you just want to add a *single new interval* into the mix? 

Instead of adding it and re-sorting everything (which is slow!), we can use a highly optimized approach called the **Three-Phase Approach**. 

Imagine a VIP guest arriving at a theater where everyone is already seated. You don't ask everyone to stand up and re-organize! You just walk down the aisle, find the right spot, shift a few people if needed, and let the VIP sit down.

[Visualize Insert Interval in the Interactive Simulator](viz:interval-scheduling)

### The Three Phases
1.  **Phase 1: Add all the intervals that come completely BEFORE the new interval.** If an interval ends before the new one even begins, it has nothing to do with the new interval. We just safely add it to our result list.
2.  **Phase 2: The Danger Zone (Merging).** Now we hit the intervals that actually overlap with our new one. We merge our new interval with all of these overlapping intervals one by one, creating one giant "Mega Interval". Once there are no more overlaps, we add our Mega Interval to the result.
3.  **Phase 3: Add all the remaining intervals.** Any intervals left in the list come completely AFTER our new Mega Interval. We just scoop them all up and add them to the end of our result list.

#### Complete Implementations

##### Python
\`\`\`python
class Solution:
    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
        result = []
        i = 0
        n = len(intervals)
        
        # Phase 1: Add intervals that come completely BEFORE newInterval
        # If the current interval ends before the new one starts, there's no overlap
        while i < n and intervals[i][1] < newInterval[0]:
            result.append(intervals[i])
            i += 1
            
        # Phase 2: Merge overlapping intervals into the newInterval
        # As long as the current interval starts before or exactly when the new interval ends
        while i < n and intervals[i][0] <= newInterval[1]:
            # Stretch the newInterval to cover both bounds
            newInterval[0] = min(newInterval[0], intervals[i][0])
            newInterval[1] = max(newInterval[1], intervals[i][1])
            i += 1
            
        # Add the fully merged new Mega Interval
        result.append(newInterval)
        
        # Phase 3: Add the rest of the intervals
        # These intervals come completely AFTER our new Mega Interval
        while i < n:
            result.append(intervals[i])
            i += 1
            
        return result
\`\`\`

##### Java
\`\`\`java
class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> result = new ArrayList<>();
        int i = 0;
        int n = intervals.length;

        // Phase 1: Add intervals that end before the newInterval starts
        // These are completely separated and come before our insertion point
        while (i < n && intervals[i][1] < newInterval[0]) {
            result.add(intervals[i]);
            i++;
        }

        // Phase 2: Merge overlapping intervals into a Mega Interval
        // As long as the current interval starts before or exactly when the new interval ends
        while (i < n && intervals[i][0] <= newInterval[1]) {
            // Stretch the newInterval to cover both bounds
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        
        // Add the merged mega interval
        result.add(newInterval);

        // Phase 3: Add all remaining intervals
        // These are completely separated and come after our insertion point
        while (i < n) {
            result.add(intervals[i]);
            i++;
        }

        return result.toArray(new int[result.size()][]);
    }
}
\`\`\`

##### C++
\`\`\`cpp
class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int>> result;
        int i = 0;
        int n = intervals.size();
        
        // Phase 1: Skip and add intervals ending before newInterval starts
        // These are completely separated and come before our insertion point
        while (i < n && intervals[i][1] < newInterval[0]) {
            result.push_back(intervals[i]);
            i++;
        }
        
        // Phase 2: Merge overlapping intervals
        // As long as the current interval starts before or exactly when the new interval ends
        while (i < n && intervals[i][0] <= newInterval[1]) {
            // Stretch the newInterval to cover both bounds
            newInterval[0] = min(newInterval[0], intervals[i][0]);
            newInterval[1] = max(newInterval[1], intervals[i][1]);
            i++;
        }
        
        // Push the mega merged interval
        result.push_back(newInterval);
        
        // Phase 3: Push all the remaining intervals
        // These are completely separated and come after our insertion point
        while (i < n) {
            result.push_back(intervals[i]);
            i++;
        }
        
        return result;
    }
};
\`\`\`

##### TypeScript
\`\`\`typescript
function insert(intervals: number[][], newInterval: number[]): number[][] {
    const result: number[][] = [];
    let i = 0;
    const n = intervals.length;
    
    // Phase 1: Skip intervals entirely before the new one
    // These are completely separated and come before our insertion point
    while (i < n && intervals[i][1] < newInterval[0]) {
        result.push(intervals[i]);
        i++;
    }
    
    // Phase 2: Merge overlapping intervals
    // As long as the current interval starts before or exactly when the new interval ends
    while (i < n && intervals[i][0] <= newInterval[1]) {
        // Stretch the newInterval to cover both bounds
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    
    // Add the merged interval
    result.push(newInterval);
    
    // Phase 3: Add the remaining intervals
    // These are completely separated and come after our insertion point
    while (i < n) {
        result.push(intervals[i]);
        i++;
    }
    
    return result;
}
\`\`\`

---

##  Common Mistakes (The Sorting Trap)

The absolute most common mistake people make when trying to solve Merge Intervals problems is **forgetting to sort the input data**. 

If you try to process the list from left to right without sorting it first, you will never know if an interval located way at the very end of the array is supposed to merge with the very first interval. You would be forced to use messy, nested loops that take \`O(N^2)\` time to run, and the code would become incredibly complex and prone to bugs. 

Always remember the golden rule of intervals: **Unless the problem explicitly tells you the intervals are already sorted, your very first line of code should be to sort them!**

Another tricky mistake is sorting by the *end* time instead of the *start* time. Sorting by the end time is a technique used for a completely different algorithmic pattern called "Activity Selection" (finding the maximum number of non-overlapping meetings you can attend). For merging overlaps, we **always** sort by the start time.

---

##  Summary
* **Intervals** represent a range with a start and an end.
* **The Merge Intervals Pattern** is the ultimate tool for consolidating overlapping times, schedules, and ranges.
* The golden two steps: **Sort by start time**, then iterate and merge by checking if the next start is less than or equal to the current end.
* For inserting a single interval into a sorted list, use the **Three-Phase Approach** (Before, Merge Overlaps, After) for maximum efficiency!

---

##  Practice Problems & Website Verifications

Ready to test your interval merging skills? Try tackling these problems:
* [Merge Intervals](/problem/merge-intervals) — The fundamental template. Master this first!
* [Insert Interval](/problem/insert-interval) — Practice the efficient Three-Phase approach.
* [Non-overlapping Intervals](/problem/non-overlapping-intervals) — A twist! Can you figure out the minimum number of intervals to remove?
* [Meeting Rooms](/problem/meeting-rooms) — Determine if a person can attend all meetings.
* [Meeting Rooms II](/problem/meeting-rooms-ii) — Figure out the minimum number of conference rooms required!
`;
