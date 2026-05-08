const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function checkSupabase() {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  let url = '';
  let key = '';
  
  envContent.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      url = line.split('=')[1].replace(/"/g, '').trim();
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      key = line.split('=')[1].replace(/"/g, '').trim();
    }
  });

  if (!url || !key) {
    console.log("No valid Supabase URL/Key found in .env.local");
    return;
  }

  const supabase = createClient(url, key);
  console.log("Checking connection to:", url);

  const { data, error } = await supabase.from('projects').select('id').limit(1);

  if (error) {
    if (error.code === '42P01') {
      console.log("❌ ERROR: The 'projects' table does not exist. Migrations have NOT been run.");
    } else {
      console.log("❌ ERROR:", error.message, error.code);
    }
  } else {
    console.log("✅ SUCCESS: Connection works and migrations are applied!");
    console.log("Data returned:", data);
  }
}

checkSupabase();
