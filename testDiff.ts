
import { diffStrings } from './src/utils/diffUtils';

function test(oldStr: string, newStr: string) {
    console.log(`Comparing "${oldStr}" vs "${newStr}"`);
    const parts = diffStrings(oldStr, newStr);

    let rendered = '';
    parts.forEach(p => {
        if (p.type === 'removed') rendered += `[ -${p.value} ]`;
        else if (p.type === 'added') rendered += `[ +${p.value} ]`;
        else rendered += p.value;
    });
    console.log(`Diff: ${rendered}`);

    let reconstructedOld = '';
    let reconstructedNew = '';
    parts.forEach(p => {
        if (p.type === 'removed') reconstructedOld += p.value;
        else if (p.type === 'added') reconstructedNew += p.value;
        else {
            reconstructedOld += p.value;
            reconstructedNew += p.value;
        }
    });

    console.log(`Old matches: ${oldStr === reconstructedOld} (${reconstructedOld})`);
    console.log(`New matches: ${newStr === reconstructedNew} (${reconstructedNew})`);
    console.log('---');
}

test("zyx", "yzx");
test("abc", "bac");
test("hello world", "hello friend");
test("abc", "[ \"abc\", \"bac\" ]");
