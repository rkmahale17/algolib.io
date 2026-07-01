import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { Card } from "@/components/ui/card";
import type { VisualizationLanguageMap, StepLineNumberMap } from "@/types/visualization";

interface Step {
  type: "postTweet" | "getNewsFeed" | "follow" | "unfollow" | "init";
  operation: string;
  message: string;
  detailedMessage: string;
  substep: number;
  totalSubsteps: number;
  count: number;
  tweetMap: Record<number, [number, number][]>;
  followMap: Record<number, number[]>;
  heap?: [number, number, number, number][]; // [count, tweetId, followeeId, index]
  result?: number[];
  pseudoStep: string;
  highlightedUser?: number;
  highlightedFollower?: number;
  highlightedFollowee?: number;
  highlightedTweetId?: number;
  highlightedHeapElementIndex?: number;
}

const languages: VisualizationLanguageMap = {
  typescript: `class Twitter {
  private count: number;
  private tweetMap: Map<number, [number, number][]>;
  private followMap: Map<number, Set<number>>;
  constructor() {
    this.count = 0;
    this.tweetMap = new Map();
    this.followMap = new Map();
  }
  postTweet(userId: number, tweetId: number): void {
    if (!this.tweetMap.has(userId)) {
      this.tweetMap.set(userId, []);
    }
    this.tweetMap.get(userId)!.push([this.count, tweetId]);
    this.count--;
  }
  getNewsFeed(userId: number): number[] {
    const result: number[] = [];
    if (!this.followMap.has(userId)) {
      this.followMap.set(userId, new Set());
    }
    this.followMap.get(userId)!.add(userId);
    const heap: [number, number, number, number][] = [];
    const pushHeap = (count: number, tweetId: number, followeeId: number, index: number) => {
      heap.push([count, tweetId, followeeId, index]);
      heap.sort((a, b) => a[0] - b[0]);
    };
    const popHeap = (): [number, number, number, number] => {
      return heap.shift()!;
    };
    for (const followeeId of this.followMap.get(userId)!) {
      const tweets = this.tweetMap.get(followeeId);
      if (tweets && tweets.length > 0) {
        const index = tweets.length - 1;
        const [count, tweetId] = tweets[index];
        pushHeap(count, tweetId, followeeId, index - 1);
      }
    }
    while (heap.length > 0 && result.length < 10) {
      const [count, tweetId, followeeId, index] = popHeap();
      result.push(tweetId);
      const tweets = this.tweetMap.get(followeeId)!;
      if (index >= 0) {
        const [nextCount, nextTweetId] = tweets[index];
        pushHeap(nextCount, nextTweetId, followeeId, index - 1);
      }
    }
    return result;
  }
  follow(followerId: number, followeeId: number): void {
    if (!this.followMap.has(followerId)) {
      this.followMap.set(followerId, new Set());
    }
    this.followMap.get(followerId)!.add(followeeId);
  }
  unfollow(followerId: number, followeeId: number): void {
    this.followMap.get(followerId)?.delete(followeeId);
  }
}`,
  python: `class Twitter:
    def __init__(self):
        self.count = 0
        self.tweetMap = {}
        self.followMap = {}
    def postTweet(self, userId: int, tweetId: int) -> None:
        if userId not in self.tweetMap:
            self.tweetMap[userId] = []
        self.tweetMap[userId].append((self.count, tweetId))
        self.count -= 1
    def getNewsFeed(self, userId: int) -> list[int]:
        result = []
        heap = []
        if userId not in self.followMap:
            self.followMap[userId] = set()
        self.followMap[userId].add(userId)
        import heapq
        def push_heap(count, tweetId, followeeId, index):
            heapq.heappush(heap, (count, tweetId, followeeId, index))
        def pop_heap():
            return heapq.heappop(heap)
        for followeeId in self.followMap[userId]:
            if followeeId in self.tweetMap and len(self.tweetMap[followeeId]) > 0:
                index = len(self.tweetMap[followeeId]) - 1
                count, tweetId = self.tweetMap[followeeId][index]
                push_heap(count, tweetId, followeeId, index - 1)
        while len(heap) > 0 and len(result) < 10:
            count, tweetId, followeeId, index = pop_heap()
            result.append(tweetId)
            if index >= 0:
                next_count, next_tweetId = self.tweetMap[followeeId][index]
                push_heap(next_count, next_tweetId, followeeId, index - 1)
        return result
    def follow(self, followerId: int, followeeId: int) -> None:
        if followerId not in self.followMap:
            self.followMap[followerId] = set()
        self.followMap[followerId].add(followeeId)
    def unfollow(self, followerId: int, followeeId: int) -> None:
        if followerId in self.followMap and followeeId in self.followMap[followerId]:
            self.followMap[followerId].remove(followeeId)`,
  java: `public static class Solution {
    public int[][] kClosest(int[][] points, int k) {
        PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        for (int[] point : points) {
            int x = point[0];
            int y = point[1];
            int dist = (x * x) + (y * y);
            minHeap.offer(new int[]{dist, x, y});
        }
        int[][] res = new int[k][2];
        for (int i = 0; i < k; i++) {
            int[] current = minHeap.poll();
            res[i][0] = current[1];
            res[i][1] = current[2];
        }
        return res;
    }
}`,
  cpp: `class Solution {
public:
    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
        priority_queue<vector<int>, vector<vector<int>>, greater<vector<int>>> minHeap;
        for (auto& point : points) {
            int x = point[0];
            int y = point[1];
            int dist = (x * x) + (y * y);
            minHeap.push({dist, x, y});
        }
        vector<vector<int>> result;
        for (int i = 0; i < k; i++) {
            auto current = minHeap.top();
            minHeap.pop();
            result.push_back({current[1], current[2]});
        }
        return result;
    }
};`
};

export const DesignTwitterVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { steps, stepLineNumbers } = useMemo(() => {
    const generatedSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    let count = 0;
    const tweetMap: Record<number, [number, number][]> = {};
    const followMap: Record<number, Set<number>> = {};
    
    const getTweetMap = () => JSON.parse(JSON.stringify(tweetMap));
    const getFollowMap = () => {
        const res: Record<number, number[]> = {};
        for (const k in followMap) res[k] = Array.from(followMap[k]);
        return res;
    };

    const addStep = (
      type: Step["type"],
      operation: string,
      message: string,
      detailedMessage: string,
      substep: number,
      totalSubsteps: number,
      extras: Partial<Step>,
      ts: number, py: number, java: number, cpp: number
    ) => {
      generatedSteps.push({
        type,
        operation,
        message,
        detailedMessage,
        substep,
        totalSubsteps,
        count,
        tweetMap: getTweetMap(),
        followMap: getFollowMap(),
        pseudoStep: operation,
        ...extras
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    // INIT
    addStep("init", "Twitter()", "Initialize Twitter Data Structures", "Created count (0), tweetMap (empty), and followMap (empty).", 1, 1, {}, 5, 2, 5, 7);

    // 1. postTweet(1, 5)
    let total = 4; let s = 1; let op = "postTweet(1, 5)";
    addStep("postTweet", op, "Posting a tweet", "User 1 is attempting to post tweet 5.", s++, total, { highlightedUser: 1, highlightedTweetId: 5 }, 10, 6, 10, 10);
    tweetMap[1] = [];
    addStep("postTweet", op, "Initializing user's tweet list", "User 1 has no tweets yet, initializing a new empty list in tweetMap.", s++, total, { highlightedUser: 1 }, 11, 7, 11, 11);
    tweetMap[1].push([count, 5]);
    addStep("postTweet", op, "Adding tweet to user's list", `Added [count: ${count}, tweetId: 5] to user 1's list.`, s++, total, { highlightedUser: 1, highlightedTweetId: 5 }, 14, 9, 14, 11);
    count--;
    addStep("postTweet", op, "Decrementing global count", "Decremented count to maintain chronological ordering (smaller count means more recent).", s++, total, {}, 15, 10, 14, 11);

    // 2. getNewsFeed(1)
    total = 11; s = 1; op = "getNewsFeed(1)";
    let heap: [number, number, number, number][] = [];
    let result: number[] = [];
    addStep("getNewsFeed", op, "Fetching news feed", "User 1 is requesting their news feed.", s++, total, { highlightedUser: 1 }, 17, 11, 16, 13);
    followMap[1] = new Set();
    addStep("getNewsFeed", op, "Checking follow relationships", "User 1 doesn't have a follow list yet, initializing it.", s++, total, { highlightedUser: 1 }, 19, 14, 18, 15);
    followMap[1].add(1);
    addStep("getNewsFeed", op, "User follows themselves", "Adding User 1 to their own follow list so their tweets appear in their feed.", s++, total, { highlightedFollower: 1, highlightedFollowee: 1 }, 22, 16, 21, 15);
    addStep("getNewsFeed", op, "Initializing Min-Heap", "Created an empty heap to merge sorted tweet lists from all followed users.", s++, total, { heap: [...heap], result: [...result] }, 23, 13, 22, 16);
    
    addStep("getNewsFeed", op, "Iterating followees", "Checking User 1's followees. Only User 1 is followed.", s++, total, { highlightedFollowee: 1, heap: [...heap], result: [...result] }, 31, 22, 23, 17);
    heap.push([0, 5, 1, 0]);
    heap.sort((a, b) => a[0] - b[0]);
    addStep("getNewsFeed", op, "Pushing most recent tweet to heap", "User 1 has tweets. Pushing their most recent tweet (ID 5) into the min-heap.", s++, total, { highlightedFollowee: 1, highlightedTweetId: 5, heap: [...heap], result: [...result] }, 36, 26, 29, 20);
    
    addStep("getNewsFeed", op, "Extracting from heap", "Entering extraction loop to get the 10 most recent tweets.", s++, total, { heap: [...heap], result: [...result] }, 39, 27, 33, 28);
    heap.shift();
    addStep("getNewsFeed", op, "Popping smallest count", "Popped tweet 5 from heap (count 0).", s++, total, { highlightedTweetId: 5, heap: [...heap], result: [...result] }, 40, 28, 34, 29);
    result.push(5);
    addStep("getNewsFeed", op, "Adding to result", "Added tweet 5 to the result feed.", s++, total, { highlightedTweetId: 5, heap: [...heap], result: [...result] }, 41, 29, 35, 31);
    addStep("getNewsFeed", op, "Checking for next tweet", "User 1 has no more tweets in their list.", s++, total, { highlightedFollowee: 1, heap: [...heap], result: [...result] }, 43, 30, 38, 34);
    addStep("getNewsFeed", op, "Returning result", "Heap is empty. Returning feed containing tweet 5.", s++, total, { heap: [...heap], result: [...result] }, 48, 33, 43, 43);

    // 3. follow(1, 2)
    total = 2; s = 1; op = "follow(1, 2)";
    addStep("follow", op, "Following a user", "User 1 is following User 2.", s++, total, { highlightedFollower: 1, highlightedFollowee: 2 }, 50, 34, 45, 45);
    followMap[1].add(2);
    addStep("follow", op, "Adding to followMap", "Added User 2 to User 1's follow set.", s++, total, { highlightedFollower: 1, highlightedFollowee: 2 }, 54, 37, 49, 46);

    // 4. postTweet(2, 6)
    total = 4; s = 1; op = "postTweet(2, 6)";
    addStep("postTweet", op, "Posting a tweet", "User 2 is attempting to post tweet 6.", s++, total, { highlightedUser: 2, highlightedTweetId: 6 }, 10, 6, 10, 10);
    tweetMap[2] = [];
    addStep("postTweet", op, "Initializing user's tweet list", "User 2 has no tweets yet, initializing a new list.", s++, total, { highlightedUser: 2 }, 11, 7, 11, 11);
    tweetMap[2].push([count, 6]);
    addStep("postTweet", op, "Adding tweet to user's list", `Added [count: ${count}, tweetId: 6] to user 2's list.`, s++, total, { highlightedUser: 2, highlightedTweetId: 6 }, 14, 9, 14, 11);
    count--;
    addStep("postTweet", op, "Decrementing global count", "Decremented count to maintain chronological ordering.", s++, total, {}, 15, 10, 14, 11);

    // 5. getNewsFeed(1)
    total = 14; s = 1; op = "getNewsFeed(1)";
    heap = []; result = [];
    addStep("getNewsFeed", op, "Fetching news feed", "User 1 is requesting their news feed again.", s++, total, { highlightedUser: 1 }, 17, 11, 16, 13);
    addStep("getNewsFeed", op, "User follows themselves", "User 1 is already in their follow list.", s++, total, { highlightedFollower: 1, highlightedFollowee: 1 }, 22, 16, 21, 15);
    addStep("getNewsFeed", op, "Initializing Min-Heap", "Created an empty min-heap.", s++, total, { heap: [...heap], result: [...result] }, 23, 13, 22, 16);
    
    addStep("getNewsFeed", op, "Iterating followees", "Checking User 1's followees (User 1 and User 2). First checking User 1.", s++, total, { highlightedFollowee: 1, heap: [...heap], result: [...result] }, 31, 22, 23, 17);
    heap.push([0, 5, 1, 0]); // From User 1
    heap.sort((a, b) => a[0] - b[0]);
    addStep("getNewsFeed", op, "Pushing most recent tweet", "Pushed User 1's most recent tweet (5) to heap.", s++, total, { highlightedFollowee: 1, highlightedTweetId: 5, heap: [...heap], result: [...result] }, 36, 26, 29, 20);
    
    addStep("getNewsFeed", op, "Iterating followees", "Checking User 2.", s++, total, { highlightedFollowee: 2, heap: [...heap], result: [...result] }, 31, 22, 23, 17);
    heap.push([-1, 6, 2, 0]); // From User 2
    heap.sort((a, b) => a[0] - b[0]);
    addStep("getNewsFeed", op, "Pushing most recent tweet", "Pushed User 2's most recent tweet (6) to heap.", s++, total, { highlightedFollowee: 2, highlightedTweetId: 6, heap: [...heap], result: [...result] }, 36, 26, 29, 20);

    addStep("getNewsFeed", op, "Extracting from heap", "Entering extraction loop.", s++, total, { heap: [...heap], result: [...result] }, 39, 27, 33, 28);
    heap.shift(); // pops [-1, 6, 2, 0]
    addStep("getNewsFeed", op, "Popping smallest count", "Popped tweet 6 from heap (count -1, most recent).", s++, total, { highlightedTweetId: 6, heap: [...heap], result: [...result] }, 40, 28, 34, 29);
    result.push(6);
    addStep("getNewsFeed", op, "Adding to result", "Added tweet 6 to the result feed.", s++, total, { highlightedTweetId: 6, heap: [...heap], result: [...result] }, 41, 29, 35, 31);
    addStep("getNewsFeed", op, "Checking for next tweet", "User 2 has no more tweets.", s++, total, { highlightedFollowee: 2, heap: [...heap], result: [...result] }, 43, 30, 38, 34);

    heap.shift(); // pops [0, 5, 1, 0]
    addStep("getNewsFeed", op, "Popping smallest count", "Popped tweet 5 from heap (count 0).", s++, total, { highlightedTweetId: 5, heap: [...heap], result: [...result] }, 40, 28, 34, 29);
    result.push(5);
    addStep("getNewsFeed", op, "Adding to result", "Added tweet 5 to the result feed.", s++, total, { highlightedTweetId: 5, heap: [...heap], result: [...result] }, 41, 29, 35, 31);
    
    addStep("getNewsFeed", op, "Returning result", "Heap is empty. Returning feed containing [6, 5].", s++, total, { heap: [...heap], result: [...result] }, 48, 33, 43, 43);

    // 6. unfollow(1, 2)
    total = 2; s = 1; op = "unfollow(1, 2)";
    addStep("unfollow", op, "Unfollowing a user", "User 1 is unfollowing User 2.", s++, total, { highlightedFollower: 1, highlightedFollowee: 2 }, 56, 38, 51, 48);
    followMap[1].delete(2);
    addStep("unfollow", op, "Removing from followMap", "Removed User 2 from User 1's follow set.", s++, total, { highlightedFollower: 1, highlightedFollowee: 2 }, 57, 40, 53, 50);

    // 7. getNewsFeed(1)
    total = 6; s = 1; op = "getNewsFeed(1)";
    heap = []; result = [];
    addStep("getNewsFeed", op, "Fetching news feed", "User 1 is requesting news feed after unfollowing User 2.", s++, total, { highlightedUser: 1 }, 17, 11, 16, 13);
    addStep("getNewsFeed", op, "Initializing Min-Heap", "Created an empty min-heap.", s++, total, { heap: [...heap], result: [...result] }, 23, 13, 22, 16);
    
    addStep("getNewsFeed", op, "Iterating followees", "Checking User 1's followees (Only User 1).", s++, total, { highlightedFollowee: 1, heap: [...heap], result: [...result] }, 31, 22, 23, 17);
    heap.push([0, 5, 1, 0]);
    heap.sort((a, b) => a[0] - b[0]);
    addStep("getNewsFeed", op, "Pushing most recent tweet", "Pushed User 1's tweet 5.", s++, total, { highlightedFollowee: 1, highlightedTweetId: 5, heap: [...heap], result: [...result] }, 36, 26, 29, 20);
    
    addStep("getNewsFeed", op, "Extracting from heap", "Entering extraction loop.", s++, total, { heap: [...heap], result: [...result] }, 39, 27, 33, 28);
    heap.shift(); // pops [0, 5]
    result.push(5);
    addStep("getNewsFeed", op, "Adding to result", "Popped tweet 5 and added to result feed.", s++, total, { highlightedTweetId: 5, heap: [...heap], result: [...result] }, 41, 29, 35, 31);
    
    addStep("getNewsFeed", op, "Returning result", "Heap is empty. Returning feed containing [5].", s++, total, { heap: [...heap], result: [...result] }, 48, 33, 43, 43);

    return { steps: generatedSteps, stepLineNumbers: lines };
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex((prev) => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex((prev) => prev - 1);
  const handleReset = () => { setCurrentStepIndex(0); setIsPlaying(false); };

  if (steps.length === 0) return null;
  const step = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <div className="flex flex-col h-full gap-4">
      <VisualizationLayout
        controls={
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 p-4 bg-card border border-border rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Button onClick={handleStepBack} disabled={currentStepIndex === 0} variant="outline" size="icon">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button onClick={isPlaying ? handlePause : handlePlay} disabled={currentStepIndex === steps.length - 1} variant="default" size="icon">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button onClick={handleStepForward} disabled={currentStepIndex === steps.length - 1} variant="outline" size="icon">
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button onClick={handleReset} variant="outline" size="icon">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Step {currentStepIndex + 1} / {steps.length}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Speed:</span>
                <Slider value={[speed]} onValueChange={(val) => setSpeed(val[0])} min={0.5} max={3} step={0.5} className="w-24" />
                <span className="text-sm font-medium">{speed}x</span>
              </div>
            </div>
          </div>
        }
        leftContent={
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2">Current Operation</h3>
              <p className="text-lg font-mono text-primary">{step.operation}</p>
              <p className="text-base font-semibold text-foreground mt-2">{step.message}</p>
              <p className="text-sm text-muted-foreground mt-1">{step.detailedMessage}</p>
              <div className="mt-2 text-xs text-muted-foreground">Substep {step.substep} of {step.totalSubsteps}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-sm font-semibold mb-3 text-foreground">Follow Map</h3>
                  {Object.keys(step.followMap).length === 0 && <p className="text-sm text-muted-foreground italic">No followers yet.</p>}
                  <div className="flex flex-col gap-2">
                      {Object.entries(step.followMap).map(([follower, followees]) => (
                      <div key={follower} className={`p-2 rounded border-2 ${Number(follower) === step.highlightedFollower ? "border-primary bg-primary/20" : "border-border bg-muted/30"}`}>
                          <div className="font-mono text-sm text-foreground">User {follower} follows:</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                              {followees.length === 0 && <span className="text-xs text-muted-foreground">No one</span>}
                              {followees.map(followee => (
                                  <span key={followee} className={`text-xs px-2 py-1 rounded bg-background border ${Number(follower) === step.highlightedFollower && followee === step.highlightedFollowee ? "border-secondary text-secondary font-bold" : "border-border text-foreground"}`}>
                                      User {followee}
                                  </span>
                              ))}
                          </div>
                      </div>
                      ))}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-sm font-semibold mb-3 text-foreground">Tweet Map</h3>
                  {Object.keys(step.tweetMap).length === 0 && <p className="text-sm text-muted-foreground italic">No tweets yet.</p>}
                  <div className="flex flex-col gap-2">
                      {Object.entries(step.tweetMap).map(([user, tweets]) => (
                      <div key={user} className={`p-2 rounded border-2 ${Number(user) === step.highlightedUser || Number(user) === step.highlightedFollowee ? "border-primary bg-primary/20" : "border-border bg-muted/30"}`}>
                          <div className="font-mono text-sm text-foreground">User {user} tweets:</div>
                          <div className="flex flex-col gap-1 mt-1">
                              {tweets.map(([c, tid]) => (
                                  <div key={tid} className={`text-xs px-2 py-1 rounded bg-background border flex justify-between ${tid === step.highlightedTweetId ? "border-secondary text-secondary font-bold" : "border-border text-foreground"}`}>
                                      <span>Tweet: {tid}</span>
                                      <span className="text-muted-foreground text-[10px]">count: {c}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                      ))}
                  </div>
                </div>
            </div>

            {step.type === 'getNewsFeed' && step.heap && (
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 text-foreground">News Feed Generation (Min-Heap)</h3>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="text-xs text-muted-foreground mb-2">Heap State (Top = smallest count / most recent)</div>
                        <div className="flex flex-col gap-1">
                            {step.heap.length === 0 && <p className="text-xs text-muted-foreground italic">Heap is empty</p>}
                            {step.heap.map((h, i) => (
                                <div key={i} className="text-xs px-2 py-1 rounded bg-secondary/10 border border-secondary text-foreground flex justify-between">
                                    <span>Tweet: {h[1]} (from User {h[2]})</span>
                                    <span className="text-muted-foreground">count: {h[0]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-px bg-border"></div>
                    <div className="flex-1">
                        <div className="text-xs text-muted-foreground mb-2">Result Array</div>
                        <div className="flex flex-wrap gap-1">
                            {step.result?.length === 0 && <p className="text-xs text-muted-foreground italic">Empty</p>}
                            {step.result?.map((r, i) => (
                                <div key={i} className="text-xs px-2 py-1 rounded bg-primary/20 border border-primary font-bold text-foreground">
                                    {r}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              </div>
            )}

            <VariablePanel variables={{ "Global Count": step.count }} />
          </div>
        }
        rightContent={
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
        }
      />
    </div>
  );
};
export default DesignTwitterVisualization;
