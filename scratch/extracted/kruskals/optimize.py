def min_cost_connect_points(points):
    # Function to calculate Manhattan distance between two points
    def manhattan_distance(p1, p2):
        return abs(p1[0] - p2[0]) + abs(p1[1] - p2[1])

    n = len(points)
    # Initialize an empty list to store edges (cost, point1_index, point2_index)
    edges = []
    # Iterate through all pairs of points to calculate Manhattan distances and create edges
    for i in range(n):
        for j in range(i + 1, n):
            edges.append((manhattan_distance(points[i], points[j]), i, j))

    # Sort the edges in non-decreasing order of their costs
    edges.sort()

    # Initialize the parent list for the Union-Find data structure
    parent = list(range(n))

    # Find operation with path compression
    def find(i):
        # If i is the parent of itself, it's the root
        if parent[i] == i:
            return i
        # Path compression: set the parent of i to the root of its component
        parent[i] = find(parent[i])  
        return parent[i]

    # Union operation
    def union(i, j):
        # Find the roots of the components that i and j belong to
        root_i = find(i)
        root_j = find(j)
        # If i and j are in different components
        if root_i != root_j:
            # Merge the components by setting the parent of root_i to root_j
            parent[root_i] = root_j
            return True  # Indicate that a union occurred
        return False  # Indicate that no union occurred

    # Initialize the minimum cost and the number of edges in the MST
    min_cost = 0
    num_edges = 0
    # Iterate through the sorted edges
    for cost, i, j in edges:
        # If adding the edge (i, j) does not create a cycle
        if union(i, j):
            # Add the cost to the total cost
            min_cost += cost
            # Increment the number of edges in the MST
            num_edges += 1
            # If we have added n-1 edges, we have formed the MST, so break
            if num_edges == n - 1:
                break

    # Return the total cost of the MST
    return min_cost