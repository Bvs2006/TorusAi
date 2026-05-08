const { Client } = require('pg');

async function run() {
  const connectionString = "postgresql://postgres:srujith%232006@db.bvsggldrohdntpmhwtkr.supabase.co:5432/postgres";
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to DB.');
    await client.query(`
      ALTER TABLE profiles 
      ADD COLUMN IF NOT EXISTS account_type TEXT CHECK (account_type IN ('developer', 'organisation')),
      ADD COLUMN IF NOT EXISTS company_details TEXT;
    `);
    console.log('Added account_type and company_details to profiles');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
