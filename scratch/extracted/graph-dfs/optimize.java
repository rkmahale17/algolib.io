    
    /**
     * Recursive helper function to perform Depth-First Search starting from a given node.
     * @param graph The adjacency list representation of the graph.
     * @param node The current node being explored.
     * @param visited A set to keep track of visited nodes to avoid cycles.
     * @param result A list to store the nodes in the order they are visited.
     */
    private void explore(List<List<Integer>> graph, int node,
        
        Set<Integer> visited, List<Integer> result) {

        // Mark the current node as visited
        visited.add(node);
        
        // Add the current node to the result list
        result.add(node);

        // Get the list of neighbors for the current node
        List<Integer> neighbors = graph.get(node);

        // Iterate through each neighbor
        for (int neighbor : neighbors) {
            // If the neighbor has not been visited, recursively explore it
            if (!visited.contains(neighbor)) {
                explore(graph, neighbor, visited, result);
            }
        }
        
    }

    /**
     * Performs Depth-First Search on a graph starting from a given node.
     * @param graph The adjacency list representation of the graph.
     * @param start The starting node for the DFS traversal.
     * @return A list of integers representing the nodes visited in DFS order.
     */
    public List<Integer> dfs(List<List<Integer>> graph, int start) {
        // Initialize a set to keep track of visited nodes
        Set<Integer> visited = new HashSet<>();
        
        // Initialize a list to store the result of the DFS traversal
        List<Integer> result = new ArrayList<>();

        // Call the recursive helper function to perform DFS
        explore(graph, start, visited, result);

        // Return the list of visited nodes
        return result;
    }

 