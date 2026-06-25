function floydWarshall(n: number, edges: [number, number, number][]): number[][] {
  // Initialize the distance matrix with Infinity for all pairs of vertices.
  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));

  // Set the distance from a vertex to itself to 0.
  for (let i = 0; i < n; i++) dist[i][i] = 0;

  // Populate the distance matrix with the direct edge weights from the input edges.
  // If there's no direct edge, the distance remains Infinity.
  for (const [u, v, w] of edges) {
    // Update the distance between u and v with the weight w, taking the minimum in case of duplicate edges.
    dist[u][v] = Math.min(dist[u][v], w);
  }

  // Floyd-Warshall algorithm: Iterate through all possible intermediate vertices k.
  for (let k = 0; k < n; k++) {
    // Iterate through all possible starting vertices i.
    for (let i = 0; i < n; i++) {
      // Iterate through all possible ending vertices j.
      for (let j = 0; j < n; j++) {
        // Check if going from i to j through k is shorter than the current distance from i to j.
        dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
      }
    }
  }

  // Return the final distance matrix containing the shortest path distances between all pairs of vertices.
  return dist;
}