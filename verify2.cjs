const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
async function run() {
  const { data, error } = await supabase.from('algorithms').select('test_cases, implementations').eq('id', 'array-reduce').single();
  if (error) { console.error('Fetch error:', error); process.exit(1); }
  const tsCode = data.implementations.find(i => i.lang === 'TypeScript').code[0].code.substring(0, 100);
  console.log('Starter code:', tsCode);
  console.log('Test case 1:', data.test_cases[0].testCode.substring(0, 100));
}
run();