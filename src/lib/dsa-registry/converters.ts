
import { Language } from './definitions';

export const DS_CONVERTERS: Record<string, Record<Language, { parser: string, serializer: string }>> = {
    ListNode: {
        typescript: {
            parser: `
function jsonToListNode(arr: any[]): ListNode | null {
    if (!arr || arr.length === 0) return null;
    let head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}
`,
            serializer: `
function listNodeToJson(head: ListNode | null): any[] {
    const arr: any[] = [];
    let current = head;
    while (current) {
        arr.push(current.val);
        current = current.next;
    }
    return arr;
}
`
        },
        python: {
            parser: `
def json_to_list_node(arr):
    if not arr: return None
    head = ListNode(arr[0])
    current = head
    for val in arr[1:]:
        current.next = ListNode(val)
        current = current.next
    return head
`,
            serializer: `
def list_node_to_json(head):
    arr = []
    current = head
    while current:
        arr.append(current.val)
        current = current.next
    return arr
`
        },
        java: {
            parser: `
    private static ListNode jsonToListNode(String json) {
        if (json == null || json.equals("null") || json.equals("[]")) return null;
        try {
             if (!json.startsWith("[")) return new ListNode(Integer.parseInt(json));

            String content = json.substring(1, json.length() - 1);
            if (content.isEmpty()) return null;
            
            String[] parts = content.split(",");
            ListNode head = new ListNode(Integer.parseInt(parts[0].trim()));
            ListNode current = head;
            for (int i = 1; i < parts.length; i++) {
                current.next = new ListNode(Integer.parseInt(parts[i].trim()));
                current = current.next;
            }
            return head;
        } catch(Exception e) { return null; }
    }
      
    private static ListNode arrayToListNode(int[] arr) {
        if (arr == null || arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode current = head;
        for (int i = 1; i < arr.length; i++) {
            current.next = new ListNode(arr[i]);
            current = current.next;
        }
        return head;
    }
`,
            serializer: `
    private static int[] listNodeToArray(ListNode head) {
        List<Integer> list = new ArrayList<>();
        ListNode current = head;
        while (current != null) {
            list.add(current.val);
            current = current.next;
        }
        return list.stream().mapToInt(i -> i).toArray();
    }
`
        },
        cpp: {
            parser: `
ListNode* jsonToListNode(vector<int> arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* current = head;
    for (size_t i = 1; i < arr.size(); ++i) {
        current->next = new ListNode(arr[i]);
        current = current->next;
    }
    return head;
}
`,
            serializer: `
vector<int> listNodeToJson(ListNode* head) {
    vector<int> arr;
    ListNode* current = head;
    while (current) {
        arr.push_back(current->val);
        current = current->next;
    }
    return arr;
}
`
        }
    },
    TreeNode: {
        typescript: {
            parser: `
function jsonToTreeNode(arr: (number | null)[]): TreeNode | null {
    if (!arr || arr.length === 0 || arr[0] === null) return null;
    let root = new TreeNode(arr[0]!);
    let queue: TreeNode[] = [root];
    let i = 1;
    while (i < arr.length) {
        let current = queue.shift()!;
        if (i < arr.length && arr[i] !== null) {
            current.left = new TreeNode(arr[i]!);
            queue.push(current.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            current.right = new TreeNode(arr[i]!);
            queue.push(current.right);
        }
        i++;
    }
    return root;
}
`,
            serializer: `
function treeNodeToJson(root: TreeNode | null): (number | null)[] {
    if (!root) return [];
    const arr: (number | null)[] = [];
    const queue: (TreeNode | null)[] = [root];
    while (queue.length > 0) {
        const current = queue.shift();
        if (current) {
            arr.push(current.val);
            queue.push(current.left);
            queue.push(current.right);
        } else {
            arr.push(null);
        }
    }
    while (arr.length > 0 && arr[arr.length - 1] === null) {
        arr.pop();
    }
    return arr;
}
`
        },
        python: {
            parser: `
def json_to_tree_node(arr):
    if not arr or arr[0] is None: return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while i < len(arr):
        current = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            current.left = TreeNode(arr[i])
            queue.append(current.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            current.right = TreeNode(arr[i])
            queue.append(current.right)
        i += 1
    return root
`,
            serializer: `
def tree_node_to_json(root):
    if not root: return []
    arr = []
    queue = [root]
    while queue:
        current = queue.pop(0)
        if current:
            arr.append(current.val)
            queue.append(current.left)
            queue.append(current.right)
        else:
            arr.append(None)
    while arr and arr[-1] is None:
        arr.pop()
    return arr
`
        },
        java: {
            parser: `
    private static TreeNode arrayToTreeNode(Integer[] arr) {
        if (arr == null || arr.length == 0 || arr[0] == null) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (i < arr.length) {
            TreeNode current = queue.poll();
            
            if (i < arr.length && arr[i] != null) {
                current.left = new TreeNode(arr[i]);
                queue.add(current.left);
            }
            i++;
            
            if (i < arr.length && arr[i] != null) {
                current.right = new TreeNode(arr[i]);
                queue.add(current.right);
            }
            i++;
        }
        return root;
    }
`,
            serializer: `
    private static Integer[] treeNodeToArray(TreeNode root) {
        if (root == null) return new Integer[0];
        List<Integer> list = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        
        while (!queue.isEmpty()) {
            TreeNode current = queue.poll();
            if (current != null) {
                list.add(current.val);
                queue.add(current.left);
                queue.add(current.right);
            } else {
                list.add(null);
            }
        }
        for (int i = list.size() - 1; i >= 0; i--) {
            if (list.get(i) == null) list.remove(i);
            else break;
        }
        return list.toArray(new Integer[0]);
    }
`
        },
        cpp: {
            parser: `
TreeNode* jsonToTreeNode(vector<string> arr) {
    if (arr.empty() || arr[0] == "null") return nullptr;
    TreeNode* root = new TreeNode(stoi(arr[0]));
    queue<TreeNode*> q;
    q.push(root);
    size_t i = 1;
    while (i < arr.size()) {
        TreeNode* current = q.front();
        q.pop();
        
        if (i < arr.size() && arr[i] != "null") {
            current->left = new TreeNode(stoi(arr[i]));
            q.push(current->left);
        }
        i++;
        
        if (i < arr.size() && arr[i] != "null") {
            current->right = new TreeNode(stoi(arr[i]));
            q.push(current->right);
        }
        i++;
    }
    return root;
}
`,
            serializer: `
vector<string> treeNodeToJson(TreeNode* root) {
    if (!root) return {};
    vector<string> arr;
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        TreeNode* current = q.front();
        q.pop();
        
        if (current) {
            arr.push_back(to_string(current->val));
            q.push(current->left);
            q.push(current->right);
        } else {
            arr.push_back("null");
        }
    }
    while (!arr.empty() && arr.back() == "null") {
        arr.pop_back();
    }
    return arr;
}
`
        }
    },
    Interval: {
        typescript: {
            parser: `
function jsonToInterval(arr: number[]): Interval {
    return new Interval(arr[0], arr[1]);
}
function jsonToIntervalArray(arr: number[][]): Interval[] {
    return arr.map(jsonToInterval);
}
`,
            serializer: `
function intervalToJson(interval: Interval): number[] {
    return [interval.start, interval.end];
}
function intervalArrayToJson(intervals: Interval[]): number[][] {
    return intervals.map(intervalToJson);
}
`
        },
        python: {
            parser: `
def json_to_interval(arr):
    return Interval(arr[0], arr[1])

def json_to_interval_array(arr):
    return [json_to_interval(x) for x in arr]
`,
            serializer: `
def interval_to_json(interval):
    return [interval.start, interval.end]

def interval_array_to_json(intervals):
    return [interval_to_json(x) for x in intervals]
`
        },
        java: {
            parser: `
    private static Interval jsonToInterval(int[] arr) {
        return new Interval(arr[0], arr[1]);
    }
    private static Interval[] jsonToIntervalArray(int[][] arr) {
        if (arr == null) return new Interval[0];
        Interval[] result = new Interval[arr.length];
        for (int i = 0; i < arr.length; i++) {
            result[i] = jsonToInterval(arr[i]);
        }
        return result;
    }
`,
            serializer: `
    private static int[] intervalToJson(Interval interval) {
        return new int[]{interval.start, interval.end};
    }
    private static int[][] intervalArrayToJson(Interval[] intervals) {
        if (intervals == null) return new int[0][0];
        int[][] result = new int[intervals.length][2];
        for (int i = 0; i < intervals.length; i++) {
            result[i] = intervalToJson(intervals[i]);
        }
        return result;
    }
`
        },
        cpp: {
            parser: `
Interval jsonToInterval(vector<int> arr) {
    return Interval(arr[0], arr[1]);
}
vector<Interval> jsonToIntervalArray(vector<vector<int>> arr) {
    vector<Interval> result;
    for (auto& item : arr) {
        result.push_back(jsonToInterval(item));
    }
    return result;
}
`,
            serializer: `
vector<int> intervalToJson(Interval interval) {
    return {interval.start, interval.end};
}
vector<vector<int>> intervalArrayToJson(vector<Interval>& intervals) {
    vector<vector<int>> result;
    for (auto& item : intervals) {
        result.push_back(intervalToJson(item));
    }
    return result;
}
`
        }
    },
    GraphNode: {
        typescript: {
            parser: `
function jsonToGraphNode(adjList: number[][]): Node | null {
    if (!adjList || adjList.length === 0) return null;
    const nodes: Node[] = [];
    for (let i = 0; i < adjList.length; i++) {
        nodes.push(new Node(i + 1));
    }
    for (let i = 0; i < adjList.length; i++) {
        for (const neighborVal of adjList[i]) {
            nodes[i].neighbors.push(nodes[neighborVal - 1]);
        }
    }
    return nodes[0];
}
`,
            serializer: `
function graphNodeToJson(node: Node | null): number[][] {
    if (!node) return [];
    const map = new Map<number, Node>();
    const queue = [node];
    map.set(node.val, node);
    while (queue.length) {
        const curr = queue.shift()!;
        for (const nei of (curr.neighbors || [])) {
            if (!map.has(nei.val)) {
                map.set(nei.val, nei);
                queue.push(nei);
            }
        }
    }
    const sortedNodes = Array.from(map.values()).sort((a,b) => a.val - b.val);
    const result: number[][] = [];
    for (const n of sortedNodes) {
        result.push(n.neighbors.map(nei => nei.val));
    }
    return result;
}
`
        },
        python: {
            parser: `
def json_to_graph_node(adjList):
    if not adjList: return None
    nodes = []
    for i in range(len(adjList)):
        nodes.append(Node(i + 1))
    for i in range(len(adjList)):
        for neighborVal in adjList[i]:
            nodes[i].neighbors.append(nodes[neighborVal - 1])
    return nodes[0]
`,
            serializer: `
def graph_node_to_json(node):
    if not node: return []
    visited = {}
    queue = [node]
    visited[node.val] = node
    while queue:
        curr = queue.pop(0)
        for nei in (curr.neighbors or []):
            if nei.val not in visited:
                visited[nei.val] = nei
                queue.append(nei)
    sorted_nodes = sorted(visited.values(), key=lambda x: x.val)
    result = []
    for n in sorted_nodes:
        result.append([nei.val for nei in n.neighbors])
    return result
`
        },
        java: {
            parser: `
    private static Node jsonToGraphNode(int[][] adjList) {
        if (adjList == null || adjList.length == 0) return null;
        List<Node> nodes = new ArrayList<>();
        for (int i = 0; i < adjList.length; i++) {
            nodes.add(new Node(i + 1));
        }
        for (int i = 0; i < adjList.length; i++) {
            for (int neighborVal : adjList[i]) {
                nodes.get(i).neighbors.add(nodes.get(neighborVal - 1));
            }
        }
        return nodes.get(0);
    }
`,
            serializer: `
    private static int[][] graphNodeToJson(Node node) {
        if (node == null) return new int[0][0];
        Map<Integer, Node> map = new HashMap<>();
        Queue<Node> queue = new LinkedList<>();
        map.put(node.val, node);
        queue.add(node);
        while (!queue.isEmpty()) {
            Node curr = queue.poll();
            for (Node nei : curr.neighbors) {
                if (!map.containsKey(nei.val)) {
                    map.put(nei.val, nei);
                    queue.add(nei);
                }
            }
        }
        List<Node> sortedNodes = new ArrayList<>(map.values());
        Collections.sort(sortedNodes, (a, b) -> a.val - b.val);
        int[][] result = new int[sortedNodes.size()][];
        for (int i = 0; i < sortedNodes.size(); i++) {
            Node n = sortedNodes.get(i);
            result[i] = new int[n.neighbors.size()];
            for (int j = 0; j < n.neighbors.size(); j++) {
                result[i][j] = n.neighbors.get(j).val;
            }
        }
        return result;
    }
`
        },
        cpp: {
            parser: `
Node* jsonToGraphNode(vector<vector<int>> adjList) {
    if (adjList.empty()) return nullptr;
    vector<Node*> nodes;
    for (size_t i = 0; i < adjList.size(); i++) {
        nodes.push_back(new Node(i + 1));
    }
    for (size_t i = 0; i < adjList.size(); i++) {
        for (int neighborVal : adjList[i]) {
            nodes[i]->neighbors.push_back(nodes[neighborVal - 1]);
        }
    }
    return nodes[0];
}
`,
            serializer: `
vector<vector<int>> graphNodeToJson(Node* node) {
    if (!node) return {};
    map<int, Node*> visited;
    queue<Node*> q;
    visited[node->val] = node;
    q.push(node);
    while (!q.empty()) {
        Node* curr = q.front();
        q.pop();
        for (Node* nei : curr->neighbors) {
            if (visited.find(nei->val) == visited.end()) {
                visited[nei->val] = nei;
                q.push(nei);
            }
        }
    }
    vector<vector<int>> result;
    for (auto const& [val, n] : visited) {
        vector<int> neighbors;
        for (Node* nei : n->neighbors) {
            neighbors.push_back(nei->val);
        }
        result.push_back(neighbors);
    }
    return result;
}
`
        }
    },
    Node: {
        typescript: {
            parser: `
function jsonToGraphNode(adjList: number[][]): Node | null {
    if (!adjList || adjList.length === 0) return null;
    const nodes: Node[] = [];
    for (let i = 0; i < adjList.length; i++) {
        nodes.push(new Node(i + 1));
    }
    for (let i = 0; i < adjList.length; i++) {
        for (const neighborVal of adjList[i]) {
            nodes[i].neighbors.push(nodes[neighborVal - 1]);
        }
    }
    return nodes[0];
}
`,
            serializer: `
function graphNodeToJson(node: Node | null): number[][] {
    if (!node) return [];
    const map = new Map<number, Node>();
    const queue = [node];
    map.set(node.val, node);
    while (queue.length) {
        const curr = queue.shift()!;
        for (const nei of (curr.neighbors || [])) {
            if (!map.has(nei.val)) {
                map.set(nei.val, nei);
                queue.push(nei);
            }
        }
    }
    const sortedNodes = Array.from(map.values()).sort((a,b) => a.val - b.val);
    const result: number[][] = [];
    for (const n of sortedNodes) {
        result.push(n.neighbors.map(nei => nei.val));
    }
    return result;
}
`
        },
        python: {
            parser: `
def json_to_graph_node(adjList):
    if not adjList: return None
    nodes = []
    for i in range(len(adjList)):
        nodes.append(Node(i + 1))
    for i in range(len(adjList)):
        for neighborVal in adjList[i]:
            nodes[i].neighbors.append(nodes[neighborVal - 1])
    return nodes[0]
`,
            serializer: `
def graph_node_to_json(node):
    if not node: return []
    visited = {}
    queue = [node]
    visited[node.val] = node
    while queue:
        curr = queue.pop(0)
        for nei in (curr.neighbors or []):
            if nei.val not in visited:
                visited[nei.val] = nei
                queue.append(nei)
    sorted_nodes = sorted(visited.values(), key=lambda x: x.val)
    result = []
    for n in sorted_nodes:
        result.append([nei.val for nei in n.neighbors])
    return result
`
        },
        java: {
            parser: `
    private static Node jsonToGraphNode(int[][] adjList) {
        if (adjList == null || adjList.length == 0) return null;
        List<Node> nodes = new ArrayList<>();
        for (int i = 0; i < adjList.length; i++) {
            nodes.add(new Node(i + 1));
        }
        for (int i = 0; i < adjList.length; i++) {
            for (int neighborVal : adjList[i]) {
                nodes.get(i).neighbors.add(nodes.get(neighborVal - 1));
            }
        }
        return nodes.get(0);
    }
`,
            serializer: `
    private static int[][] graphNodeToJson(Node node) {
        if (node == null) return new int[0][0];
        Map<Integer, Node> map = new HashMap<>();
        Queue<Node> queue = new LinkedList<>();
        map.put(node.val, node);
        queue.add(node);
        while (!queue.isEmpty()) {
            Node curr = queue.poll();
            for (Node nei : curr.neighbors) {
                if (!map.containsKey(nei.val)) {
                    map.put(nei.val, nei);
                    queue.add(nei);
                }
            }
        }
        List<Node> sortedNodes = new ArrayList<>(map.values());
        Collections.sort(sortedNodes, (a, b) -> a.val - b.val);
        int[][] result = new int[sortedNodes.size()][];
        for (int i = 0; i < sortedNodes.size(); i++) {
            Node n = sortedNodes.get(i);
            result[i] = new int[n.neighbors.size()];
            for (int j = 0; j < n.neighbors.size(); j++) {
                result[i][j] = n.neighbors.get(j).val;
            }
        }
        return result;
    }
`
        },
        cpp: {
            parser: `
Node* jsonToGraphNode(vector<vector<int>> adjList) {
    if (adjList.empty()) return nullptr;
    vector<Node*> nodes;
    for (size_t i = 0; i < adjList.size(); i++) {
        nodes.push_back(new Node(i + 1));
    }
    for (size_t i = 0; i < adjList.size(); i++) {
        for (int neighborVal : adjList[i]) {
            nodes[i]->neighbors.push_back(nodes[neighborVal - 1]);
        }
    }
    return nodes[0];
}
`,
            serializer: `
vector<vector<int>> graphNodeToJson(Node* node) {
    if (!node) return {};
    map<int, Node*> visited;
    queue<Node*> q;
    visited[node->val] = node;
    q.push(node);
    while (!q.empty()) {
        Node* curr = q.front();
        q.pop();
        for (Node* nei : curr->neighbors) {
            if (visited.find(nei->val) == visited.end()) {
                visited[nei->val] = nei;
                q.push(nei);
            }
        }
    }
    vector<vector<int>> result;
    for (auto const& [val, n] : visited) {
        vector<int> neighbors;
        for (Node* nei : n->neighbors) {
            neighbors.push_back(nei->val);
        }
        result.push_back(neighbors);
    }
    return result;
}
`
        }
    },
    TrieNode: {
        typescript: {
            parser: `
function jsonToTrieNode(obj: any): TrieNode {
    if(!obj) return new TrieNode();
    const root = new TrieNode();
    root.isEnd = obj.isEnd;
    for (const key in obj.children) {
        root.children[key] = jsonToTrieNode(obj.children[key]);
    }
    return root;
}
`,
            serializer: `
function trieNodeToJson(root: TrieNode | null): any {
    if (!root) return null;
    const obj: any = { isEnd: root.isEnd, children: {} };
    for (const key in root.children) {
        obj.children[key] = trieNodeToJson(root.children[key]);
    }
    return obj;
}
`
        },
        python: {
            parser: `
def json_to_trie_node(obj):
    if not obj: return TrieNode()
    root = TrieNode()
    root.is_end = obj.get('is_end', False)
    children = obj.get('children', {})
    for key in children:
        root.children[key] = json_to_trie_node(children[key])
    return root
`,
            serializer: `
def trie_node_to_json(root):
    if not root: return None
    obj = {'is_end': root.is_end, 'children': {}}
    for key in root.children:
        obj['children'][key] = trie_node_to_json(root.children[key])
    return obj
`
        },
        java: {
            parser: `
    // Trie parser omitted due to complexity of generic Map<String, Object> handling in strict Java without external libs (Jackson/Gson).
    // Assuming simple structure or unused for now.
    private static TrieNode jsonToTrieNode(String json) { return new TrieNode(); }
`,
            serializer: `
    // Trie serializer omitted
    private static String trieNodeToJson(TrieNode root) { return "{}"; }
`
        },
        cpp: {
            parser: `
    // Trie parser omitted
    TrieNode* jsonToTrieNode(string json) { return new TrieNode(); }
`,
            serializer: `
    // Trie serializer omitted
    string trieNodeToJson(TrieNode* root) { return "{}"; }
`
        }
    }
};
