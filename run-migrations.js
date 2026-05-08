const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
  const connectionString = "postgresql://postgres:srujith%232006@db.bvsggldrohdntpmhwtkr.supabase.co:5432/postgres";
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to Supabase DB.');

    const sqlPath = path.join(__dirname, 'db/migrations.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running migrations...');
    await client.query(sql);
    console.log('Migrations executed successfully!');
  } catch (err) {
    console.error('Error executing migrations:', err);
  } finally {
    await client.end();
  }
}

run();
