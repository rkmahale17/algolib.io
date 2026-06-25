# Definition for a graph node (if needed)
# class GraphNode:
#     def __init__(self, val):
#         self.val = val
#         self.neighbors = []

# n: The number of nodes in the graph.

def count_components(n: int, edges: list[list[int]]) -> int:

    # Initialize parent array, where each node is its own parent.
    # This means each node initially forms its own disjoint set.
    parent = list(range(n))
    # Initialize rank array, used to optimize the union operation.
    # Rank is an estimate of the height of the tree; initially all are 1.
    rank = [1] * n

    def find(node: int) -> int:
        """Finds the root/representative of the set to which a node belongs, with path compression."""
        res = node  # Start at the given node
        # Traverse upwards until we find the root (parent[res] == res)
        while res != parent[res]:
            # Path compression: point the current node to its grandparent.
            # This flattens the tree structure, improving future find operations.
            parent[res] = parent[parent[res]]
            res = parent[res]  # Move to the next node (parent)
        return res  # Return the root of the set

    def union(n1: int, n2: int) -> int:
        """Unions the sets containing two nodes by rank. Returns 1 if a union occurred, 0 otherwise."""
        p1 = find(n1)  # Find the root of the set containing n1
        p2 = find(n2)  # Find the root of the set containing n2

        if p1 == p2:  # If they have the same root, they are already in the same set
            return 0  # No union is performed

        # Union by rank: attach the tree with the smaller rank to the tree with the larger rank.
        # This helps to keep the tree relatively flat, improving performance.
        if rank[p2] > rank[p1]:
            parent[p1] = p2  # Attach p1's tree to p2's tree
            rank[p2] += rank[p1]  # Update the rank of p2's tree
        else:
            parent[p2] = p1  # Attach p2's tree to p1's tree
            rank[p1] += rank[p2]  # Update the rank of p1's tree

        return 1  # A union occurred

    result = n  # Initially, each node is its own component

    # Iterate through the edges and perform the union operation
    for n1, n2 in edges:
        result -= union(n1, n2)  # Decrement component count for each successful union

    return result  # Return the final number of connected components