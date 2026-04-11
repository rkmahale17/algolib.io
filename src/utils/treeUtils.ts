
export interface TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
}

/**
 * Deserializes a LeetCode-style array (BFS) to a tree structure.
 * Example: [1, 2, 3, null, null, 4, 5]
 */
export function deserializeTree(arr: (number | null)[]): TreeNode | null {
    if (!arr || arr.length === 0 || arr[0] === null) return null;

    const root: TreeNode = { val: arr[0]!, left: null, right: null };
    const queue: TreeNode[] = [root];
    let i = 1;

    while (i < arr.length) {
        const current = queue.shift()!;

        if (i < arr.length && arr[i] !== null) {
            current.left = { val: arr[i]!, left: null, right: null };
            queue.push(current.left);
        }
        i++;

        if (i < arr.length && arr[i] !== null) {
            current.right = { val: arr[i]!, left: null, right: null };
            queue.push(current.right);
        }
        i++;
    }

    return root;
}

/**
 * Serializes a tree to a LeetCode-style array (BFS).
 */
export function serializeTree(root: TreeNode | null): (number | null)[] {
    if (!root) return [];

    const result: (number | null)[] = [];
    const queue: (TreeNode | null)[] = [root];

    while (queue.length > 0) {
        const node = queue.shift()!;
        if (node) {
            result.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
        } else {
            result.push(null);
        }
    }

    // Remove trailing nulls
    while (result.length > 0 && result[result.length - 1] === null) {
        result.pop();
    }

    return result;
}

/**
 * Converts a TreeNode object structure (with val, left, right) to a BFS array.
 */
export function convertTreeNodeToArray(obj: any): (number | null)[] | null {
    if (!obj || typeof obj !== 'object' || !('val' in obj)) return null;
    return serializeTree(obj as TreeNode);
}

/**
 * Calculates positions for each node in a tree for SVG rendering.
 * Uses a basic hierarchical layout.
 */
export interface TreePosition {
    val: number | string;
    x: number;
    y: number;
    left?: TreePosition;
    right?: TreePosition;
}

export function calculateTreePositions(
    root: TreeNode | null,
    width: number = 400,
    rowHeight: number = 60
): { nodes: any[]; edges: any[] } {
    if (!root) return { nodes: [], edges: [] };

    const nodes: any[] = [];
    const edges: any[] = [];

    const traverse = (
        node: TreeNode,
        depth: number,
        xRange: [number, number],
        parentId?: string
    ) => {
        const x = (xRange[0] + xRange[1]) / 2;
        const y = depth * rowHeight + 40;
        const nodeId = `${node.val}-${depth}-${x}`;

        nodes.push({ id: nodeId, val: node.val, x, y });

        if (parentId !== undefined) {
            // Find parent coordinates (less efficient but keeps it simple for now)
            // Actually, let's pass parent coordinates down
        }

        if (node.left) {
            const leftX = (xRange[0] + x) / 2;
            const leftY = (depth + 1) * rowHeight + 40;
            edges.push({ x1: x, y1: y, x2: leftX, y2: leftY });
            traverse(node.left, depth + 1, [xRange[0], x], nodeId);
        }

        if (node.right) {
            const rightX = (x + xRange[1]) / 2;
            const rightY = (depth + 1) * rowHeight + 40;
            edges.push({ x1: x, y1: y, x2: rightX, y2: rightY });
            traverse(node.right, depth + 1, [x, xRange[1]], nodeId);
        }
    };

    traverse(root, 0, [0, width], undefined);

    return { nodes, edges };
}

/**
 * Checks if a type or value structure represents a tree.
 */
export function isTreeType(type?: string, value?: any): boolean {
    if (type === 'TreeNode' || type === 'binary-tree') return true;

    // Also check if the value contains multiple tree definitions (e.g., p = [...], q = [...])
    if (typeof value === 'string') {
        const hasMultiple = (value.match(/p\s*=/g) || []).length > 0 && (value.match(/q\s*=/g) || []).length > 0;
        const hasArrays = (value.match(/\[[\s\d,null\-]*\]/g) || []).length >= 2;
        if (hasMultiple || hasArrays) return true;
    }

    return false;
}

/**
 * Safely parses a string value that might be a tree array.
 */
export function parseTreeValue(value: any): (number | null)[] | null {
    if (Array.isArray(value)) return value;

    if (typeof value === 'object' && value !== null) {
        if ('val' in value) return convertTreeNodeToArray(value);
        return null;
    }

    if (typeof value === 'string') {
        const trees = parseAllTreeValues(value);
        return trees.length > 0 ? trees[0].data : null;
    }
    return null;
}

/**
 * Parses all tree arrays from a string, optionally prefixed with variable names.
 * Example: "root = [1,2], p = [1], q = [2]" -> [{label: 'root', data: [1,2]}, {label: 'p', data: [1]}, {label: 'q', data: [2]}]
 */
export function parseAllTreeValues(value: any): { label?: string, data: (number | null)[] }[] {
    if (Array.isArray(value)) return [{ data: value }];

    if (typeof value === 'object' && value !== null) {
        if ('val' in value) {
            const arr = convertTreeNodeToArray(value);
            return arr ? [{ data: arr }] : [];
        }
        return [];
    }

    if (typeof value === 'string') {
        const results: { label?: string, data: (number | null)[] }[] = [];
        
        // Pattern to find variable assignment: label = [ ... ]
        // The [ ... ] part is captured and parsed as JSON
        const assignmentRegex = /([a-zA-Z0-9_]+)\s*=\s*(\[[^\]]*\])/g;
        let match;
        const seenIndices = new Set<number>();

        while ((match = assignmentRegex.exec(value)) !== null) {
            try {
                const label = match[1];
                const arrayStr = match[2];
                const data = JSON.parse(arrayStr);
                if (Array.isArray(data)) {
                    results.push({ label, data });
                    // Mark this range as seen
                    for (let i = match.index; i < assignmentRegex.lastIndex; i++) {
                        seenIndices.add(i);
                    }
                }
            } catch {
                // Ignore invalid matches
            }
        }

        // Also look for standalone arrays that weren't part of an assignment
        const standaloneRegex = /\[[\s\d,null\-.]+\]/g;
        while ((match = standaloneRegex.exec(value)) !== null) {
            // Skip if this is part of an already captured assignment
            if (seenIndices.has(match.index)) continue;

            try {
                const data = JSON.parse(match[0]);
                if (Array.isArray(data)) {
                    results.push({ data });
                }
            } catch {
                // Ignore invalid matches
            }
        }

        if (results.length > 0) return results;

        // Fallback for very basic strings if no arrays were found
        let cleaned = value.trim();
        const start = cleaned.indexOf('[');
        const end = cleaned.lastIndexOf(']');
        if (start !== -1 && end !== -1 && end > start) {
            cleaned = cleaned.substring(start, end + 1);
            try {
                const parsed = JSON.parse(cleaned);
                if (Array.isArray(parsed)) return [{ data: parsed }];
            } catch {}
        }
    }

    return [];
}
