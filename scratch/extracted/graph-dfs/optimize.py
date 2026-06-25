def dfs(graph, start):

    # Initialize a set to keep track of visited nodes.
    visited = set()
    # Initialize a list to store the DFS traversal result.
    result = []

    # Define a recursive helper function to explore the graph.
    def explore(node):
        # Mark the current node as visited.
        visited.add(node)
        # Append the current node to the result list.
        result.append(node)

        # Iterate through the neighbors of the current node.
        for neighbor in graph[node]:
            # If the neighbor has not been visited,
            if neighbor not in visited:
                # Recursively explore the neighbor.
                explore(neighbor)

    # Start the DFS traversal from the given start node.
    explore(start)
    # Return the list of visited nodes in DFS order.
    return result