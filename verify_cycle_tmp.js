
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

function listNodeToJson(head) {
    if (!head) return null;
    const result = [];
    const visited = new Map();
    let curr = head;
    let index = 0;
    while (curr && !visited.has(curr)) {
        visited.set(curr, index++);
        result.push(curr.val);
        curr = curr.next;
    }
    if (curr) {
        return { head: result, pos: visited.get(curr) };
    }
    return result;
}

// Test cases
const node3 = new ListNode(3);
const node2 = new ListNode(2, node3);
const head = new ListNode(1, node2);

console.log("Normal list:", JSON.stringify(listNodeToJson(head))); // [1, 2, 3]

node3.next = node2; // Cycle at index 1
console.log("Cyclic list (pos 1):", JSON.stringify(listNodeToJson(head))); // {"head":[1,2,3],"pos":1}

node3.next = head; // Cycle at index 0
console.log("Cyclic list (pos 0):", JSON.stringify(listNodeToJson(head))); // {"head":[1,2,3],"pos":0}

console.log("Empty list:", JSON.stringify(listNodeToJson(null))); // null
console.log("Single node:", JSON.stringify(listNodeToJson(new ListNode(5)))); // [5]
