public static  class Solution {
    public int[][] floydWarshall(int n, int[][] edges) {
        int[][] dist = new int[n][n];

        // Initialize distances between all pairs of nodes.
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                // If i == j, the distance is 0 (distance to itself).
                // Otherwise, initialize to a large value (representing infinity) to indicate no path.
                // Integer.MAX_VALUE / 2 is used to prevent integer overflow during calculations.
                dist[i][j] = (i == j) ? 0 : Integer.MAX_VALUE / 2; // Avoid overflow
            }
        }

        // Populate the distance matrix with the direct edge weights from the input.
        for (int[] edge : edges) {
            int u = edge[0]; // Source node of the edge.
            int v = edge[1]; // Destination node of the edge.
            int w = edge[2]; // Weight of the edge.
            dist[u][v] = w; // Set the distance from u to v to the weight w.
        }

        // Floyd-Warshall algorithm: Find the shortest path between all pairs of nodes.
        // Iterate through all possible intermediate nodes 'k'.
        for (int k = 0; k < n; k++) {
            // Iterate through all possible source nodes 'i'.
            for (int i = 0; i < n; i++) {
                // Iterate through all possible destination nodes 'j'.
                for (int j = 0; j < n; j++) {
                    // Check if going from 'i' to 'j' through 'k' is shorter than the current distance.
                    // dist[i][j] is the current shortest distance from 'i' to 'j'.
                    // dist[i][k] + dist[k][j] is the distance from 'i' to 'j' through 'k'.
                    dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }

        // Return the resulting distance matrix, which contains the shortest path distances between all pairs of nodes.
        return dist;
    }
}