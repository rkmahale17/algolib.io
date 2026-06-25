public static class Solution {

  // Used to maintain the order of insertion into the priority queue, in case of ties in fScore.
  int orderCounter = 0;

  public List<int[]> aStar(int[][] grid, int[] start, int[] goal) {

    // Get the number of rows and columns in the grid.
    int rows = grid.length, cols = grid[0].length;

    // Initialize a priority queue to store nodes to be explored.  Nodes with lower fScore are prioritized.
    PriorityQueue<Node> openSet =
      new PriorityQueue<>(
        (a, b) -> a.fScore != b.fScore
          ? a.fScore - b.fScore
          : a.order - b.order // If fScores are equal, prioritize by insertion order
      );

    // Initialize a map to store the cost (gScore) from the start node to each node.
    Map<Integer, Integer> gScore = new HashMap<>();
    // Initialize a map to store the parent of each node, which is used to reconstruct the path.
    Map<Integer, Integer> parent = new HashMap<>();

    // Initialize a 2D boolean array to keep track of visited nodes.
    boolean[][] closed = new boolean[rows][cols];

    // Calculate unique keys for the start and goal nodes.
    int startKey = start[0] * cols + start[1];
    int goalKey = goal[0] * cols + goal[1];

    // The cost from the start node to itself is 0.
    gScore.put(startKey, 0);

    // Add the start node to the open set with its initial fScore.
    openSet.add(
      new Node(
        start[0],
        start[1],
        heuristic(start, goal),
        orderCounter++
      )
    );

    // Define possible movement directions (up, right, down, left).
    int[][] directions = {{0,1},{1,0},{0,-1},{-1,0}};

    // While there are nodes to explore in the open set:
    while (!openSet.isEmpty()) {

      // Get the node with the lowest fScore from the open set.
      Node current = openSet.poll();

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
      for (int[] direction : directions) {

        // Calculate the row and column indices of the neighbor.
        int neighborRow = current.row + direction[0];
        int neighborCol = current.col + direction[1];

        // Check if the neighbor is within the grid bounds and is not an obstacle.
        if (
          neighborRow < 0 ||
          neighborCol < 0 ||
          neighborRow >= rows ||
          neighborCol >= cols ||
          grid[neighborRow][neighborCol] == 1
        ) continue;

        // Calculate the key for the neighbor.
        int neighborKey = neighborRow * cols + neighborCol;

        // Calculate the cost from the start node to the neighbor through the current node.
        int newGScore = gScore.get(currentKey) + 1;

        // If the neighbor has not been visited or the new gScore is lower than the previous gScore:
        if (
          !gScore.containsKey(neighborKey) ||
          newGScore < gScore.get(neighborKey)
        ) {

          // Update the gScore and parent of the neighbor.
          gScore.put(neighborKey, newGScore);
          parent.put(neighborKey, currentKey);

          // Calculate the fScore of the neighbor.
          int fScore =
            newGScore +
            Math.abs(neighborRow - goal[0]) +
            Math.abs(neighborCol - goal[1]);

          // Add the neighbor to the open set.
          openSet.add(
            new Node(
              neighborRow,
              neighborCol,
              fScore,
              orderCounter++
            )
          );
        }
      }
    }

    // If no path is found, return an empty list.
    return new ArrayList<>();
  }

  // Heuristic function (Manhattan distance) to estimate the cost from a node to the goal.
  int heuristic(int[] a, int[] b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  }

  // Reconstruct the path from the goal node to the start node using the parent map.
  List<int[]> buildPath(
    Map<Integer,Integer> parent,
    int currentKey,
    int cols
  ) {

    // Initialize the path list.
    List<int[]> path = new ArrayList<>();

    // Backtrack from the goal to the start.
    while (true) {
      path.add(0, new int[]{currentKey / cols, currentKey % cols});
      if (!parent.containsKey(currentKey)) break;
      currentKey = parent.get(currentKey);
    }

    // Return the reconstructed path.
    return path;
  }

  // Inner class representing a node in the grid.
  static class Node {

    int row;
    int col;
    int fScore;
    int order;

    Node(int row, int col, int fScore, int order) {
      this.row = row;
      this.col = col;
      this.fScore = fScore;
      this.order = order;
    }
  }
}