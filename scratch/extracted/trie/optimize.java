import java.util.HashMap;
import java.util.Map;

// Trie Node definition
class TrieNode {
    // Each node stores a map of characters to child TrieNodes.
    Map<Character, TrieNode> children;
    
    // isEnd indicates if this node represents the end of a valid word.
    boolean isEnd;

    // Constructor
    TrieNode() {
        children = new HashMap<>();
        isEnd = false;
    }
}

// Trie implementation
class Trie {
    // Root node of the Trie.
    private TrieNode root;

    // Constructor: Initializes the Trie with a root node.
    public Trie() {
        root = new TrieNode(); // Initialize the root node
    }

    // Inserts a word into the Trie.
    public void insert(String word) {
        // Start from the root node.
        TrieNode node = root;

        // Iterate through each character of the word.
        for (char c : word.toCharArray()) {
            // If the character is not already a child, create a new node.
            if (!node.children.containsKey(c)) {
                node.children.put(c, new TrieNode());
            }
            // Move to the child node.
            node = node.children.get(c);
        }

        // Mark the end of the word.
        node.isEnd = true;
    }

    // Searches for a word in the Trie.
    public boolean search(String word) {
        // Start from the root node.
        TrieNode node = root;

        // Iterate through each character of the word.
        for (char c : word.toCharArray()) {
            // If character not found, return false.
            if (!node.children.containsKey(c)) return false;

            // Move to next node.
            node = node.children.get(c);
        }

        // Check if it's the end of a word.
        return node.isEnd;
    }

    // Checks if there is any word starting with the given prefix.
    public boolean startsWith(String prefix) {
        // Start from the root node.
        TrieNode node = root;

        // Iterate through each character of the prefix.
        for (char c : prefix.toCharArray()) {
            // If character not found, return false.
            if (!node.children.containsKey(c)) return false;

            // Move to next node.
            node = node.children.get(c);
        }

        // If traversal succeeds, prefix exists.
        return true;
    }
}