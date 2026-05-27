/**
 * apply-schema-to-testing.js
 * 
 * Applies all migrations to the testing Supabase project via Management API.
 * Handles "already exists" conflicts gracefully.
 * 
 * Usage: node scripts/apply-schema-to-testing.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const TESTING_PROJECT_REF = 'cxyggxsyiymgxvwzeatv';
const TESTING_SERVICE_ROLE_KEY = process.env.SUPABASE_TESTING_SERVICE_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4eWdneHN5aXltZ3h2d3plYXR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI4OTIxMSwiZXhwIjoyMDkyODY1MjExfQ.1Vn04APqEJkKs7HU0c2yrMgSSBl29xOQtpr8yqEqaeM';

const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

// Errors to ignore (idempotent re-run)
const IGNORABLE_ERRORS = [
  'already exists',
  'already been done',
  'does not exist, skipping',
];

function isIgnorable(error) {
  if (!error) return false;
  return IGNORABLE_ERRORS.some(msg => error.includes(msg));
}

function execSQL(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    
    const options = {
      hostname: `${TESTING_PROJECT_REF}.supabase.co`,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': TESTING_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${TESTING_SERVICE_ROLE_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ ok: true });
        } else {
          resolve({ ok: false, error: data, status: res.statusCode });
        }
      });
    });
    
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Use Management API to run SQL
function execViaManagementAPI(sql) {
  return new Promise((resolve, reject) => {
    if (!SUPABASE_ACCESS_TOKEN) {
      return reject(new Error('SUPABASE_ACCESS_TOKEN not set'));
    }
    
    const body = JSON.stringify({ query: sql });
    const options = {
      hostname: 'api.supabase.com',
      path: `/v1/projects/${TESTING_PROJECT_REF}/database/query`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Length': Buffer.byteLength(body),
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ ok: true });
          } else {
            resolve({ ok: false, error: JSON.stringify(json), status: res.statusCode });
          }
        } catch {
          resolve({ ok: false, error: data, status: res.statusCode });
        }
      });
    });
    
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const migrationsDir = path.resolve(__dirname, '../supabase/migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`\n📦 Found ${files.length} migration files\n`);
  
  let applied = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    process.stdout.write(`  → ${file} ... `);
    
    try {
      const result = await execViaManagementAPI(sql);
      if (result.ok) {
        console.log('✅');
        applied++;
      } else if (isIgnorable(result.error)) {
        console.log('⏭️  (skipped - already exists)');
        skipped++;
      } else {
        console.log(`❌ HTTP ${result.status}`);
        console.log(`     Error: ${result.error?.substring(0, 200)}`);
        failed++;
      }
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${applied} applied, ${skipped} skipped, ${failed} failed\n`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
