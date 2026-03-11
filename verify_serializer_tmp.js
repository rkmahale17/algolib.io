
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

function listNodeToJson(head) {
    if (!head) return null;
    const result = [];
    const visited = new Set();
    let curr = head;
    while (curr && !visited.has(curr)) {
        visited.add(curr);
        result.push(curr.val);
        curr = curr.next;
    }
    return result;
}

// Test cases
const node3 = new ListNode(3);
const node2 = new ListNode(2, node3);
const head = new ListNode(1, node2);

console.log("Normal list:", JSON.stringify(listNodeToJson(head))); // [1, 2, 3]

node3.next = node2; // Cycle
console.log("Cyclic list:", JSON.stringify(listNodeToJson(head))); // [1, 2, 3]

console.log("Empty list:", JSON.stringify(listNodeToJson(null))); // null
console.log("Single node:", JSON.stringify(listNodeToJson(new ListNode(5)))); // [5]
