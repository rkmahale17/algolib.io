
export interface GraphNode {
    val: number;
    neighbors: GraphNode[];
}

/**
 * Deserializes a LeetCode-style adjacency list (number[][]) to a graph structure.
 * Example: [[1,2],[0,2],[0,1]] where graph[0] = [1,2], graph[1] = [0,2], etc.
 */
export function deserializeGraph(adjList: number[][]): GraphNode[] {
    if (!adjList || adjList.length === 0) return [];

    const nodes: GraphNode[] = adjList.map((_, i) => ({ val: i, neighbors: [] }));

    adjList.forEach((neighbors, i) => {
        neighbors.forEach(neighborIdx => {
            if (nodes[neighborIdx]) {
                nodes[i].neighbors.push(nodes[neighborIdx]);
            }
        });
    });

    return nodes;
}

/**
 * Serializes a graph (array of nodes) to an adjacency list.
 */
export function serializeGraph(nodes: GraphNode[]): number[][] {
    if (!nodes || nodes.length === 0) return [];

    // Map node values to indices if they aren't 0-indexed already
    // but LeetCode usually assumes 0 or 1-indexed.
    // For simplicity, we'll assume the array index is the node's "id".
    return nodes.map(node => node.neighbors.map(n => n.val));
}

/**
 * Calculates positions for graph nodes, handling multiple connected components.
 */
export function calculateGraphPositions(
    inputData: number[][] | { n?: number; startNode?: number; data: number[][]; type?: 'edge-list' | 'adjacency-list' },
    width: number = 400,
    height: number = 250
): { nodes: any[]; edges: any[] } {
    let data: number[][] = [];
    let nCount: number | undefined;
    let startNode: number | undefined;

    if (Array.isArray(inputData)) {
        data = inputData;
    } else {
        data = inputData.data;
        nCount = inputData.n;
        startNode = inputData.startNode;
    }

    if (!data || (data.length === 0 && !nCount)) return { nodes: [], edges: [] };

    // 1. Determine all unique nodes and build adjacency map
    const adj = new Map<number, Set<number>>();
    const allNodesSet = new Set<number>();

    // Initial nodes from nCount
    if (nCount) {
        for (let i = 0; i < nCount; i++) {
            allNodesSet.add(i);
            adj.set(i, new Set());
        }
    }

    // Detect if it's an edge list or adjacency list
    // If any element has length > 2, it must be an adjacency list.
    // However, even [[1,2], [0,2]] could be an adjacency list.
    // A better heuristic: if the max value in the arrays is >= array length, it's likely an edge list.
    let isEdgeList = true;
    let maxVal = -1;
    for (const item of data) {
        if (item.length !== 2) {
            isEdgeList = false;
            break;
        }
        item.forEach(v => { if (typeof v === 'number') maxVal = Math.max(maxVal, v); });
    }

    // Heuristics to distinguish edge list vs adjacency list
    if (isEdgeList) {
        // If the max value is within bounds of the array, and the input string doesn't say "edges", 
        // it might be an adjacency list where every node has 2 neighbors.
        if (maxVal < data.length && maxVal !== -1) {
            // Check if input source explicitly says "edges"
            const sourceStr = typeof inputData === 'object' && !Array.isArray(inputData) ? '' : ''; // We can't easily get the original string here unless passed

            // If it's ambiguous, but data.length is small, adjacency list is a common format
            // for BFS/DFS problems where node i has exactly 2 neighbors.
            // Edge cases: [[0,1]] could be edge 0-1 or node 0 has neighbors 0 and 1.
            // We'll favor adjacency list if maxVal < data.length.
            isEdgeList = false;
        }
    }

    // Override if we have explicit keywords from parseGraphValue
    if (typeof inputData === 'object' && !Array.isArray(inputData)) {
        if (inputData.type === 'edge-list') isEdgeList = true;
        if (inputData.type === 'adjacency-list') isEdgeList = false;
    }

    if (isEdgeList) {
        data.forEach(([u, v]) => {
            if (u === undefined) return;
            allNodesSet.add(u);
            if (!adj.has(u)) adj.set(u, new Set());
            if (v !== undefined) {
                allNodesSet.add(v);
                if (!adj.has(v)) adj.set(v, new Set());
                adj.get(u)!.add(v);
                adj.get(v)!.add(u); // Assume undirected for visualization
            }
        });
    } else {
        data.forEach((neighbors, i) => {
            allNodesSet.add(i);
            if (!adj.has(i)) adj.set(i, new Set());
            neighbors.forEach(neighbor => {
                allNodesSet.add(neighbor);
                if (!adj.has(neighbor)) adj.set(neighbor, new Set());
                adj.get(i)!.add(neighbor);
                adj.get(neighbor)!.add(i);
            });
        });
    }

    const allNodes = Array.from(allNodesSet).sort((a, b) => a - b);

    // 2. Find Connected Components
    const components: number[][] = [];
    const visited = new Set<number>();

    for (const node of allNodes) {
        if (!visited.has(node)) {
            const comp: number[] = [];
            const queue = [node];
            visited.add(node);
            while (queue.length > 0) {
                const u = queue.shift()!;
                comp.push(u);
                const neighbors = adj.get(u);
                if (neighbors) {
                    for (const v of neighbors) {
                        if (!visited.has(v)) {
                            visited.add(v);
                            queue.push(v);
                        }
                    }
                }
            }
            components.push(comp);
        }
    }

    // 3. Layout each component
    const positionedNodes: any[] = [];
    const edges: any[] = [];
    const seenEdges = new Set<string>();

    // Arrange components in a grid or circle
    const numComps = components.length;
    const cols = Math.ceil(Math.sqrt(numComps));
    const rows = Math.ceil(numComps / cols);

    const compWidth = width / cols;
    const compHeight = height / rows;

    components.forEach((comp, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);

        const centerX = col * compWidth + compWidth / 2;
        const centerY = row * compHeight + compHeight / 2;
        const radius = Math.min(compWidth, compHeight) * 0.35;

        // Position nodes in this component's circle
        const compNodesMap = new Map<number, any>();
        comp.forEach((nodeVal, i) => {
            const angle = (i / comp.length) * 2 * Math.PI - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const nodeObj = {
                id: `node-${nodeVal}`,
                val: nodeVal,
                x,
                y,
                isStart: nodeVal === startNode
            };
            positionedNodes.push(nodeObj);
            compNodesMap.set(nodeVal, nodeObj);
        });

        // Add edges within this component
        comp.forEach(u => {
            adj.get(u)?.forEach(v => {
                const edgeKey = [u, v].sort().join("-");
                if (!seenEdges.has(edgeKey)) {
                    const nodeU = compNodesMap.get(u);
                    const nodeV = compNodesMap.get(v);
                    if (nodeU && nodeV) {
                        edges.push({
                            x1: nodeU.x,
                            y1: nodeU.y,
                            x2: nodeV.x,
                            y2: nodeV.y,
                            from: u,
                            to: v
                        });
                        seenEdges.add(edgeKey);
                    }
                }
            });
        });
    });

    return { nodes: positionedNodes, edges };
}

/**
 * Checks if a type or value structure represents a graph.
 */
export function isGraphType(type?: string): boolean {
    return type === 'Node' || type === 'GraphNode' || type === 'adjacency-list' || type === 'edge-list' || type === 'graph' || type === 'edges';
}

/**
 * Safely parses a string value that might be an adjacency list or edge list.
 * Extracts n and start if present.
 */
export function parseGraphValue(value: unknown): { n?: number; startNode?: number; data: number[][]; type?: 'edge-list' | 'adjacency-list' } | null {
    if (Array.isArray(value)) {
        if (value.length === 0 || Array.isArray(value[0])) return { data: value as number[][] };
        return null;
    }

    if (typeof value === 'string') {
        const cleaned = value.trim();

        // Try to distinguish type by keywords
        let type: 'edge-list' | 'adjacency-list' | undefined;
        if (/edges\s*=/i.test(cleaned)) type = 'edge-list';
        else if (/(?:adj|graph|adjList)\s*=/i.test(cleaned)) type = 'adjacency-list';

        // Try to extract n
        const nMatch = cleaned.match(/n\s*=\s*(\d+)/i);
        const n = nMatch ? parseInt(nMatch[1]) : undefined;

        // Try to extract start
        const startMatch = cleaned.match(/start(?:Node)?\s*=\s*(\d+)/i);
        const startNode = startMatch ? parseInt(startMatch[1]) : undefined;

        // Find the brackets part
        const startIdx = cleaned.indexOf('[');
        const endIdx = cleaned.lastIndexOf(']');

        if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
            const arrayPart = cleaned.substring(startIdx, endIdx + 1);
            try {
                const parsed = JSON.parse(arrayPart);
                if (Array.isArray(parsed)) {
                    return { n, startNode, data: parsed, type };
                }
            } catch {
                // If JSON fails, it might be [1,2], [3,4] without outer brackets
                try {
                    const wrapParsed = JSON.parse(`[${arrayPart}]`);
                    if (Array.isArray(wrapParsed)) return { n, startNode, data: wrapParsed, type };
                } catch {
                    return null;
                }
            }
        }
    }
    return null;
}

