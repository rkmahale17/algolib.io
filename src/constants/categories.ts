/**
 * Category Order — exact order the user specified.
 * ⚠️  "Heap / Priority Queue" was NOT in the user list — kept at the bottom.
 *     Let the user decide whether to remove it.
 */
export const CATEGORY_ORDER = [
  "Arrays & Hashing",       // MANDATORY: must have BOTH Array AND Hash Table tags
  "Two Pointers",
  "Prefix Sum",             // sub: Prefix Sum
  "Sliding Window",
  "Binary Search",
  "Stack",                  // sub: Stack, Monotonic Stack/Queue
  "Linked List",
  "Intervals",
  "Backtracking",           // sub: Backtracking, Recursion
  "Trees",                  // sub: Tree, BST, Binary Tree
  "Graphs",                 // sub: Graph, BFS, DFS, Topological Sort
  "Tries",                  // sub: Trie
  "Greedy",
  "Dynamic Programming",    // sub: DP (1-D, 2-D, all variants)
  "Math & Geometry",        // sub: Math, Geometry, Matrix, Combinatorics, Number Theory
  "Bit Manipulation",
  "Heap / Priority Queue",  // sub: Heap, Priority Queue, Data Stream  ← #17
  "Advanced Algorithms",    // sub: Advanced Graphs, Union Find
  "Design Pattern",
];

export const ADMIN_CATEGORIES = [
  ...CATEGORY_ORDER,
  "Array",
  "String",
  "Single",
  "Other"
];

// Tags that are considered "Array" type (prefix sum is its OWN category now)
const ARRAY_TAGS = new Set([
  "array", "arrays", "arrays and sorting", "sorting", "merg sort",
  "merge sort", "bucket sort", "quick select", "quickselect",
  "divide conquer", "divide and conquer", "simulation", "matrix"
]);

// Tags that are considered "Hash" type
const HASH_TAGS = new Set([
  "hash table", "hash tables", "hashing", "arrays & hashing",
  "arrays and hashing", "hash function"
]);

// Tags that are considered "String" type
const STRING_TAGS = new Set([
  "string", "strings", "string matching", "arrays & strings"
]);

// Mapping for non-ambiguous single tags
export const CATEGORY_MAP: Record<string, string> = {
  // ─── Arrays & Hashing ─────────────────────────────────────────────────────
  "arrays & hashing": "Arrays & Hashing",
  "arrays and hashing": "Arrays & Hashing",

  // ─── Trees ────────────────────────────────────────────────────────────────
  "tree": "Trees",
  "trees": "Trees",
  "bst": "Trees",
  "binary tree": "Trees",
  "trees & bsts": "Trees",
  "binary search tree": "Trees",

  // ─── Heap / Priority Queue ────────────────────────────────────────────────
  "heap": "Heap / Priority Queue",
  "priority queue": "Heap / Priority Queue",
  "heap / priority queue": "Heap / Priority Queue",
  "heap priority queue": "Heap / Priority Queue",
  "heap-priority-queue": "Heap / Priority Queue",
  "data stream": "Heap / Priority Queue",

  // ─── Backtracking ─────────────────────────────────────────────────────────
  "backtracking": "Backtracking",
  "recursion": "Backtracking",

  // ─── Tries ────────────────────────────────────────────────────────────────
  "trie": "Tries",
  "tries": "Tries",

  // ─── Graphs ───────────────────────────────────────────────────────────────
  "graph": "Graphs",
  "graphs": "Graphs",
  "bfs": "Graphs",
  "dfs": "Graphs",
  "topological sort": "Graphs",

  // ─── Advanced Algorithms ──────────────────────────────────────────────────
  "advanced graph": "Advanced Algorithms",
  "advanced graphs": "Advanced Algorithms",
  "advanced algorithm": "Advanced Algorithms",
  "advanced algorithms": "Advanced Algorithms",
  "union find": "Advanced Algorithms",
  "disjoint set": "Advanced Algorithms",

  // ─── Dynamic Programming (1-D and 2-D merged into one category) ──────────
  "dynamic programming": "Dynamic Programming",
  "dyanamic programming": "Dynamic Programming",
  "dyanamic progeammin": "Dynamic Programming",
  "1d dynamic programming": "Dynamic Programming",
  "1-d dynamic programming": "Dynamic Programming",
  "1d dyanamic programming": "Dynamic Programming",
  "1-d dyanamic programming": "Dynamic Programming",
  "2d dynamic programming": "Dynamic Programming",
  "2-d dynamic programming": "Dynamic Programming",
  "2d dyanamic programming": "Dynamic Programming",
  "2-d dyanamic programming": "Dynamic Programming",
  "2d dyanamic programing": "Dynamic Programming",
  "1d array and dyanamic programming": "Dynamic Programming",
  "1d array and dynamic programming": "Dynamic Programming",
  "1 dyanamic programin": "Dynamic Programming",
  "memorization": "Dynamic Programming",
  "memoization": "Dynamic Programming",

  // ─── Greedy ───────────────────────────────────────────────────────────────
  "greedy": "Greedy",

  // ─── Prefix Sum ───────────────────────────────────────────────────────────
  "prefix sum": "Prefix Sum",
  "prefix sums": "Prefix Sum",
  "running sum": "Prefix Sum",

  // ─── Intervals ────────────────────────────────────────────────────────────
  "interval": "Intervals",
  "intervals": "Intervals",

  // ─── Math & Geometry ──────────────────────────────────────────────────────
  "math": "Math & Geometry",
  "geometry": "Math & Geometry",
  "geomentry": "Math & Geometry",
  "math & geometry": "Math & Geometry",
  "combinatorics": "Math & Geometry",
  "matrix": "Math & Geometry",
  "number theory": "Math & Geometry",
  "math and number theory": "Math & Geometry",
  "math & number theory": "Math & Geometry",
  "number theory and math": "Math & Geometry",

  // ─── Bit Manipulation ─────────────────────────────────────────────────────
  "bit manipulation": "Bit Manipulation",
  "bitwise": "Bit Manipulation",

  // ─── Design Pattern ───────────────────────────────────────────────────────
  "design pattern": "Design Pattern",
  "design patterns": "Design Pattern",
  "desing pattern": "Design Pattern",
  "design": "Design Pattern",

  // ─── Two Pointers ─────────────────────────────────────────────────────────
  "two pointers": "Two Pointers",
  "two pointer": "Two Pointers",

  // ─── Sliding Window ───────────────────────────────────────────────────────
  "sliding window": "Sliding Window",

  // ─── Stack ────────────────────────────────────────────────────────────────
  "stack": "Stack",
  "monotonic stack": "Stack",
  "monotonic queue": "Stack",

  // ─── Binary Search ────────────────────────────────────────────────────────
  "binary search": "Binary Search",

  // ─── Linked List ──────────────────────────────────────────────────────────
  "linked list": "Linked List",
};

export const slugifyCategory = (cat: string): string => {
  return cat
    .toLowerCase()
    .replace(/&/g, 'and')        // Replace & with and to prevent URL breaking
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with -
    .replace(/^-+|-+$/g, '');    // Trim leading/trailing hyphens
};

export const normalizeCategory = (cat: string | null | undefined): string => {
  if (!cat) return 'Other';
  const trimmed = cat.trim().toLowerCase();

  // Check explicit map first
  if (CATEGORY_MAP[trimmed]) return CATEGORY_MAP[trimmed];

  // If it's a hyphenated slug (e.g. "arrays-&-hashing", "two-pointers", "prefix-sum")
  if (trimmed.includes('-')) {
    // 1. Replace hyphens with spaces and check map
    const spaced = trimmed.replace(/-/g, ' ');
    if (CATEGORY_MAP[spaced]) return CATEGORY_MAP[spaced];

    // 2. Collapse multiple spaces and trim
    const deSlugged = trimmed.replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
    if (CATEGORY_MAP[deSlugged]) return CATEGORY_MAP[deSlugged];

    // 3. Handle cases where "and" was replaced by "&"
    const withAmp = deSlugged.replace(/\band\b/g, '&');
    if (CATEGORY_MAP[withAmp]) return CATEGORY_MAP[withAmp];
    const withAnd = deSlugged.replace(/&/g, 'and');
    if (CATEGORY_MAP[withAnd]) return CATEGORY_MAP[withAnd];
  }

  return cat.trim();
};

/**
 * Given ALL tags of an algo, resolve which display categories it belongs to.
 *
 * UNIVERSAL GUARANTEE: Every problem always lands in at least one category.
 * This applies equally to ALL groups — nothing is ever hidden anywhere.
 *
 * Tier 1 — Strict match:   "Arrays & Hashing" only when BOTH Array AND Hash Table present
 * Tier 2 — Direct map:     Any tag in CATEGORY_MAP → goes to that category
 * Tier 3 — Unknown tag:    Completely unrecognised tags pass through as-is (still visible)
 * Tier 4 — Stray fallback: Array/Hash/String alone → best-fit "Arrays & Hashing"
 * Tier 5 — Last resort:    No tags at all → 'Other' (always shown)
 */
export const resolveAlgoCategories = (rawCats: string[]): string[] => {
  const lowerCats = rawCats.map(c => c.trim().toLowerCase());

  const hasArray  = lowerCats.some(c => ARRAY_TAGS.has(c));
  const hasHash   = lowerCats.some(c => HASH_TAGS.has(c));
  const hasString = lowerCats.some(c => STRING_TAGS.has(c));

  const result = new Set<string>();

  // Tier 1 — Arrays & Hashing ONLY when BOTH Array AND Hash Table are present
  if (hasArray && hasHash) {
    result.add("Arrays & Hashing");
  }

  // Tier 2 — Every other known tag maps directly via CATEGORY_MAP
  lowerCats.forEach(c => {
    if (CATEGORY_MAP[c]) {
      result.add(CATEGORY_MAP[c]);
    } else if (!ARRAY_TAGS.has(c) && !HASH_TAGS.has(c) && !STRING_TAGS.has(c)) {
      // Tier 3 — Completely unknown tag: pass through as-is so it still shows
      const raw = c.trim();
      if (raw) result.add(raw);
    }
  });

  // Tier 4 — Stray Array / Hash / String tags that didn't qualify above:
  //   best-fit fallback is "Arrays & Hashing" (closest known category for these tags).
  //   This ensures problems are NEVER hidden just because they only have one of the two.
  if (result.size === 0 && (hasArray || hasHash || hasString)) {
    result.add("Arrays & Hashing");
  }

  // Tier 5 — Absolute last resort: no tags at all → 'Other'
  //   'Other' is always rendered so these problems are always visible.
  return result.size > 0 ? Array.from(result) : ["Other"];
};

/** Kept for backwards compat with filter chips / normalizeCategory usages */
export const resolveCategories = (cat: string | null | undefined): string[] => {
  if (!cat) return ['Other'];
  return resolveAlgoCategories([cat]);
};

export const getGroupedByCategory = (algos: any[], searchQuery?: string) => {
  const groups: Record<string, any[]> = {};

  let filtered = algos;
  if (searchQuery) {
    filtered = algos.filter(algo =>
      (algo.title || algo.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (algo.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  filtered.forEach(algo => {
    const rawCats: string[] = algo.category
      ? algo.category.split(',').map((c: string) => c.trim())
      : ['Other'];

    // Resolve ALL tags together so the "must have both" rule can apply
    const resolvedCats = resolveAlgoCategories(rawCats);

    resolvedCats.forEach((cat: string) => {
      if (!groups[cat]) groups[cat] = [];
      if (!groups[cat].some(a => a.id === algo.id)) {
        groups[cat].push(algo);
      }
    });
  });

  return Object.entries(groups).sort(([a], [b]) => {
    const idxA = CATEGORY_ORDER.indexOf(a);
    const idxB = CATEGORY_ORDER.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });
};
