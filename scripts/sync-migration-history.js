/**
 * sync-migration-history.js
 * يُسجّل جميع الـ migrations كـ "applied" في migration history table
 * يستخدم مع مشروع يحتوي على جداول مسبقة (schema متزامن لكن history غير متزامن)
 */

const https = require('https');

const SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4eWdneHN5aXltZ3h2d3plYXR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI4OTIxMSwiZXhwIjoyMDkyODY1MjExfQ.1Vn04APqEJkKs7HU0c2yrMgSSBl29xOQtpr8yqEqaeM';
const PROJECT = 'cxyggxsyiymgxvwzeatv';

// كل الـ migrations التي لم تُسجَّل بعد في migration history
const PENDING = [
  '2026051004','2026051005','2026051006','2026051106','2026051107','2026051108',
  '2026051109','2026051110','2026051111','2026051112','2026051601','2026051700',
  '2026051701','2026051702','2026051801','2026051802','2026051803','2026051804',
  '2026051805','2026051806','2026051807','2026051808','2026051810','2026051811',
  '2026051901','2026051902','2026051903','2026051904','2026051905','2026051906',
  '2026051907','2026051908','2026052001','2026052002','2026052003','2026052101',
  '2026052102','2026052103','2026052104','2026052105','2026052106','2026052107',
  '2026052108','2026052109','20260522000001','20260522000002','20260522000003',
  '20260522000004','20260522000005','20260522000006','202605222245',
  '20260523000001','20260523000002','20260523000003','20260523000004','20260523000005',
  '20260524000001','20260524000002','20260524000003','20260524000004','20260524000005',
  '20260524000006','20260524000007','20260525000001','20260525000002','20260525000003',
  '20260526000001','20260526000002','20260526000003','20260527000001','20260527000002',
];

const values = PENDING.map((v) => `('${v}')`).join(',\n  ');
const SQL = `
INSERT INTO supabase_migrations.schema_migrations (version)
VALUES
  ${values}
ON CONFLICT (version) DO NOTHING;
`;

function postSQL(sql) {
  return new Promise((resolve, reject) => {
    // نستخدم Supabase REST endpoint لتشغيل SQL عبر service_role
    // نحتاج pg connection مباشرة — نستخدم supabase-js client بدلاً من ذلك
    // لكن بما أننا في node بدون npm، نستخدم fetch alternative

    const payload = JSON.stringify({ query: sql });
    const options = {
      hostname: `db.${PROJECT}.supabase.co`,
      path: '/rest/v1/rpc/query',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// نستخدم supabase CLI بشكل بديل — نكتب SQL file ونُشغّله
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sqlFile = path.join(__dirname, '..', 'supabase', 'migrations', '20260528000000_sync_migration_history.sql');

const sqlContent = `-- Auto-generated: sync migration history for testing project
-- يُسجّل جميع الـ migrations السابقة كـ applied لأن الـ schema موجود مسبقاً
INSERT INTO supabase_migrations.schema_migrations (version)
VALUES
${PENDING.map((v) => `  ('${v}')`).join(',\n')}
ON CONFLICT (version) DO NOTHING;
`;

fs.writeFileSync(sqlFile, sqlContent, 'utf8');
console.log('✅ Created migration file:', path.basename(sqlFile));
console.log('   Records to sync:', PENDING.length);
console.log('\nNow running: supabase db push --linked --yes');

try {
  const output = execSync('supabase db push --linked --yes', {
    cwd: path.join(__dirname, '..'),
    timeout: 60000,
    encoding: 'utf8',
  });
  console.log(output);
  console.log('✅ Migration history synced successfully!');
} catch (err) {
  console.error('❌ Error:', err.stdout || err.message);
  process.exit(1);
}
