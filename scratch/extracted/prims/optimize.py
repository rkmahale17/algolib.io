def minCostConnectPoints(points):

    N = len(points)

    # Function to calculate Manhattan distance
    def manhattan_distance(p1, p2):
        return abs(p1[0] - p2[0]) + abs(p1[1] - p2[1])

    # Create edges with their weights (Manhattan distances)
    edges = []
    for i in range(N):
        for j in range(i + 1, N):
            dist = manhattan_distance(points[i], points[j])
            edges.append((dist, i, j))

    # Sort edges by weight
    edges.sort()

    # Initialize Disjoint Set Union (DSU) data structure
    parent = list(range(N))
    rank = [0] * N

    def find(i):
        if parent[i] == i:
            return i
        parent[i] = find(parent[i])  # Path compression
        return parent[i]

    def union(i, j):
        root_i = find(i)
        root_j = find(j)
        if root_i != root_j:
            if rank[root_i] < rank[root_j]:
                parent[root_i] = root_j
            elif rank[root_i] > rank[root_j]:
                parent[root_j] = root_i
            else:
                parent[root_j] = root_i
                rank[root_i] += 1
            return True  # Union performed
        return False  # Already in the same set

    # Kruskal's algorithm
    min_cost = 0
    num_edges = 0
    for cost, u, v in edges:
        if union(u, v):
            min_cost += cost
            num_edges += 1
            if num_edges == N - 1:
                break  # MST is complete

    return min_cost