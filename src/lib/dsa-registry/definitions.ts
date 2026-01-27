
export type Language = 'typescript' | 'python' | 'java' | 'cpp';

export const DS_DEFINITIONS: Record<string, Record<Language, string>> = {
    ListNode: {
        typescript: `
class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.next = (next === undefined ? null : next)
    }
}
`,
        python: `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
`,
        java: `
  public static class ListNode {
      public int val;
      public ListNode next;
      public ListNode() {}
      public ListNode(int val) { this.val = val; }
      public ListNode(int val, ListNode next) { this.val = val; this.next = next; }
  }
`,
        cpp: `
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};
`
    },
    TreeNode: {
        typescript: `
class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val===undefined ? 0 : val)
        this.left = (left===undefined ? null : left)
        this.right = (right===undefined ? null : right)
    }
}
`,
        python: `
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
`,
        java: `
  public static class TreeNode {
      public int val;
      public TreeNode left;
      public TreeNode right;
      public TreeNode() {}
      public TreeNode(int val) { this.val = val; }
      public TreeNode(int val, TreeNode left, TreeNode right) {
          this.val = val;
          this.left = left;
          this.right = right;
      }
  }
`,
        cpp: `
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};
`
    },
    Interval: {
        typescript: `
class Interval {
    start: number;
    end: number;
    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }
}
`,
        python: `
class Interval:
    def __init__(self, start=0, end=0):
        self.start = start
        self.end = end
`,
        java: `
    public static class Interval {
        public int start;
        public int end;
        public Interval() {}
        public Interval(int start, int end) {
            this.start = start;
            this.end = end;
        }
    }
`,
        cpp: `
struct Interval {
    int start;
    int end;
    Interval() : start(0), end(0) {}
    Interval(int s, int e) : start(s), end(e) {}
};
`
    },
    GraphNode: {
        typescript: `
class Node {
    val: number;
    neighbors: Node[];
    constructor(val?: number, neighbors?: Node[]) {
        this.val = (val === undefined ? 0 : val)
        this.neighbors = (neighbors === undefined ? [] : neighbors)
    }
}
`,
        python: `
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
`,
        java: `
    public static class Node {
        public int val;
        public List<Node> neighbors;
        public Node() { 
            val = 0; 
            neighbors = new ArrayList<Node>(); 
        }
        public Node(int _val) { 
            val = _val; 
            neighbors = new ArrayList<Node>(); 
        }
        public Node(int _val, ArrayList<Node> _neighbors) { 
            val = _val; 
            neighbors = _neighbors; 
        }
    }
`,
        cpp: `
class Node {
public:
    int val;
    vector<Node*> neighbors;
    Node() {
        val = 0;
        neighbors = vector<Node*>();
    }
    Node(int _val) {
        val = _val;
        neighbors = vector<Node*>();
    }
    Node(int _val, vector<Node*> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
};
`
    },
    Node: {
        typescript: `
class Node {
    val: number;
    neighbors: Node[];
    constructor(val?: number, neighbors?: Node[]) {
        this.val = (val === undefined ? 0 : val)
        this.neighbors = (neighbors === undefined ? [] : neighbors)
    }
}
`,
        python: `
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
`,
        java: `
    public static class Node {
        public int val;
        public List<Node> neighbors;
        public Node() { 
            val = 0; 
            neighbors = new ArrayList<Node>(); 
        }
        public Node(int _val) { 
            val = _val; 
            neighbors = new ArrayList<Node>(); 
        }
        public Node(int _val, ArrayList<Node> _neighbors) { 
            val = _val; 
            neighbors = _neighbors; 
        }
    }
`,
        cpp: `
class Node {
public:
    int val;
    vector<Node*> neighbors;
    Node() {
        val = 0;
        neighbors = vector<Node*>();
    }
    Node(int _val) {
        val = _val;
        neighbors = vector<Node*>();
    }
    Node(int _val, vector<Node*> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
};
`
    },
    TrieNode: {
        typescript: `
class TrieNode {
    children: { [key: string]: TrieNode };
    isEnd: boolean;
    constructor() {
        this.children = {};
        this.isEnd = false;
    }
}
`,
        python: `
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
`,
        java: `
    public static class TrieNode {
        public TrieNode[] children;
        public boolean isEnd;
        public TrieNode() {
            children = new TrieNode[26];
            isEnd = false;
        }
    }
`,
        cpp: `
struct TrieNode {
    TrieNode* children[26];
    bool isEnd;
    TrieNode() {
        for(int i=0; i<26; i++) children[i] = nullptr;
        isEnd = false;
    }
};
`
    }
};
