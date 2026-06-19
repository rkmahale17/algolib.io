const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

async function run() {
  const { data: nData } = await supabase.from('algorithms').select('id, implementations').eq('id', 'nth-highest-salary').single();
  let code = nData.implementations[0].code[0].code;
  console.log('BEFORE:', code);
  code = code.replace(/OFFSET \(N \- 1\)/g, 'OFFSET 1'); 
  code = code.replace(/\"getNthHighestSalary\(N\)\"/g, '\"nth_highest_salary\"');
  console.log('AFTER:', code);
  
  const newImpl = [...nData.implementations];
  newImpl[0].code[0].code = code;
  await supabase.from('algorithms').update({ implementations: newImpl }).eq('id', 'nth-highest-salary');
}
run();
