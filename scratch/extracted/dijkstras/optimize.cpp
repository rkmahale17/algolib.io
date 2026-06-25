

class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {

        // Build adjacency list representing the graph.
        // The keys are the source nodes, and the values are vectors of pairs.
        // Each pair represents a destination node and the weight of the edge.
        unordered_map<int, vector<pair<int,int>>> edges;

        // Iterate through the 'times' vector to populate the adjacency list.
        for (auto &time : times) {
            int u = time[0]; // Source node.
            int v = time[1]; // Destination node.
            int w = time[2]; // Weight of the edge from u to v.
            edges[u].push_back({v, w}); // Add the edge to the adjacency list.
        }

        // Min heap (priority queue) to store nodes to visit, prioritized by distance.
        // The pair stores {distance, node}.
        // 'greater<pair<int,int>>' makes it a min-heap.
        priority_queue<
            pair<int,int>,
            vector<pair<int,int>>,
            greater<pair<int,int>>
        > minHeap;

        // Add the starting node 'k' to the min-heap with a distance of 0.
        minHeap.push({0, k});

        // 'visit' set to keep track of visited nodes.
        set<int> visit;

        // 't' to store the maximum time taken to reach all nodes.
        int t = 0;

        // Dijkstra's algorithm.
        while (!minHeap.empty()) {

            // Get the node with the smallest distance from the min-heap.
            auto [w1, n1] = minHeap.top(); // w1: distance, n1: node.
            minHeap.pop();

            // If the node has already been visited, skip it.
            if (visit.count(n1)) continue;

            // Mark the current node as visited.
            visit.insert(n1);

            // Update the maximum time taken so far.
            t = max(t, w1);

            // Iterate through the neighbors of the current node.
            for (auto &[n2, w2] : edges[n1]) { // n2: neighbor, w2: weight of edge from n1 to n2.
                // If the neighbor has not been visited, add it to the min-heap.
                if (!visit.count(n2)) {
                    minHeap.push({w1 + w2, n2}); // Distance to neighbor is the distance to current node + edge weight.
                }
            }
        }

        // If all nodes have been visited, return the maximum time taken. Otherwise, return -1.
        return visit.size() == n ? t : -1;
    }
};