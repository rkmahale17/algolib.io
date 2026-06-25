def floydWarshall(n: int, edges: list[list[int]]) -> list[list[int]]:

  # Initialize the distance matrix with infinity for all pairs of vertices.
  dist = [[float('inf')] * n for _ in range(n)]
  
  # Initialize distances.
  # The distance from a vertex to itself is 0.
  for i in range(n):
    dist[i][i] = 0
  # Populate the distance matrix with the direct distances given by the edges.
  for u, v, w in edges:
    dist[u][v] = w
  
  # Floyd-Warshall algorithm.
  # Iterate through all possible intermediate vertices k.
  for k in range(n):
    # Iterate through all possible starting vertices i.
    for i in range(n):
      # Iterate through all possible ending vertices j.
      for j in range(n):
        # If there is a path from i to k and from k to j,
        # check if the path from i to j through k is shorter than the current path from i to j.
        if dist[i][k] != float('inf') and dist[k][j] != float('inf'):
          # Update the distance from i to j if the path through k is shorter.
          dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
  
  # Return the distance matrix containing the shortest paths between all pairs of vertices.
  return dist