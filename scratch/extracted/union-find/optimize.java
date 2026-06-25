

public static class Solution {

public int countComponents(int n, int[][] edges) {
    // Initialize the parent array. Each node is its own parent initially.
    int[] parent = new int[n];
    // Initialize the rank array. Rank is used to optimize the union operation.
    int[] rank = new int[n];

    // Initially, each node is its own root, and the rank is 1.
    for (int i = 0; i < n; i++) {
        parent[i] = i;
        rank[i] = 1;
    }

    // Initially, the number of components is the number of nodes.
    int result = n;

    // Iterate through each edge and perform the union operation.
    for (int[] edge : edges) {
        // The union operation returns 1 if a union was performed (i.e., the nodes were in different components).
        // We decrement the result (number of components) if a union was performed.
        result -= union(edge[0], edge[1], parent, rank);
    }

    // Return the final number of connected components.
    return result;
}

// The find operation with path compression.
private int find(int node, int[] parent) {
    int res = node;

    // Find the root of the node.
    while (res != parent[res]) {
        // Path compression: make the node's parent the grandparent.
        parent[res] = parent[parent[res]]; 
        res = parent[res];
    }

    // Return the root of the node.
    return res;
}

// The union operation with rank optimization.
private int union(int n1, int n2, int[] parent, int[] rank) {
    // Find the roots of the two nodes.
    int p1 = find(n1, parent);
    int p2 = find(n2, parent);

    // If the roots are the same, the nodes are already in the same component, so return 0 (no union performed).
    if (p1 == p2) {
        return 0;
    }

    // Union by rank: attach the smaller rank tree to the larger rank tree.
    if (rank[p2] > rank[p1]) {
        parent[p1] = p2;
        rank[p2] += rank[p1];
    } else {
        parent[p2] = p1;
        rank[p1] += rank[p2];
    }

    // Return 1 to indicate that a union was performed.
    return 1;
}

}
