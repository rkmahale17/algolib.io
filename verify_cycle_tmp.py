
class ListNode:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

def list_node_to_json(head):
    if not head: return None
    result = []
    visited = {}
    curr = head
    index = 0
    while curr and curr not in visited:
        visited[curr] = index
        result.append(curr.val)
        curr = curr.next
        index += 1
    
    if curr:
        return {"head": result, "pos": visited[curr]}
    return result

# Test cases
def test():
    # Case 1: Normal
    n3 = ListNode(3)
    n2 = ListNode(2, n3)
    h = ListNode(1, n2)
    print(f"Normal: {list_node_to_json(h)}")

    # Case 2: Cycle at 0 (1-2-1)
    n2.next = h
    print(f"Cycle at 0: {list_node_to_json(h)}")

    # Case 3: Cycle at 1 (1-2-3-2)
    n3 = ListNode(3)
    n2 = ListNode(2, n3)
    h = ListNode(1, n2)
    n3.next = n2
    print(f"Cycle at 1: {list_node_to_json(h)}")

test()
