
class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        // Initialize a vector 'prices' to store the minimum cost to reach each city from the source city.
        // Initially, set the cost to reach each city to infinity (INT_MAX).
        vector<int> prices(n, INT_MAX);

        // The cost to reach the source city from itself is 0.
        prices[src] = 0;

        // Iterate 'k + 1' times.  'k' represents the maximum number of stops allowed.
        // We iterate 'k + 1' times because the number of edges traversed can be at most 'k + 1'.
        for (int i = 0; i <= k; i++) {
            // Create a temporary vector 'tmpPrices' to store the updated prices after each iteration.
            // This is necessary to avoid updating prices based on already updated values within the same iteration.
            vector<int> tmpPrices = prices;

            // Iterate through each flight in the 'flights' vector.
            for (auto& flight : flights) {
                // 's' is the source city of the current flight.
                int s = flight[0];
                // 'd' is the destination city of the current flight.
                int d = flight[1];
                // 'p' is the price of the current flight.
                int p = flight[2];

                // If the source city 's' is not reachable (i.e., its price is still INT_MAX), skip this flight.
                if (prices[s] == INT_MAX) continue;

                // Check if the current flight offers a cheaper path to the destination city 'd'.
                // If the cost to reach 's' plus the price of the flight 'p' is less than the current minimum cost to reach 'd',
                // update the minimum cost to reach 'd' in the 'tmpPrices' vector.
                if (prices[s] + p < tmpPrices[d]) {
                    tmpPrices[d] = prices[s] + p;
                }
            }

            // After iterating through all the flights, update the 'prices' vector with the values in 'tmpPrices'.
            // This ensures that the prices are updated based on the previous iteration's values.
            prices = tmpPrices;
        }

        // After 'k + 1' iterations, check if the destination city 'dst' is reachable.
        // If the cost to reach 'dst' is still INT_MAX, it means the destination is not reachable within 'k' stops, so return -1.
        // Otherwise, return the minimum cost to reach 'dst'.
        return prices[dst] == INT_MAX ? -1 : prices[dst];
    }
};