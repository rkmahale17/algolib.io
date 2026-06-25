function findCheapestPrice(
  n: number,
  flights: number[][],
  src: number,
  dst: number,
  k: number
): number {
  // Initialize an array to store the minimum prices to reach each city from the source.
  const prices: number[] = new Array(n).fill(Infinity);
  // The price to reach the source city itself is 0.
  prices[src] = 0;

  // Iterate k+1 times, where k is the maximum number of stops allowed. Each iteration represents one more stop.
  for (let i = 0; i <= k; i++) {
    // Create a temporary array to store the updated prices for the current iteration.
    // This ensures that updates are based on the previous iteration's prices.
    const tmpPrices = [...prices];

    // Iterate through each flight to find potentially cheaper paths.
    for (const [s, d, p] of flights) {
      // If the source city 's' is unreachable (price is Infinity), skip this flight.
      if (prices[s] === Infinity) continue;

      // If going from 's' to 'd' via this flight 'p' is cheaper than the current cheapest price to 'd',
      // update the temporary price for city 'd'.
      if (prices[s] + p < tmpPrices[d]) {
        tmpPrices[d] = prices[s] + p;
      }
    }

    // After iterating through all flights, update the 'prices' array with the 'tmpPrices' for the next iteration.
    for (let j = 0; j < n; j++) {
      prices[j] = tmpPrices[j];
    }
  }

  // After k+1 iterations, check if the destination city 'dst' is reachable.
  // If prices[dst] is still Infinity, it means there's no path within k stops, so return -1.
  // Otherwise, return the cheapest price to reach the destination.
  return prices[dst] === Infinity ? -1 : prices[dst];
}