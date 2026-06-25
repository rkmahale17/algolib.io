class Solution {
public:

  // Used to maintain the order of insertion into the priority queue in case of ties in fScore.
  int orderCounter = 0;

  // Structure to represent a node in the A* search.
  struct AStarNode {
    int row, col, fScore, order;
  };

  // Custom comparator for the priority queue.
  struct Compare {
    bool operator()(const AStarNode& a, const AStarNode& b) const {
      // If fScores are different, prioritize the smaller fScore.
      if (a.fScore != b.fScore) return a.fScore > b.fScore;
      // If fScores are equal, prioritize by insertion order.
      return a.order > b.order;
    }
  };

  // Function to find the shortest path using A* search algorithm.
  vector<vector<int>> aStar(
    vector<vector<int>>& grid,
    vector<int>& start,
    vector<int>& goal
  ) {

    // Get the number of rows and columns in the grid.
    int rows = grid.size(), cols = grid[0].size();

    // Initialize a priority queue to store nodes to be explored.  Nodes with lower fScore are prioritized.
    priority_queue<AStarNode, vector<AStarNode>, Compare> openSet;

    // Initialize an unordered map to store the cost (gScore) from the start node to each node.
    unordered_map<int,int> gScore;
    // Initialize an unordered map to store the parent of each node, which is used to reconstruct the path.
    unordered_map<int,int> parent;

    // Initialize a 2D boolean vector to keep track of visited nodes.
    vector<vector<bool>> closed(rows, vector<bool>(cols, false));

    // Calculate unique keys for the start and goal nodes.
    int startKey = start[0] * cols + start[1];
    int goalKey = goal[0] * cols + goal[1];

    // The cost from the start node to itself is 0.
    gScore[startKey] = 0;

    // Add the start node to the open set with its initial fScore.
    openSet.push({
      start[0],
      start[1],
      heuristic(start, goal),
      orderCounter++
    });

    // Define possible movement directions (up, right, down, left).
    int directions[4][2] = {{0,1},{1,0},{0,-1},{-1,0}};

    // While there are nodes to explore in the open set:
    while (!openSet.empty()) {

      // Get the node with the lowest fScore from the open set.
      AStarNode current = openSet.top();
      openSet.pop();

      // If the current node has already been visited, skip it.
      if (closed[current.row][current.col])
        continue;

      // Calculate the key for the current node.
      int currentKey = current.row * cols + current.col;

      // If the current node is the goal, reconstruct and return the path.
      if (currentKey == goalKey)
        return buildPath(parent, currentKey, cols);

      // Mark the current node as visited.
      closed[current.row][current.col] = true;

      // For each neighbor of the current node:
      for (auto& d : directions) {

        // Calculate the row and column indices of the neighbor.
        int nr = current.row + d[0];
        int nc = current.col + d[1];

        // Check if the neighbor is within the grid bounds and is not an obstacle.
        if (
          nr < 0 || nc < 0 ||
          nr >= rows || nc >= cols ||
          grid[nr][nc] == 1
        ) continue;

        // Calculate the key for the neighbor.
        int key = nr * cols + nc;

        // Calculate the cost from the start node to the neighbor through the current node.
        int newG = gScore[currentKey] + 1;

        // If the neighbor has not been visited or the new gScore is lower than the previous gScore:
        if (!gScore.count(key) || newG < gScore[key]) {

          // Update the gScore and parent of the neighbor.
          gScore[key] = newG;
          parent[key] = currentKey;

          // Calculate the fScore of the neighbor.
          int f =
            newG +
            abs(nr - goal[0]) +
            abs(nc - goal[1]);

          // Add the neighbor to the open set.
          openSet.push({
            nr,
            nc,
            f,
            orderCounter++
          });
        }
      }
    }

    // If no path is found, return an empty vector.
    return {};
  }

  // Heuristic function (Manhattan distance) to estimate the cost from a node to the goal.
  int heuristic(vector<int>& a, vector<int>& b) {
    return abs(a[0] - b[0]) + abs(a[1] - b[1]);
  }

  // Reconstruct the path from the goal node to the start node using the parent map.
  vector<vector<int>> buildPath(
    unordered_map<int,int>& parent,
    int key,
    int cols
  ) {

    // Initialize the path vector.
    vector<vector<int>> path;

    // Backtrack from the goal to the start.
    while (true) {

      // Insert the current node at the beginning of the path.
      path.insert(
        path.begin(),
        { key / cols, key % cols }
      );

      // If the current node is the start node, break the loop.
      if (!parent.count(key)) break;

      // Move to the parent node.
      key = parent[key];
    }

    // Return the reconstructed path.
    return path;
  }
};
