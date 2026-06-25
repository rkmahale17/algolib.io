class Solution {
public:
  vector < int > bfs(vector<vector<int>> & graph, int start) {
  // Initialize an unordered set to keep track of visited nodes.
  unordered_set < int > visited;
  // Initialize a queue for BFS traversal.
  queue < int > q;
  // Initialize a vector to store the result (BFS traversal order).
  vector < int > result;

  // Mark the starting node as visited and enqueue it.
  visited.insert(start);
  q.push(start);

  // Perform BFS until the queue is empty.
  while (!q.empty()) {
    // Dequeue a node from the front of the queue.
    int node = q.front();
    q.pop();
    // Add the dequeued node to the result vector.
    result.push_back(node);

    // Iterate through the neighbors of the current node.
    for (int neighbor : graph[node]) {
           // If the neighbor has not been visited yet...
      if (visited.find(neighbor) == visited.end()) {
        // Mark the neighbor as visited.
        visited.insert(neighbor);
        // Enqueue the neighbor for further exploration.
        q.push(neighbor);
      }
    }
  }

  // Return the BFS traversal result.
  return result;
}
};
