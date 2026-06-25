function aStar(grid: number[][], start: [number, number], goal: [number, number]): [number, number][] {
  // Get the number of rows in the grid
  const rows = grid.length
  // Get the number of columns in the grid
  const cols = grid[0].length

  // Define the heuristic function (Manhattan distance) to estimate the cost from a node to the goal
  const heuristic = (x: number, y: number) =>
    Math.abs(x - goal[0]) + Math.abs(y - goal[1])

  // Define possible movement directions (up, right, down, left)
  const dirs = [[0,1],[1,0],[0,-1],[-1,0]]

  // Initialize the open set with the starting node and its f-score (heuristic from start to goal)
  // The open set is a list of [f-score, x-coordinate, y-coordinate]
  const openSet: [number, number, number][] = [[heuristic(...start), start[0], start[1]]]

  // Initialize a map to store the node from which we reached a given node (for path reconstruction)
  const cameFrom = new Map<number, number>()
  // Initialize a map to store the cost from the start node to a given node
  const gScore = new Map<number, number>()
  // Initialize a set to store nodes that have already been evaluated
  const closedSet = new Set<number>()

  // Calculate a unique key for the starting node
  const startKey = start[0]*cols + start[1]
  // Set the g-score of the starting node to 0
  gScore.set(startKey, 0)

  // While there are nodes to evaluate in the open set
  while(openSet.length) {
    // Sort the open set by f-score (ascending order)
    openSet.sort((a,b)=>a[0]-b[0])
    // Get the node with the lowest f-score from the open set
    const [, x, y] = openSet.shift()!

    // Calculate the unique key for the current node
    const key = x*cols + y

    // If the current node has already been evaluated, skip it
    if(closedSet.has(key)) continue
    // Mark the current node as evaluated
    closedSet.add(key)

    // If the current node is the goal node, reconstruct and return the path
    if(x === goal[0] && y === goal[1]) {
      // Initialize the path with an empty array
      const path: [number,number][] = []
      // Start from the goal node
      let curr = key

      // Reconstruct the path by backtracking from the goal to the start
      while(curr !== startKey) {
        // Calculate the x and y coordinates of the current node
        const cx = Math.floor(curr/cols)
        const cy = curr%cols
        // Add the current node to the beginning of the path
        path.unshift([cx,cy])
        // Move to the parent node
        curr = cameFrom.get(curr)!
      }

      // Add the starting node to the beginning of the path
      path.unshift(start)
      // Return the reconstructed path
      return path
    }

    // For each neighbor of the current node
    for(const [dx,dy] of dirs) {
      // Calculate the coordinates of the neighbor node
      const nx = x+dx
      const ny = y+dy

      // If the neighbor node is out of bounds or is an obstacle, skip it
      if(nx<0 || ny<0 || nx>=rows || ny>=cols || grid[nx][ny]===1) continue

      // Calculate the unique key for the neighbor node
      const neighborKey = nx*cols+ny
      // Calculate the tentative g-score for the neighbor node
      const tentative = gScore.get(key)! + 1

      // If the neighbor node has not been visited yet, or if the tentative g-score is better than the current g-score
      if(!gScore.has(neighborKey) || tentative < gScore.get(neighborKey)!) {
        // Update the cameFrom map
        cameFrom.set(neighborKey, key)
        // Update the g-score
        gScore.set(neighborKey, tentative)

        // Calculate the f-score for the neighbor node
        const f = tentative + heuristic(nx,ny)
        // Add the neighbor node to the open set
        openSet.push([f,nx,ny])
      }
    }
  }

  // If no path is found, return an empty array
  return []
}