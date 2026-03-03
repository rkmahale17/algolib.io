
class ListNode:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

def list_node_to_json(head):
    if not head: return None
    result = []
    visited = set()
    curr = head
    while curr and curr not in visited:
        visited.add(curr)
        result.append(curr.val)
        curr = curr.next
    return result

# Test cases
node3 = ListNode(3)
node2 = ListNode(2, node3)
head = ListNode(1, node2)

print(f"Normal list: {list_node_to_json(head)}")

node3.next = node2 # Cycle
print(f"Cyclic list: {list_node_to_json(head)}")

print(f"Empty list: {list_node_to_json(None)}")
print(f"Single node: {list_node_to_json(ListNode(5))}")
