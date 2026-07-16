import { spawn } from 'node:child_process';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const roots = ['src', 'tests', 'public', 'index.html', 'playwright.config.ts', 'vite.config.ts'];
const cwd = process.cwd();
let running = false;
let rerunRequested = false;
let lastSignature = '';

async function listPaths(root) {
  const fullPath = join(cwd, root);
  const results = [];

  async function walk(path) {
    const info = await stat(path);
    results.push(`${path}:${info.mtimeMs}`);
    if (info.isDirectory()) {
      const entries = await readdir(path);
      for (const entry of entries) {
        await walk(join(path, entry));
      }
    }
  }

  try {
    await walk(fullPath);
  } catch {
    // Ignore missing paths in the demo loop.
  }

  return results;
}

async function computeSignature() {
  const parts = [];
  for (const root of roots) {
    parts.push(...(await listPaths(root)));
  }
  return parts.sort().join('|');
}

function runTests() {
  if (running) {
    rerunRequested = true;
    return;
  }

  running = true;
  console.log('\n[qa:watch] running npm run test:e2e\n');

  const child = spawn('npm', ['run', 'test:e2e'], {
    cwd,
    stdio: 'inherit',
    shell: true
  });

  child.on('exit', (code) => {
    running = false;
    console.log(`\n[qa:watch] test run finished with exit code ${code}\n`);
    if (rerunRequested) {
      rerunRequested = false;
      runTests();
    }
  });
}

async function loop() {
  lastSignature = await computeSignature();
  console.log('[qa:watch] polling for changes in src, tests, public, and config files');
  runTests();

  setInterval(async () => {
    const signature = await computeSignature();
    if (signature !== lastSignature) {
      lastSignature = signature;
      runTests();
    }
  }, 1000);
}

loop().catch((error) => {
  console.error('[qa:watch] failed to start', error);
  process.exit(1);
});

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
