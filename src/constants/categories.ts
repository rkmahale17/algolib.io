export const CATEGORY_ORDER = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Binary Search",
  "Linked List",
  "Trees",
  "Heap / Priority Queue",
  "Backtracking",
  "Tries",
  "Graphs",
  "Advanced Graphs",
  "1-D Dynamic Programming",
  "2-D Dynamic Programming",
  "Greedy",
  "Intervals",
  "Math & Geometry",
  "Bit Manipulation"
];

export const CATEGORY_MAP: Record<string, string> = {
  "Array": "Arrays & Hashing",
  "Arrays": "Arrays & Hashing",
  "Hashing": "Arrays & Hashing",
  "Arrays & Strings": "Arrays & Hashing",
  "Arrays and Sorting": "Arrays & Hashing",
  "Tree": "Trees",
  "Trees & BSTs": "Trees",
  "Graph": "Graphs",
  "1D Dynamic Programming": "1-D Dynamic Programming",
  "2D Dynamic Programming": "2-D Dynamic Programming",
  "Dynamic Programming": "1-D Dynamic Programming",
  "Bitwise": "Bit Manipulation",
  "Priority Queue": "Heap / Priority Queue",
  "Heap": "Heap / Priority Queue",
  "Matrix": "Arrays & Hashing",
  "Math": "Math & Geometry",
  "Interval": "Intervals"
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
      let cat = algo.category || 'Other';
      if (CATEGORY_MAP[cat]) cat = CATEGORY_MAP[cat];
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(algo);
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
