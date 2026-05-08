const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'components/Navbar.tsx',
  'app/(auth)/login/page.tsx',
  'app/(auth)/signup/page.tsx',
  'app/(app)/planner/page.tsx',
  'app/(app)/planner/architecture/page.tsx',
  'app/(app)/planner/prompts/page.tsx',
  'app/(app)/planner/features/page.tsx',
  'app/(app)/planner/blueprint/page.tsx'
];

for (const file of filesToUpdate) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(
      "import { supabase } from '@/lib/supabase'",
      "import { createClient } from '@/utils/supabase/client'\nconst supabase = createClient()"
    );
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
}

// Fix api/ai/plan/route.ts
const apiRoute = path.join(__dirname, 'app/api/ai/plan/route.ts');
if (fs.existsSync(apiRoute)) {
  let content = fs.readFileSync(apiRoute, 'utf8');
  content = content.replace("import { createServerSupabase } from '@/lib/supabase'\n", "");
  fs.writeFileSync(apiRoute, content);
  console.log('Updated app/api/ai/plan/route.ts');
}
