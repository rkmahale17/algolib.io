const fs = require('fs');
const dotenv = require('dotenv');
const env = dotenv.parse(fs.readFileSync('.env'));
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

(async () => {
  const { data } = await supabase.from('algorithms').select('test_cases').eq('id', 'throttle').single();
  const test = data.test_cases.find(tc => tc.name === "Throttle basic functionality");
  console.log(test.testCode);
})();
