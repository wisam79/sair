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

// Load .env file manually
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    for (const line of envConfig.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value.trim();
        }
      }
    }
  }
} catch (e) {
  console.warn('Failed to load .env file:', e);
}

const TESTING_PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'cxyggxsyiymgxvwzeatv';
const TESTING_SERVICE_ROLE_KEY =
  process.env.SUPABASE_TESTING_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.DEV_SUPABASE_SERVICE_ROLE_KEY;
if (!TESTING_SERVICE_ROLE_KEY) {
  console.error(
    '❌ Error: SUPABASE_TESTING_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY environment variable is not set.',
  );
  process.exit(1);
}

const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

// Errors to ignore (idempotent re-run)
const IGNORABLE_ERRORS = ['already exists', 'already been done', 'does not exist, skipping'];

function isIgnorable(error) {
  if (!error) return false;
  return IGNORABLE_ERRORS.some((msg) => error.includes(msg));
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
        apikey: TESTING_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${TESTING_SERVICE_ROLE_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
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
        Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
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
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  console.log(`\n📦 Found ${files.length} migration files\n`);

  let applied = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    process.stdout.write(`  → ${file} ... `);

    try {
      const result = await execSQL(sql);
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

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
