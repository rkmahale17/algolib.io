
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
 * Calculates positions for graph nodes in a circular layout.
 */
export function calculateGraphPositions(
    nodes: (number[] | { val: number; neighbors?: any[] })[],
    width: number = 400,
    height: number = 250
): { nodes: any[]; edges: any[] } {
    if (!nodes || nodes.length === 0) return { nodes: [], edges: [] };

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    const positionedNodes = nodes.map((node, i) => {
        const angle = (i / nodes.length) * 2 * Math.PI;
        const val = (typeof node === 'object' && node !== null && 'val' in node) ? node.val : i;
        return {
            id: `node-${i}`,
            val: val,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            originalIndex: i
        };
    });

    const edges: any[] = [];
    const seenEdges = new Set<string>();

    nodes.forEach((node, i) => {
        const neighbors = Array.isArray(node) ? node : (node.neighbors || []);
        neighbors.forEach((neighbor: number | { val: number }) => {
            const neighborIdx = typeof neighbor === 'number' ? neighbor : neighbor.val;

            // Avoid duplicate edges in undirected graph visualization
            const edgeKey = [i, neighborIdx].sort().join('-');
            if (!seenEdges.has(edgeKey) && positionedNodes[neighborIdx]) {
                edges.push({
                    x1: positionedNodes[i].x,
                    y1: positionedNodes[i].y,
                    x2: positionedNodes[neighborIdx].x,
                    y2: positionedNodes[neighborIdx].y
                });
                seenEdges.add(edgeKey);
            }
        });
    });

    return { nodes: positionedNodes, edges };
}

/**
 * Checks if a type or value structure represents a graph.
 */
export function isGraphType(type?: string): boolean {
    return type === 'Node' || type === 'GraphNode' || type === 'adjacency-list';
}

/**
 * Safely parses a string value that might be an adjacency list.
 */
export function parseGraphValue(value: unknown): number[][] | null {
    if (Array.isArray(value)) {
        // Basic check if it's number[][]
        if (value.length === 0 || Array.isArray(value[0])) return value;
        return null;
    }

    if (typeof value === 'string') {
        let cleaned = value.trim();
        const start = cleaned.indexOf('[');
        const end = cleaned.lastIndexOf(']');

        if (start !== -1 && end !== -1 && end > start) {
            cleaned = cleaned.substring(start, end + 1);
        }

        try {
            const parsed = JSON.parse(cleaned);
            if (Array.isArray(parsed) && (parsed.length === 0 || Array.isArray(parsed[0]))) {
                return parsed;
            }
        } catch {
            return null;
        }
    }
    return null;
}
