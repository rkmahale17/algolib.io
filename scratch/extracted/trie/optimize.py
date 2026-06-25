class TrieNode:
    def __init__(self):
        # Initialize a Trie node.
        # 'children' is a dictionary where keys are characters and values are TrieNodes.
        self.children = {}
        # 'endOfWord' is a boolean flag indicating if this node represents the end of a word.
        self.endOfWord = False

class Trie:
    def __init__(self):
        # Initialize the Trie with a root node.
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        # Inserts a word into the trie.
        cur = self.root  # Start from the root node.
        for c in word:
            # Iterate through each character in the word.
            if c not in cur.children:
                # If the character is not a child of the current node,
                # create a new TrieNode for it.
                cur.children[c] = TrieNode()
            # Move to the child node corresponding to the current character.
            cur = cur.children[c]
        # After processing all characters, mark the last node as the end of a word.
        cur.endOfWord = True

    def search(self, word: str) -> bool:
        # Searches for a word in the trie.
        cur = self.root  # Start from the root node.
        for c in word:
            # Iterate through each character in the word.
            if c not in cur.children:
                # If the character is not a child of the current node,
                # the word is not in the trie.
                return False
            # Move to the child node corresponding to the current character.
            cur = cur.children[c]
        # After processing all characters, check if the last node is marked as the end of a word.
        return cur.endOfWord  # Return True if it's the end of a word, False otherwise.

    def startsWith(self, prefix: str) -> bool:
        # Checks if there is any word in the trie that starts with the given prefix.
        cur = self.root  # Start from the root node.
        for c in prefix:
            # Iterate through each character in the prefix.
            if c not in cur.children:
                # If the character is not a child of the current node,
                # no word with the prefix exists in the trie.
                return False
            # Move to the child node corresponding to the current character.
            cur = cur.children[c]
        # If all characters in the prefix are found, return True.
        return True