export interface DiffPart {
    value: string;
    added?: boolean;
    removed?: boolean;
}

/**
 * A basic character-level diffing implementation using Dynamic Programming (LCS).
 * For long strings, this might be slow, but for test case outputs it should be fine.
 */
export function diffStrings(oldStr: string, newStr: string): DiffPart[] {
    const n = oldStr.length;
    const m = newStr.length;
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (oldStr[i - 1] === newStr[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    const result: DiffPart[] = [];
    let i = n, j = m;

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && oldStr[i - 1] === newStr[j - 1]) {
            result.push({ value: oldStr[i - 1] });
            i--; j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            result.push({ value: newStr[j - 1], added: true });
            j--;
        } else {
            result.push({ value: oldStr[i - 1], removed: true });
            i--;
        }
    }

    return result.reverse().reduce((acc: DiffPart[], part) => {
        const last = acc[acc.length - 1];
        if (last && !!last.added === !!part.added && !!last.removed === !!part.removed) {
            last.value += part.value;
        } else {
            acc.push({ ...part, added: !!part.added, removed: !!part.removed });
        }
        return acc;
    }, []);
}
