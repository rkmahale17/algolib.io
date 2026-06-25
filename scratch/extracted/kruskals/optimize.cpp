#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <queue>
#include <cmath>
#include <algorithm>

using namespace std;

class Solution {
public:
    int minCostConnectPoints(vector<vector<int>>& points) {
        int N = points.size();

        // Adjacency list: node -> list of {cost, neighbor}
        // Stores the graph where each node is connected to its neighbors along with the edge cost.
        unordered_map<int, vector<pair<int,int>>> adj;

        // Initialize the adjacency list for each point.
        for (int i = 0; i < N; i++) {
            adj[i] = {};
        }

        // Build graph with Manhattan distances.
        // Iterate through all pairs of points to calculate Manhattan distances and build the graph.
        for (int i = 0; i < N; i++) {
            int x1 = points[i][0];
            int y1 = points[i][1];

            for (int j = i + 1; j < N; j++) {
                int x2 = points[j][0];
                int y2 = points[j][1];

                // Calculate Manhattan distance between points i and j.
                int dist = abs(x1 - x2) + abs(y1 - y2);

                // Add edge to the adjacency list for both nodes.
                adj[i].push_back({dist, j});
                adj[j].push_back({dist, i});
            }
        }

        int result = 0; // Total cost of the minimum spanning tree.
        unordered_set<int> visit; // Keep track of visited nodes.

        // Min heap: {cost, node}
        // Priority queue to store edges with their costs, sorted by cost.
        priority_queue<
            pair<int,int>,
            vector<pair<int,int>>,
            greater<pair<int,int>>
        > minHeap;

        // Start from node 0 with a cost of 0.
        minHeap.push({0, 0});

        // Kruskal's algorithm using Prim's implementation.
        // Iterate until all nodes are visited.
        while (visit.size() < N) {
            // Get the minimum cost edge.
            auto [cost, node] = minHeap.top();
            minHeap.pop();

            // If the node is already visited, continue.
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

        // Return the total cost of the minimum spanning tree.
        return result;
    }
};