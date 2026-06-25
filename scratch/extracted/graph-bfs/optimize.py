# Definition for a graph node.
# class GraphNode:
#     def __init__(self, val=0, neighbors=None):
#         self.val = val
#         self.neighbors = neighbors if neighbors is not None else []
def bfs(graph, start):
    # visited: set to keep track of visited nodes to prevent cycles and redundant processing.
    visited = set()
    # queue: queue for BFS traversal, ensuring breadth-wise exploration.
    queue = [start]
    # result: list to store the BFS traversal order, maintaining the order of visited nodes.
    result = []

    # Mark the starting node as visited to avoid revisiting it.
    visited.add(start)

    # While the queue is not empty, continue exploring the graph.
    while queue:
        # Dequeue a vertex from queue, retrieving the next node to process.
        node = queue.pop(0)
        # Add the dequeued vertex to the result list, recording the traversal order.
        result.append(node)

        # Get all adjacent vertices of the dequeued vertex node.
        # If a adjacent has not been visited, then mark it visited
        # and enqueue it for further exploration.
        for neighbor in graph[node]:
            # Check if the neighbor has already been visited.
            if neighbor not in visited:
                # Mark the neighbor as visited to prevent cycles.
                visited.add(neighbor)
                # Enqueue the neighbor for later processing.
                queue.append(neighbor)

    # Return the result list containing the BFS traversal order.
    return result
