function dfs(graph: number[][], start: number): number[] {
  // visited set to keep track of visited nodes.
  const visited = new Set<number>();
  // result array stores the order of visited nodes.
  const result: number[] = [];

  // Recursive helper function to explore the graph.
  function explore(node: number) {
    // Mark the current node as visited.
    visited.add(node);
    // Add the current node to the result.
    result.push(node);

    // Iterate through the neighbors of the current node.
    for (const neighbor of graph[node]) {
      // If the neighbor has not been visited,
      if (!visited.has(neighbor)) {
        // Recursively explore the neighbor.
        explore(neighbor);
      }
    }
  }

  // Start the DFS traversal from the given start node.
  explore(start);
  // Return the result array.
  return result;
}