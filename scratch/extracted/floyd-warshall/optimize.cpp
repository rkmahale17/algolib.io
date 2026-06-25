class Solution {
public:
    vector<vector<int>> floydWarshall(int n, vector<vector<int>>& edges) {

        const int INF = INT_MAX / 2; // Initialize infinity as a large value to avoid potential overflow during addition.
        vector<vector<int>> dist(n, vector<int>(n)); // Initialize the distance matrix with dimensions n x n.

        // Initialize distances
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i == j) dist[i][j] = 0; // The distance from a node to itself is 0.
                else dist[i][j] = INF; // Initialize all other distances to infinity, indicating no direct path.
            }
        }

        // Add edges
        for (auto &edge : edges) {
            int u = edge[0]; // Source node of the edge.
            int v = edge[1]; // Destination node of the edge.
            int w = edge[2]; // Weight of the edge.
            dist[u][v] = w; // Update the distance matrix with the weight of the edge from u to v.
        }

        // Floyd-Warshall algorithm implementation
        // Iterate through all possible intermediate nodes (k).
        for (int k = 0; k < n; k++) {
            // Iterate through all possible source nodes (i).
            for (int i = 0; i < n; i++) {
                // Iterate through all possible destination nodes (j).
                for (int j = 0; j < n; j++) {
                    // Check if going from i to j through k is shorter than the current distance.
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }

        return dist; // Return the updated distance matrix containing the shortest path between all pairs of nodes.
    }
};