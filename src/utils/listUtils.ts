
/**
 * Checks if a type represents a linked list (ListNode or ListNode[]).
 */
export function isListType(type?: string): boolean {
    if (!type) return false;
    return type === 'ListNode' || type === 'ListNode[]';
}

/**
 * Parses a ListNode object or array of objects into a more readable format (array or {head, pos}).
 */
export function parseListValue(value: any): any {
    if (value === null || value === undefined) return value;

    // Handle array of values (potentially array of ListNodes or simple nested arrays)
    if (Array.isArray(value)) {
        // If it's an array of objects that look like ListNodes, parse each one
        if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null && 'val' in value[0]) {
            return value.map(v => parseListValue(v));
        }
        // Otherwise return as is (could be [1,2,3] which is the "readable" format already)
        return value;
    }

    // Handle single ListNode object
    if (typeof value === 'object' && 'val' in value) {
        const result: any[] = [];
        const visited = new Map<any, number>();
        let curr: any = value;
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

    // Handle string inputs (e.g. from user input fields)
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            // Only recurse if we actually parsed something different
            if (typeof parsed === 'object' && parsed !== null) {
                return parseListValue(parsed);
            }
        } catch {
            // Not valid JSON, return as is
        }
    }

    return value;
}
