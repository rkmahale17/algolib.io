function minCostConnectPoints(points: number[][]): number {
    const n = points.length; // Get the number of points.

    // Helper function to calculate Manhattan distance between two points.
    function manhattanDistance(p1: number[], p2: number[]): number {
        return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]); // Calculate Manhattan distance: |x1 - x2| + |y1 - y2|.
    }

    // Build the edges array: [u, v, weight], where u and v are point indices and weight is the Manhattan distance.
    const edges: number[][] = [];
    for (let i = 0; i < n; i++) { // Iterate through each point.
        for (let j = i + 1; j < n; j++) { // Iterate through the remaining points to avoid duplicates.
            edges.push([i, j, manhattanDistance(points[i], points[j])]); // Create an edge with the two point indices and their Manhattan distance.
        }
    }

    // Sort edges by weight in ascending order. This is crucial for Kruskal's algorithm.
    edges.sort((a, b) => a[2] - b[2]); // Sort based on the weight (Manhattan distance) which is the third element of each edge.

    // Initialize disjoint set (Union-Find) data structure.
    const parent: number[] = Array(n).fill(0).map((_, i) => i); // Each point initially is its own parent.

    // Find operation with path compression.  Finds the root/representative of the set to which element i belongs.
    function find(i: number): number {
        if (parent[i] === i) { // If the parent of i is i itself, then i is the root of its set.
            return i; // Return the root.
        }
        return parent[i] = find(parent[i]); // Path compression: set the parent of i to the root of its set directly.
    }

    // Union operation.  Merges the sets containing elements i and j.
    function union(i: number, j: number): void {
        const rootI = find(i); // Find the root of the set containing i.
        const rootJ = find(j); // Find the root of the set containing j.
        if (rootI !== rootJ) { // If i and j are in different sets.
            parent[rootI] = rootJ; // Make the root of i's set point to the root of j's set, merging the two sets.
        }
    }

    let mstCost = 0; // Initialize the total cost of the MST.
    let edgesUsed = 0; // Initialize the count of edges added to the MST.

    // Kruskal's algorithm: Iterate through the sorted edges and add edges to the MST if they don't form a cycle.
    for (const edge of edges) {
        const u = edge[0]; // Get the first point index of the edge.
        const v = edge[1]; // Get the second point index of the edge.
        const weight = edge[2]; // Get the weight (Manhattan distance) of the edge.

        if (find(u) !== find(v)) { // Check if adding the edge creates a cycle. If the roots are different, it doesn't create a cycle.
            union(u, v); // Merge the sets containing u and v.
            mstCost += weight; // Add the weight of the edge to the MST cost.
            edgesUsed++; // Increment the count of edges used.
            if (edgesUsed === n - 1) { // If we have added n-1 edges, we have connected all points, so we can stop.
                break; // Exit the loop.
            }
        }
    }

    return mstCost; // Return the total cost of the minimum spanning tree.
}