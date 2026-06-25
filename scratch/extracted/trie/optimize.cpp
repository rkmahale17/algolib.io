class TrieNode {
  public:
    // Each node stores a map of characters to child TrieNodes.
    unordered_map<char, TrieNode*> children;
    // isEnd indicates if this node represents the end of a valid word.
    bool isEnd = false;
};

class Trie {
    // Root node of the Trie.
    TrieNode* root;
  public:
    // Constructor: Initializes the Trie with a root node.
    Trie() { 
      root = new TrieNode(); // Initialize the root node when a Trie object is created.
    }

    // Inserts a word into the Trie.
    void insert(string word) {
      // Start from the root node.
      TrieNode * node = root;
      // Iterate through each character of the word.
      for (char c : word) {
        // If the character is not already a child of the current node,
        // create a new TrieNode for it.
        if (!node -> children[c]) {
          node -> children[c] = new TrieNode(); // Create a new node if the path doesn't exist.
        }
        // Move to the child node corresponding to the current character.
        node = node -> children[c]; // Traverse to the next node in the Trie.
      }
      // After inserting all characters, mark the last node as the end of a word.
      node -> isEnd = true; // Mark the end of the word.
    }
    
    // Searches for a word in the Trie.
    bool search(string word) {
      // Start from the root node.
      TrieNode * node = root;
      // Iterate through each character of the word.
      for (char c : word) {
        // If the character is not a child of the current node, the word is not in the Trie.
        if (!node -> children[c]) return false; // If a character is missing, the word isn't present.
        // Move to the child node corresponding to the current character.
        node = node -> children[c]; // Traverse to the next node.
      }
      // The word is in the Trie if and only if the last node is the end of a word.
      return node -> isEnd; // Check if the last node marks the end of a valid word.
    }
    
    // Checks if there is any word in the trie that starts with the given prefix.
    bool startsWith(string prefix) {
      // Start from the root node.
      TrieNode * node = root;
      // Iterate through each character of the prefix.
      for (char c : prefix) {
        // If the character is not a child of the current node, there is no word with this prefix.
        if (!node -> children[c]) return false; // If a character is missing, no words start with this prefix.
        // Move to the child node corresponding to the current character.
        node = node -> children[c]; // Traverse to the next node.
      }
      // If we reach here, it means that there is a path in the Trie corresponding to the prefix.
      // Therefore, there is at least one word starting with this prefix.
      return true; // If we reach the end of the prefix, it exists.
    }
}; 