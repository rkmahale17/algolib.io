// Function to perform Breadth-First Search (BFS) on a graph
function bfs(graph: number[][], start: number): number[] {
  // Initialize a set to keep track of visited nodes
  const visited = new Set<number>();
  
  // Initialize a queue for BFS traversal, starting with the given start node
  const queue: number[] = [start];
  
  // Initialize an array to store the BFS traversal result
  const result: number[] = [];

  // Mark the starting node as visited
  visited.add(start);

  // Continue the traversal as long as the queue is not empty
  while (queue.length > 0) {
    // Dequeue a node from the front of the queue
    const node = queue.shift()!;
    
    // Add the dequeued node to the result array
    result.push(node);

    // Iterate through the neighbors of the current node
    for (const neighbor of graph[node]) {
      // If the neighbor has not been visited
      if (!visited.has(neighbor)) {
        // Mark the neighbor as visited
        visited.add(neighbor);
        
        // Enqueue the neighbor to the back of the queue
        queue.push(neighbor);
      }
    }
  }

  // Return the BFS traversal result
  return result;
}