function minCostConnectPoints(points: number[][]): number {
  const N = points.length; // Total number of points.

  // adjacency list: node -> [cost, neighbor]
  // The adjacency list stores the graph's connections.  Each key is a node (point index), and the value is an array of [cost, neighbor] pairs.
  const adj: Map<number, [number, number][]> = new Map();

  // Initialize the adjacency list with empty arrays for each point.
  for (let i = 0; i < N; i++) {
    adj.set(i, []);
  }

  // build graph
  // Iterate through all pairs of points to calculate Manhattan distances and populate the adjacency list.
  for (let i = 0; i < N; i++) {
    const [x1, y1] = points[i]; // Coordinates of the first point.

    for (let j = i + 1; j < N; j++) {
      const [x2, y2] = points[j]; // Coordinates of the second point.

      const dist = Math.abs(x1 - x2) + Math.abs(y1 - y2); // Calculate Manhattan distance.

      adj.get(i)!.push([dist, j]); // Add the connection from point i to point j with the calculated distance.
      adj.get(j)!.push([dist, i]); // Add the connection from point j to point i with the calculated distance.
    }
  }

  let result = 0; // Initialize the total cost (minimum spanning tree weight) to 0.
  const visit = new Set<number>(); // Keep track of visited nodes to avoid cycles.

  // min heap [cost, node]
  // The min-heap stores edges with their costs, allowing us to efficiently select the minimum cost edge.
  const minHeap: [number, number][] = [[0, 0]]; // Initialize the min-heap with a starting node (node 0) and a cost of 0.

  // Prim's algorithm: Iterate until all nodes are visited.
  while (visit.size < N) {

    // extract minimum
    minHeap.sort((a, b) => a[0] - b[0]); // Sort minHeap to simulate priority queue behavior (smallest cost at front).
    const [cost, node] = minHeap.shift()!; // Extract the minimum cost edge from the min-heap.

    // If the node is already visited, skip this edge.
    if (visit.has(node)) continue;

    result += cost; // Add the cost of the edge to the total cost.
    visit.add(node); // Mark the node as visited.

    // Iterate through the neighbors of the current node.
    for (const [neiCost, nei] of adj.get(node)!) {
      // If the neighbor has not been visited, add the edge to the min-heap.
      if (!visit.has(nei)) {
        minHeap.push([neiCost, nei]);
      }
    }
  }

  return result; // Return the total minimum cost to connect all points.
}