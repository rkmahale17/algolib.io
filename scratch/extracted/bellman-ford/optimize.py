def findCheapestPrice(n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:
    # Initialize prices array with infinity for all cities except the source.
    prices = [float('inf')] * n
    prices[src] = 0

    # Iterate k+1 times, where k is the maximum number of stops allowed.
    # Each iteration represents considering paths with up to 'i' stops.
    for i in range(k + 1):
        # Create a temporary array to store the prices for the current iteration.
        # This prevents updates from prematurely affecting the calculations.
        tmp_prices = prices[:]

        # Iterate through all the flights.
        for s, d, p in flights:
            # If the price to reach the source city 's' is infinity,
            # it means we cannot reach this city yet, so skip this flight.
            if prices[s] == float('inf'):
                continue

            # If taking the current flight [s, d, p] improves the minimum price to reach
            # the destination city 'd', update the temporary price.
            if prices[s] + p < tmp_prices[d]:
                tmp_prices[d] = prices[s] + p

        # Update the prices array with the temporary prices after each iteration.
        # This ensures that we're considering the best prices with up to 'i' stops.
        prices = tmp_prices[:]

    # After k+1 iterations, the prices array contains the minimum prices to reach each city.
    # Return the price to reach the destination city 'dst' if it's not infinity.
    # Otherwise, return -1 to indicate that the destination is not reachable within k stops.
    return prices[dst] if prices[dst] != float('inf') else -1