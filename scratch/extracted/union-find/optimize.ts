// Function to count the number of connected components in an undirected graph.
function countComponents(n: number, edges: number[][]): number {
  // Initialize the parent array, where parent[i] is the parent of node i.
  // Initially, each node is its own parent, representing individual components.
  const parent: number[] = Array.from({ length: n }, (_, i) => i);

  // Initialize the rank array, which is used to optimize the union operation.
  // Initially, each node has a rank of 1.
  const rank: number[] = new Array(n).fill(1);

  // Find the root/representative of the set to which the node belongs.
  function find(node: number): number {
    let res = node;

    // Traverse up the parent pointers until we find the root (parent[res] === res).
    while (res !== parent[res]) {
      // Path compression: update the parent of the current node to be the grandparent,
      // effectively flattening the tree structure for faster future finds.
      parent[res] = parent[parent[res]];
      res = parent[res];
    }

    return res;
  }

  // Unite the sets containing nodes n1 and n2.
  function union(n1: number, n2: number): number {
    const p1 = find(n1);
    const p2 = find(n2);

    // If n1 and n2 are already in the same set, do nothing and return 0.
    if (p1 === p2) {
      return 0;
    }

    // Union by rank: attach the tree with smaller rank to the tree with larger rank.
    // This helps to keep the tree structure relatively flat, optimizing find operations.
    if (rank[p2] > rank[p1]) {
      parent[p1] = p2;
      rank[p2] += rank[p1];
    } else {
      parent[p2] = p1;
      rank[p1] += rank[p2];
    }

    return 1; // Return 1 to indicate a successful union.
  }

  // Initially, the number of connected components is equal to the number of nodes.
  let result = n;

  // Iterate through the edges and perform the union operation for each edge.
  for (const [n1, n2] of edges) {
    result -= union(n1, n2);
  }

  // Return the final number of connected components.
  return result;
}