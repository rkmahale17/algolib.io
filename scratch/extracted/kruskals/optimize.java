import java.util.*;

public static class Solution {

    public int minCostConnectPoints(int[][] points) {

        int N = points.length;

        // adjacency list: node -> {cost, neighbor}
        Map<Integer, List<int[]>> adj = new HashMap<>();

        // Initialize the adjacency list for each point
        for (int i = 0; i < N; i++) {
            adj.put(i, new ArrayList<>());
        }

        // Build graph using Manhattan distance
        for (int i = 0; i < N; i++) {

            int x1 = points[i][0];
            int y1 = points[i][1];

            // Iterate through all other points to create edges
            for (int j = i + 1; j < N; j++) {

                int x2 = points[j][0];
                int y2 = points[j][1];

                // Calculate Manhattan distance between points i and j
                int dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);

                // Add edge to adjacency list for both points i and j
                adj.get(i).add(new int[]{dist, j});
                adj.get(j).add(new int[]{dist, i});
            }
        }

        int result = 0;

        // Keep track of visited nodes
        Set<Integer> visit = new HashSet<>();

        // Min heap [cost, node]
        // PriorityQueue to store edges with their costs, sorted by cost
        PriorityQueue<int[]> minHeap =
                new PriorityQueue<>((a, b) -> a[0] - b[0]);

        // Start from node 0 with cost 0
        minHeap.offer(new int[]{0, 0});

        // While not all nodes are visited
        while (visit.size() < N) {

            // Get the edge with the minimum cost from the heap
            int[] top = minHeap.poll();
            int cost = top[0];
            int node = top[1];

            // If node is already visited, skip it
            if (visit.contains(node)) continue;

            // Add the cost to the result
            result += cost;
            // Mark the node as visited
            visit.add(node);

            // Iterate through all neighbors of the current node
            for (int[] edge : adj.get(node)) {

                int neiCost = edge[0];
                int nei = edge[1];

                // If the neighbor is not visited, add it to the heap
                if (!visit.contains(nei)) {
                    minHeap.offer(new int[]{neiCost, nei});
                }
            }
        }

        return result;
    }
}