import fs from 'fs';
import path from 'path';
import pg from 'pg';

const envPath = path.resolve(process.cwd(), '.env');

if (!fs.existsSync(envPath)) {
  console.log('RESULT_ENV_EXISTS=false');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
let dbUrl = '';
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  const match = trimmed.match(/^(?:export\s+)?DATABASE_URL\s*=\s*(.*)$/i);
  if (match) {
    let val = match[1].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    dbUrl = val;
    break;
  }
}

if (!dbUrl) {
  console.log('RESULT_DATABASE_URL_PRESENT=false');
  process.exit(2);
}

console.log('RESULT_DATABASE_URL_PRESENT=true');

// Parse safe non-secret metadata
try {
  const parsed = new URL(dbUrl);
  console.log('HOST_DOMAIN=' + parsed.hostname);
  console.log('DATABASE_NAME=' + parsed.pathname.replace(/^\//, ''));
  console.log('SSL_MODE=' + (parsed.searchParams.get('sslmode') || 'default'));
} catch (e) {
  console.log('URL_PARSE_ERROR=' + e.message);
}

// Test connection
const client = new pg.Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000
});

try {
  await client.connect();
  const res = await client.query('SELECT current_database() as db, version() as ver, now() as timestamp');
  console.log('CONNECTION_SUCCESS=true');
  console.log('CONNECTED_DB=' + res.rows[0].db);
  const ver = res.rows[0].ver.split(' on ')[0];
  console.log('POSTGRES_VERSION=' + ver);
  console.log('SERVER_TIMESTAMP=' + res.rows[0].timestamp.toISOString());
  await client.end();
  process.exit(0);
} catch (err) {
  console.log('CONNECTION_SUCCESS=false');
  console.log('ERROR_MESSAGE=' + err.message);
  try { await client.end(); } catch (_) {}
  process.exit(3);
}
