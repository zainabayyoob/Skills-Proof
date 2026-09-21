import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedTests++;
  }
}

console.log('========================================================');
console.log('CLOUDFLARE TUNNEL PERSISTENCE & INFRASTRUCTURE TESTS');
console.log('========================================================\n');

// Test 1: Executable & File Existence
console.log('1. Checking Cloudflared Executable & Script Existence...');
assert(fs.existsSync(path.join(rootDir, 'cloudflared.exe')), 'cloudflared.exe exists in workspace root');
assert(fs.existsSync(path.join(rootDir, 'scripts', 'start-tunnel.mjs')), 'scripts/start-tunnel.mjs exists');
assert(fs.existsSync(path.join(rootDir, 'package.json')), 'package.json exists');
assert(fs.existsSync(path.join(rootDir, 'START_APP.bat')), 'START_APP.bat exists');

// Test 2: Port Alignment & Single-Port Proxy
console.log('\n2. Checking Target Port & Proxy Configuration...');
const viteConfigContent = fs.readFileSync(path.join(rootDir, 'vite.config.js'), 'utf-8');
assert(viteConfigContent.includes("port: 5173"), 'Vite server configured for port 5173');
assert(viteConfigContent.includes("'/api': {"), 'Vite server proxies /api requests');
assert(viteConfigContent.includes("target: 'http://localhost:3001'"), 'Vite proxies to backend on port 3001');

// Test 3: package.json script integration
console.log('\n3. Checking package.json Tunnel Scripts...');
const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
assert(pkg.scripts.tunnel !== undefined, 'package.json defines "tunnel" script');
assert(pkg.scripts['dev:tunnel'] !== undefined, 'package.json defines "dev:tunnel" script');
assert(pkg.scripts.dev !== undefined, 'package.json preserves existing "dev" script');
assert(pkg.scripts.client !== undefined, 'package.json preserves existing "client" script');
assert(pkg.scripts.server !== undefined, 'package.json preserves existing "server" script');

// Test 4: Environment & Secrets Hygiene
console.log('\n4. Checking Security & Secrets Isolation in Source Control...');
const gitignoreContent = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf-8');
assert(gitignoreContent.includes('.env'), '.gitignore ignores .env files');
assert(gitignoreContent.includes('.tunnel-status.json') || gitignoreContent.includes('*.json'), 'Tunnel status file is gitignored');
assert(gitignoreContent.includes('*.pem'), 'Certificate files (*.pem) are gitignored');

const envExampleContent = fs.readFileSync(path.join(rootDir, '.env.example'), 'utf-8');
assert(envExampleContent.includes('CLOUDFLARE_TUNNEL_TOKEN'), '.env.example documents CLOUDFLARE_TUNNEL_TOKEN');
assert(!envExampleContent.includes('eyJh'), '.env.example does not expose real tokens');

// Test 5: start-tunnel.mjs configuration handling
console.log('\n5. Checking start-tunnel.mjs Logic & Robustness...');
const tunnelScriptContent = fs.readFileSync(path.join(rootDir, 'scripts', 'start-tunnel.mjs'), 'utf-8');
assert(tunnelScriptContent.includes('runNamedTunnel'), 'start-tunnel.mjs implements runNamedTunnel');
assert(tunnelScriptContent.includes('runQuickTunnel'), 'start-tunnel.mjs implements fallback runQuickTunnel');
assert(tunnelScriptContent.includes('spawnCloudflared'), 'start-tunnel.mjs manages cloudflared process lifecycle');
assert(tunnelScriptContent.includes('isShuttingDown'), 'start-tunnel.mjs implements graceful shutdown handling');
assert(tunnelScriptContent.includes('--protocol') && tunnelScriptContent.includes('http2'), 'start-tunnel.mjs forces reliable http2 protocol');

console.log('\n========================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('========================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
