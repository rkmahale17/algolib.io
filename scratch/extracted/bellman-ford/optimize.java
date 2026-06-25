

public static class Solution {
    /**
     * Finds the cheapest price from src to dst with at most k stops using Bellman-Ford algorithm.
     *
     * @param n       The number of cities.
     * @param flights The list of flights, where flights[i] = [fromi, toi, pricei].
     * @param src     The source city.
     * @param dst     The destination city.
     * @param k       The maximum number of stops allowed.
     * @return The cheapest price from src to dst with at most k stops, or -1 if no such route exists.
     */
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        // Initialize an array to store the minimum prices to each city from the source.
        // Initially, set all prices to infinity except for the source city, which is 0.
        int[] prices = new int[n];
        Arrays.fill(prices, Integer.MAX_VALUE);
        prices[src] = 0;

        // Iterate k+1 times, where k is the maximum number of stops allowed.
        // Each iteration relaxes the edges, updating the minimum prices.
        for (int i = 0; i <= k; i++) {
            // Create a temporary array to store the prices for this iteration.
            // This prevents updates from affecting other calculations within the same iteration.
            int[] tmpPrices = Arrays.copyOf(prices, n);

            // Iterate through each flight in the flights array.
            for (int[] flight : flights) {
                int s = flight[0]; // Source city of the flight.
                int d = flight[1]; // Destination city of the flight.
                int p = flight[2]; // Price of the flight.

                // If the price to reach the source city 's' is still infinity,
                // it means it's not reachable, so we skip this flight.
                if (prices[s] == Integer.MAX_VALUE) continue;

                // If the price to reach the destination city 'd' through city 's'
                // is cheaper than the current minimum price to reach 'd',
                // update the temporary prices array.
                if (prices[s] + p < tmpPrices[d]) {
                    tmpPrices[d] = prices[s] + p;
                }
            }

            // Update the prices array with the values from the temporary array.
            // This ensures that the prices are updated after each iteration.
            prices = Arrays.copyOf(tmpPrices, n);
        }

        // After k+1 iterations, the prices array contains the minimum prices to each city
        // with at most k stops. If the price to reach the destination city 'dst' is still infinity,
        // it means it's not reachable within k stops, so we return -1.
        // Otherwise, we return the minimum price to reach 'dst'.
        return prices[dst] == Integer.MAX_VALUE ? -1 : prices[dst];
    }
}