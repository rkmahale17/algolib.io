
class Solution {
public:
int countComponents(int n, vector<vector<int>>& edges) {

    // Initialize parent array where each node is its own parent initially.
    vector<int> parent(n);
    // Initialize rank array to 1 for each node.  Rank is used to optimize union operation (union by rank).
    vector<int> rank(n, 1);

    // Initially, each node is its own component.
    for (int i = 0; i < n; i++) {
        parent[i] = i;
    }

    // Initially, the number of components equals the number of nodes.
    int result = n;

    // Iterate through the edges and perform the union operation.
    for (auto &edge : edges) {
        // Unite the two nodes connected by the edge. If they were already in the same component,
        // unite function returns 0, otherwise, it unites them and returns 1.
        // Subtract the returned value from the result, effectively reducing the component count.
        result -= unite(edge[0], edge[1], parent, rank);
    }

    // Return the final number of connected components.
    return result;
}


private:

// Find the root/representative of the set/component that the node belongs to.
int find(int node, vector<int>& parent) {
    int res = node;

    // Traverse to find the root.  The root is the node whose parent is itself.
    while (res != parent[res]) {
        // Path compression:  Update the parent of the current node to be the grandparent.
        // This flattens the tree structure and makes future find operations faster.
        parent[res] = parent[parent[res]]; // path compression
        res = parent[res];
    }

    // Return the root of the component.
    return res;
}

// Unite two components containing nodes n1 and n2, respectively.
int unite(int n1, int n2, vector<int>& parent, vector<int>& rank) {

    // Find the roots of the components that n1 and n2 belong to.
    int p1 = find(n1, parent);
    int p2 = find(n2, parent);

    // If n1 and n2 are already in the same component (i.e., have the same root),
    // then there's nothing to do. Return 0 to indicate no change in component count.
    if (p1 == p2) {
        return 0;
    }

    // Union by rank: Attach the smaller rank tree under the root of the higher rank tree.
    // This helps to keep the tree relatively flat, thus optimizing find operations.
    if (rank[p2] > rank[p1]) {
        parent[p1] = p2;
        rank[p2] += rank[p1];
    } else {
        parent[p2] = p1;
        rank[p1] += rank[p2];
    }

    // Return 1 to indicate that two components have been merged.
    return 1;
}

};
