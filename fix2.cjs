const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
async function run() {
  const { data: row, error } = await supabase.from('algorithms').select('test_cases, implementations').eq('id', 'array-reduce').single();
  if (error) { console.error('Fetch error:', error); process.exit(1); }
  
  let changed = false;
  
  if (row.test_cases) {
    const newTestCases = row.test_cases.map(tc => {
      if (tc.testCode && tc.testCode.includes('arrayReduce')) {
        let newCode = tc.testCode.replace(/arrayReduce\s*\(\s*callbackFn\s*,\s*initialValue\s*,\s*array\s*\)/g, 'array.myReduce(callbackFn, initialValue)')
                                 .replace(/arrayReduce\s*\(\s*callbackFn\s*,\s*array\s*\)/g, 'array.myReduce(callbackFn)')
                                 .replace(/arrayReduce/g, 'array.myReduce');
        return { ...tc, testCode: newCode };
      }
      return tc;
    });
    if (JSON.stringify(newTestCases) !== JSON.stringify(row.test_cases)) {
      row.test_cases = newTestCases; changed = true;
    }
  }
  
  if (row.implementations && Array.isArray(row.implementations)) {
    for (let impl of row.implementations) {
      if (impl.lang === 'TypeScript') {
        for (let codeBlock of impl.code) {
          if (!codeBlock.code.includes('declare global')) {
            const tsFix = 'declare global {\n  interface Array<T> {\n    myReduce<U>(callbackFn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue?: U): U;\n  }\n}\n\n';
            codeBlock.code = tsFix + codeBlock.code;
            changed = true;
          }
        }
      }
    }
  }
  
  if (changed) {
    const { error: updateError } = await supabase.from('algorithms').update({ test_cases: row.test_cases, implementations: row.implementations }).eq('id', 'array-reduce');
    if (updateError) { console.error('Update error:', updateError); process.exit(1); }
    console.log('Updated array-reduce successfully!');
  } else {
    console.log('No changes needed.');
  }
}
run();