function networkDelayTime(times: number[][], n: number, k: number): number {
    const edges: Map<number, [number, number][]> = new Map();

    // Build adjacency list:  node -> [(neighbor, weight)]
    for (const [u, v, w] of times) {
        if (!edges.has(u)) {
            edges.set(u, []);
        }
        edges.get(u)!.push([v, w]);
    }

    // Min heap: [time, node].  Simulated with array and sorting.
    const minHeap: [number, number][] = [[0, k]]; // Start at node k with time 0

    const visit = new Set<number>(); // Keep track of visited nodes
    let t = 0; // Maximum time it takes to reach all nodes

    while (minHeap.length > 0) {
        // Get node with smallest time from the minHeap
        minHeap.sort((a, b) => a[0] - b[0]); // Sort by time
        const [w1, n1] = minHeap.shift()!;

        // If already visited, skip
        if (visit.has(n1)) continue;

        // Mark as visited
        visit.add(n1);
        t = Math.max(t, w1); // Update the maximum time

        // Explore neighbors
        const neighbors = edges.get(n1) || [];

        for (const [n2, w2] of neighbors) {
            // If neighbor not visited, add to minHeap with updated time
            if (!visit.has(n2)) {
                minHeap.push([w1 + w2, n2]);
            }
        }
    }

    // If all nodes visited, return the maximum time, otherwise return -1
    return visit.size === n ? t : -1;
}