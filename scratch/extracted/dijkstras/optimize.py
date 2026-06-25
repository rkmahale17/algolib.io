def networkDelayTime(times: list[list[int]], n: int, k: int) -> int:
    # Create an adjacency list (dictionary) to represent the graph.
    # Key: source node, Value: list of (neighbor, weight) pairs.
    edges = {}
    for u, v, w in times:
        if u not in edges:
            edges[u] = []
        edges[u].append((v, w))

    # Initialize the min-heap with the starting node and its initial time (0).
    # The min-heap stores (time, node) pairs, where time is the time to reach the node from the source.
    minHeap = [(0, k)]  # (time, node)

    # 'visit' is a set to keep track of visited nodes to avoid cycles and redundant processing.
    visit = set()

    # 't' will store the maximum time it takes to reach all reachable nodes from the source.
    t = 0

    # Dijkstra's algorithm: iterate while the min-heap is not empty.
    while minHeap:
        # Sort the minHeap to get the smallest element. Note: heapq would be more efficient here for a true heap implementation.
        minHeap.sort()

        # Get the node with the smallest time from the min-heap.
        w1, n1 = minHeap.pop(0)

        # If the node has already been visited, skip it.
        if n1 in visit:
            continue

        # Mark the node as visited.
        visit.add(n1)

        # Update the maximum time 't' seen so far.  This represents the longest shortest path.
        t = max(t, w1)

        # Iterate through the neighbors of the current node.
        if n1 in edges:
            for n2, w2 in edges[n1]:
                # If a neighbor has not been visited, add it to the min-heap with its updated time.
                if n2 not in visit:
                    minHeap.append((w1 + w2, n2))

    # After the loop finishes, check if all nodes have been visited.
    # If yes, return the overall time 't'. Otherwise, return -1, indicating that not all nodes are reachable.
    return t if len(visit) == n else -1