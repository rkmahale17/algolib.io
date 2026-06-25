def a_star(grid, start, goal):

  # Get the number of rows and columns in the grid
  rows, cols = len(grid), len(grid[0])

  # Define the heuristic function (Manhattan distance)
  def heuristic(row, col):
      return abs(row - goal[0]) + abs(col - goal[1])

  # Define possible movement directions (up, right, down, left)
  directions = [(0,1),(1,0),(0,-1),(-1,0)]

  # Initialize the open set with the starting node and its f-score
  open_set = [[heuristic(start[0], start[1]), start[0], start[1]]]

  # Initialize dictionaries to store parent nodes and g-scores
  parent = {}
  g_score = {}

  # Initialize a set to store visited nodes
  closed_set = set()

  # Calculate a unique key for the starting node
  start_key = start[0] * cols + start[1]
  # Set the g-score of the starting node to 0
  g_score[start_key] = 0

  # While there are nodes in the open set
  while open_set:

      # Sort the open set by f-score (ascending order)
      open_set.sort(key=lambda x: x[0])

      # Get the node with the lowest f-score
      _, current_row, current_col = open_set.pop(0)

      # Calculate the key for the current node
      current_key = current_row * cols + current_col

      # If the current node has already been visited, skip it
      if current_key in closed_set:
          continue

      # Mark the current node as visited
      closed_set.add(current_key)

      # If the current node is the goal, reconstruct and return the path
      if current_row == goal[0] and current_col == goal[1]:

          # Initialize the path list
          path = []
          # Start from the goal
          current = current_key

          # Backtrack from the goal to the start
          while current != start_key:

              # Calculate the row and column indices from the key
              row = current // cols
              col = current % cols

              # Insert the current node at the beginning of the path
              path.insert(0, [row, col])

              # Move to the parent node
              current = parent[current]

          # Insert the start node at the beginning of the path
          path.insert(0, start)

          # Return the path
          return path

      # For each possible direction
      for direction_row, direction_col in directions:

          # Calculate the neighbor's row and column
          neighbor_row = current_row + direction_row
          neighbor_col = current_col + direction_col

          # Check if the neighbor is out of bounds or is an obstacle
          if (
              neighbor_row < 0 or
              neighbor_col < 0 or
              neighbor_row >= rows or
              neighbor_col >= cols or
              grid[neighbor_row][neighbor_col] == 1
          ):
              continue

          # Calculate the neighbor's key
          neighbor_key = neighbor_row * cols + neighbor_col

          # Calculate the tentative g-score for the neighbor
          tentative_g = g_score[current_key] + 1

          # If the neighbor is not in g_score or the tentative g-score is better than the current g-score
          if (
              neighbor_key not in g_score or
              tentative_g < g_score[neighbor_key]
          ):

              # Update the parent of the neighbor
              parent[neighbor_key] = current_key
              # Update the g-score of the neighbor
              g_score[neighbor_key] = tentative_g

              # Calculate the f-score for the neighbor
              f_score = tentative_g + heuristic(neighbor_row, neighbor_col)

              # Add the neighbor to the open set
              open_set.append(
                  [f_score, neighbor_row, neighbor_col]
              )

  # If no path is found, return an empty list
  return []