import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to parse key-value lines from .env files without extra dependencies
function loadEnvFile(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  const content = fs.readFileSync(filePath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.substring(0, eqIdx).trim();
      let val = trimmed.substring(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

// Load environment variables
const envLocal = loadEnvFile(path.join(rootDir, '.env.local'));
const envDefault = loadEnvFile(path.join(rootDir, '.env'));
const mergedEnv = { ...envDefault, ...envLocal, ...process.env };

const tunnelToken = mergedEnv.CLOUDFLARE_TUNNEL_TOKEN || '';
const tunnelHostname = mergedEnv.CLOUDFLARE_TUNNEL_HOSTNAME || '';
const targetPort = mergedEnv.TARGET_PORT || '5173';
const localTargetUrl = `http://localhost:${targetPort}`;

// Locate cloudflared executable
const localExePath = path.join(rootDir, 'cloudflared.exe');
const cloudflaredCmd = fs.existsSync(localExePath) ? localExePath : 'cloudflared';

console.log('========================================================================');
console.log('       SkillProof — Cloudflare Tunnel Management Supervisor            ');
console.log('========================================================================');
console.log(`• Local Target Service : ${localTargetUrl} (Vite Frontend + API Proxy)`);
console.log(`• Cloudflared Path     : ${cloudflaredCmd}`);

let activeProcess = null;
let isShuttingDown = false;

function cleanup() {
  isShuttingDown = true;
  if (activeProcess) {
    console.log('\n[SkillProof Tunnel] Stopping cloudflared process...');
    try {
      activeProcess.kill('SIGTERM');
    } catch (_) {}
  }
}

process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});

// Run persistent named tunnel using token
function runNamedTunnel(token) {
  console.log('• Tunnel Mode          : PERSISTENT NAMED TUNNEL (Token Authenticated)');
  if (tunnelHostname) {
    console.log(`• Stable Public URL    : https://${tunnelHostname}`);
  } else {
    console.log('• Stable Public URL    : Configured in Cloudflare Zero Trust Dashboard');
  }
  console.log('• Persistence Status   : 100% PERSISTENT across restarts (No Error 1033)');
  console.log('========================================================================\n');

  const args = ['tunnel', 'run', '--protocol', 'http2', '--token', token];
  spawnCloudflared(args, true);
}

// Run development fallback tunnel when token is not yet configured
function runQuickTunnel() {
  console.log('• Tunnel Mode          : QUICK TUNNEL (Fallback)');
  console.log('• Persistence Status   : TEMPORARY (Cloudflare Error 1033 may recur if disconnected)');
  console.log('========================================================================');
  console.log('\n⚠️  ACTION REQUIRED FOR PERMANENT PERSISTENCE:');
  console.log('   To permanently stop Error 1033 and keep the exact same URL forever:');
  console.log('   1. Visit Cloudflare Zero Trust: https://one.dash.cloudflare.com');
  console.log('   2. Navigate to Networks -> Tunnels -> "Add a tunnel" (Free).');
  console.log('   3. Select Cloudflare Tunnel, name it (e.g. "skillproof-dev"), and copy the Token.');
  console.log('   4. Under Public Hostnames: route your subdomain (e.g. dev.yourdomain.com) to http://localhost:5173');
  console.log('   5. Paste your token into .env:');
  console.log('      CLOUDFLARE_TUNNEL_TOKEN=eyJh...\n');
  console.log('   Starting development quick tunnel in the meantime...\n');

  const args = ['tunnel', '--protocol', 'http2', '--url', localTargetUrl];
  spawnCloudflared(args, false);
}

function spawnCloudflared(args, isNamed) {
  activeProcess = spawn(cloudflaredCmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });

  activeProcess.stdout.on('data', (data) => {
    const text = data.toString();
    process.stdout.write(text);
    extractAndRecordUrl(text);
  });

  activeProcess.stderr.on('data', (data) => {
    const text = data.toString();
    process.stderr.write(text);
    extractAndRecordUrl(text);
  });

  activeProcess.on('close', (code) => {
    if (isShuttingDown) return;
    console.log(`\n[SkillProof Tunnel] Process closed with code ${code}. Reconnecting in 3s...`);
    setTimeout(() => {
      if (!isShuttingDown) {
        if (isNamed) {
          runNamedTunnel(tunnelToken);
        } else {
          runQuickTunnel();
        }
      }
    }, 3000);
  });
}

function extractAndRecordUrl(text) {
  // Check for trycloudflare URL if in quick tunnel mode
  const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
  if (match) {
    const url = match[0];
    const statusFile = path.join(rootDir, '.tunnel-status.json');
    try {
      fs.writeFileSync(
        statusFile,
        JSON.stringify(
          {
            url,
            isNamed: false,
            updatedAt: new Date().toISOString(),
            target: localTargetUrl,
          },
          null,
          2
        )
      );
    } catch (_) {}
  }
}

// Start
if (tunnelToken) {
  runNamedTunnel(tunnelToken);
} else {
  runQuickTunnel();
}
