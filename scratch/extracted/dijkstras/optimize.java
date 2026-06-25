
public static class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        // Build the adjacency list (graph) to represent the network.
        Map<Integer, List<int[]>> edges = new HashMap<>();
        for (int[] time : times) {
            int u = time[0]; // Source node
            int v = time[1]; // Target node
            int w = time[2]; // Weight (travel time)
            edges.computeIfAbsent(u, key -> new ArrayList<>()).add(new int[]{v, w});
        }

        // Priority queue (min-heap) to store nodes to visit, prioritized by their distance from the source.
        PriorityQueue<int[]> minHeap = new PriorityQueue<>(Comparator.comparingInt(a -> a[0])); // [distance, node]
        minHeap.offer(new int[]{0, k}); // Start at node k with a distance of 0.

        Set<Integer> visit = new HashSet<>(); // Keep track of visited nodes.
        int t = 0; // Variable to store the maximum time taken to reach all nodes.

        while (!minHeap.isEmpty()) {
            int[] current = minHeap.poll(); // Get the node with the smallest distance.
            int w1 = current[0]; // Distance to the current node
            int n1 = current[1]; // Current node

            if (visit.contains(n1)) continue; // If already visited, skip.

            visit.add(n1); // Mark the current node as visited.
            t = Math.max(t, w1); // Update the maximum time.

            List<int[]> neighbors = edges.getOrDefault(n1, new ArrayList<>()); // Get neighbors of current node.

            for (int[] neighbor : neighbors) {
                int n2 = neighbor[0]; // Neighbor node
                int w2 = neighbor[1]; // Weight of the edge to the neighbor
                if (!visit.contains(n2)) {
                    minHeap.offer(new int[]{w1 + w2, n2}); // Add neighbor to the priority queue with updated distance.
                }
            }
        }

        // If all nodes have been visited, return the maximum time. Otherwise, return -1.
        return visit.size() == n ? t : -1;
    }
}