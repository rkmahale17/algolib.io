class TrieNode {
  // Children nodes, mapping character to TrieNode
  children: Map<string, TrieNode>;
  // Flag to indicate the end of a word
  endOfWord: boolean;

  constructor() {
    // Initialize children map
    this.children = new Map();
    // Initially, the node doesn't represent the end of a word
    this.endOfWord = false;
  }
}

class Trie {
  // Root node of the Trie
  root: TrieNode;

  constructor() {
    // Initialize the Trie with an empty root node
    this.root = new TrieNode();
  }

  insert(word: string): void {
    // Start from the root node
    let cur = this.root;

    // Iterate through each character of the word
    for (const c of word) {
      // If the current node doesn't have a child for this character
      if (!cur.children.has(c)) {
        // Create a new TrieNode for this character and add it to the children map
        cur.children.set(c, new TrieNode());
      }
      // Move to the child node corresponding to the current character
      cur = cur.children.get(c)!;
    }

    // After processing all characters, mark the last node as the end of a word
    cur.endOfWord = true;
  }

  search(word: string): boolean {
    // Start from the root node
    let cur = this.root;

    // Iterate through each character of the word
    for (const c of word) {
      // If the current node doesn't have a child for this character, the word is not in the Trie
      if (!cur.children.has(c)) {
        return false;
      }
      // Move to the child node corresponding to the current character
      cur = cur.children.get(c)!;
    }

    // After processing all characters, return true if the last node is marked as the end of a word
    return cur.endOfWord;
  }

  startsWith(prefix: string): boolean {
    // Start from the root node
    let cur = this.root;

    // Iterate through each character of the prefix
    for (const c of prefix) {
      // If the current node doesn't have a child for this character, the prefix is not in the Trie
      if (!cur.children.has(c)) {
        return false;
      }
      // Move to the child node corresponding to the current character
      cur = cur.children.get(c)!;
    }

    // After processing all characters, return true (since the prefix exists)
    return true;
  }
}