
class Solution {
public:
    int minCostConnectPoints(vector<vector<int>>& points) {
        int N = points.size();

        // Adjacency list: node -> list of {cost, neighbor}
        // Represents the graph where each node stores a list of its neighbors and the corresponding edge costs.
        unordered_map<int, vector<pair<int,int>>> adj;

        // Initialize the adjacency list for each node.
        for (int i = 0; i < N; i++) {
            adj[i] = {};
        }

        // Build graph with Manhattan distances
        // Iterate through all pairs of points to create edges based on Manhattan distance.
        for (int i = 0; i < N; i++) {
            int x1 = points[i][0];
            int y1 = points[i][1];

            for (int j = i + 1; j < N; j++) {
                int x2 = points[j][0];
                int y2 = points[j][1];

                // Calculate Manhattan distance between points i and j.
                int dist = abs(x1 - x2) + abs(y1 - y2);

                // Add edges to the adjacency list for both nodes i and j.
                adj[i].push_back({dist, j});
                adj[j].push_back({dist, i});
            }
        }

        int result = 0; // Total cost of the Minimum Spanning Tree (MST).
        unordered_set<int> visit; // Keep track of visited nodes.

        // Min heap: {cost, node}
        // Priority queue to store nodes with their costs, used to select the next closest node.
        priority_queue<
            pair<int,int>,
            vector<pair<int,int>>,
            greater<pair<int,int>>
        > minHeap;

        // Start from node 0 with cost 0.
        minHeap.push({0, 0}); 

        // Prim's algorithm: Iterate until all nodes are visited.
        while (visit.size() < N) {
            // Get the node with the minimum cost from the min heap.
            auto [cost, node] = minHeap.top();
            minHeap.pop();

            // If the node is already visited, skip it.
            if (visit.count(node)) continue;

            // Add the cost to the result.
            result += cost;
            // Mark the node as visited.
            visit.insert(node);

            // Iterate through the neighbors of the current node.
            for (auto &[neiCost, nei] : adj[node]) {
                // If the neighbor is not visited, add it to the min heap.
                if (!visit.count(nei)) {
                    minHeap.push({neiCost, nei});
                }
            }
        }

        // Return the total cost of the MST.
        return result;
    }
};
