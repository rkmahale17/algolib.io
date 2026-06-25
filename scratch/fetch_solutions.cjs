const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key in env.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: algorithms, error } = await supabase
    .from('algorithms')
    .select('id, name, implementations');

  if (error) {
    console.error("Error fetching algorithms:", error);
    process.exit(1);
  }

  const fs = require('fs');
  const path = require('path');
  const outputPath = path.join(__dirname, 'solutions.json');
  fs.writeFileSync(outputPath, JSON.stringify(algorithms, null, 2));
  console.log(`Saved ${algorithms.length} algorithms to ${outputPath}`);
}

main();
