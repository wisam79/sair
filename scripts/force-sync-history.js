/**
 * force-sync-history.js
 * يُسجّل جميع الـ migrations في جدول schema_migrations مباشرةً
 * عبر Supabase REST API (بدون supabase CLI)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4eWdneHN5aXltZ3h2d3plYXR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI4OTIxMSwiZXhwIjoyMDkyODY1MjExfQ.1Vn04APqEJkKs7HU0c2yrMgSSBl29xOQtpr8yqEqaeM';
const PROJECT = 'cxyggxsyiymgxvwzeatv';

// اقرأ كل ملفات .sql من migrations
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
const allVersions = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .map((f) => f.replace(/\.sql$/, ''))
  .sort();

console.log(`Found ${allVersions.length} migration versions to sync`);

// أنشئ INSERT statement
const values = allVersions.map((v) => `('${v}')`).join(',\n  ');
const SQL = `INSERT INTO supabase_migrations.schema_migrations (version)\nVALUES\n  ${values}\nON CONFLICT (version) DO NOTHING;`;

// شغّل SQL عبر Supabase pg proxy
function runSQL(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const options = {
      hostname: `${PROJECT}.supabase.co`,
      path: `/rest/v1/rpc/exec_sql`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// استخدم supabase-js approach عبر direct postgres connection
// بما أن exec_sql غير متوفر، نستخدم psql عبر connection string
const { execSync } = require('child_process');

// جرّب psql إذا كان متوفراً
const connectionString = `postgresql://postgres.${PROJECT}:${SERVICE_KEY}@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres`;

// اكتب SQL في ملف مؤقت
const tmpFile = path.join(__dirname, 'tmp_sync.sql');
fs.writeFileSync(tmpFile, SQL);
console.log('\nSQL to execute:\n' + SQL.substring(0, 200) + '...\n');

try {
  const result = execSync(`psql "${connectionString}" -f "${tmpFile}" 2>&1`, {
    timeout: 30000,
    encoding: 'utf8',
  });
  console.log('✅ Result:', result);
} catch (err) {
  console.log('psql not available, trying via supabase CLI...');
  try {
    // استخدم supabase db execute
    const result2 = execSync(
      `supabase db execute --linked --sql "${SQL.replace(/"/g, "'").replace(/\n/g, ' ')}" 2>&1`,
      { cwd: path.join(__dirname, '..'), timeout: 30000, encoding: 'utf8' },
    );
    console.log('✅ Result:', result2);
  } catch (err2) {
    console.error('❌ Both methods failed');
    console.error(err2.message);
  }
} finally {
  if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
}
