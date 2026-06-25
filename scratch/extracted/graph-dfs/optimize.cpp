// Definition for a graph node (if needed).
// struct GraphNode {
//     int val;
//     vector<GraphNode*> neighbors;
//     GraphNode(int x) : val(x) {}
// };

class Solution {
private:
    /**
     * Recursive helper function to perform Depth-First Search starting from a given node.
     */
    void explore(vector<vector<int>>& graph, int node,
                 unordered_set<int>& visited, vector<int>& result) {

        // Mark current node as visited
        visited.insert(node);

        // Add node to result
        result.push_back(node);

        // Iterate through neighbors
        for (int neighbor : graph[node]) {
            // If neighbor not visited, explore recursively
            if (visited.find(neighbor) == visited.end()) {
                explore(graph, neighbor, visited, result);
            }
        }
    }

public:
    /**
     * Performs Depth-First Search starting from a given node
     */
    vector<int> dfs(vector<vector<int>>& graph, int start) {

        unordered_set<int> visited;
        vector<int> result;

        explore(graph, start, visited, result);

        return result;
    }
};