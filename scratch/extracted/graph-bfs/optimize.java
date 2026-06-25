

/**
 * Performs a Breadth-First Search (BFS) traversal on a given graph.
 *
 * @param graph A 2D array representing the adjacency list of the graph.
 *              graph[i] contains a list of neighbors of node i.
 * @param start The starting node for the BFS traversal.
 * @return A list of nodes visited in BFS order, starting from the start node.
 */

  public static List<Integer> bfs(List<List<Integer>> graph, int start) {
    // Use a Set to keep track of visited nodes to avoid cycles.
    Set<Integer> visited = new HashSet<>();

    // Use a Queue to maintain the order of nodes to visit (FIFO).
    Queue<Integer> queue = new LinkedList<>();

    // Store the result, i.e., the nodes visited in BFS order.
    List<Integer> result = new ArrayList<>();

    // Mark the starting node as visited and enqueue it.
    visited.add(start);
    queue.offer(start);

    // While the queue is not empty, continue the traversal.
    while (!queue.isEmpty()) {
      // Dequeue a node from the queue.
      int node = queue.poll();

      // Add the dequeued node to the result list.
      result.add(node);

      // Iterate through the neighbors of the current node.
      for (int neighbor : graph.get(node)) {
        // If the neighbor has not been visited,
        if (!visited.contains(neighbor)) {
          // Mark it as visited and enqueue it.
          visited.add(neighbor);
          queue.offer(neighbor);
        }
      }
    }

    // Return the list of nodes visited in BFS order.
    return result;
  }
