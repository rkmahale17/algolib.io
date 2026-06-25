

public static class Solution {
    public int minCostConnectPoints(int[][] points) {
        int N = points.length;

        // Adjacency list: node -> List of [cost, neighbor]
        // Key is the node index, Value is a list of int arrays, where each int array
        // represents an edge to a neighbor.  The int array contains [cost, neighbor_index]
        Map<Integer, List<int[]>> adj = new HashMap<>();
        // Initialize the adjacency list for each point/node
        for (int i = 0; i < N; i++) {
            adj.put(i, new ArrayList<>());
        }

        // Build graph: Calculate Manhattan distance between all pairs of points
        for (int i = 0; i < N; i++) {
            int x1 = points[i][0]; // x-coordinate of point i
            int y1 = points[i][1]; // y-coordinate of point i

            for (int j = i + 1; j < N; j++) {
                int x2 = points[j][0]; // x-coordinate of point j
                int y2 = points[j][1]; // y-coordinate of point j

                // Calculate Manhattan distance between points i and j
                int dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);

                // Add edge from i to j and from j to i (undirected graph)
                adj.get(i).add(new int[]{dist, j});
                adj.get(j).add(new int[]{dist, i});
            }
        }

        int result = 0; // Total cost of the minimum spanning tree
        Set<Integer> visit = new HashSet<>(); // Set to keep track of visited nodes

        // Min heap: [cost, node]
        // PriorityQueue that stores edges as int arrays [cost, node]. It orders them based on cost.
        PriorityQueue<int[]> minHeap = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        minHeap.offer(new int[]{0, 0}); // Start from node 0 with cost 0.  Adding initial node with cost 0 to start Prim's.

        // Prim's algorithm: Iterate until all nodes are visited
        while (visit.size() < N) {
            // Extract minimum cost edge
            int[] curr = minHeap.poll(); // Get the edge with the minimum cost from the heap
            int cost = curr[0]; // Cost of the edge
            int node = curr[1]; // Node connected by the edge

            // Skip if already visited
            if (visit.contains(node)) continue; // If node has already been visited, skip to the next edge

            result += cost; // Add cost to the result (MST cost)
            visit.add(node); // Mark node as visited

            // Add neighbors to the min heap
            for (int[] neighbor : adj.get(node)) {
                int neiCost = neighbor[0]; // Cost to the neighbor
                int nei = neighbor[1]; // Neighbor node
                // Add neighbor to the min heap if it hasn't been visited yet
                if (!visit.contains(nei)) {
                    minHeap.offer(new int[]{neiCost, nei});
                }
            }
        }

        return result; // Return the total cost of the minimum spanning tree
    }
}