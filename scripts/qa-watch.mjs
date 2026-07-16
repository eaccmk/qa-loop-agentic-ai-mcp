import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import { resolve } from 'node:path';

const roots = ['src', 'tests', 'public', 'index.html', 'playwright.config.ts', 'vite.config.ts'];
const cwd = process.cwd();
let timer = null;
let running = false;
let rerunRequested = false;

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

function scheduleRun() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    runTests();
  }, 400);
}

for (const entry of roots) {
  const fullPath = resolve(cwd, entry);
  try {
    watch(fullPath, { recursive: true }, scheduleRun);
  } catch {
    // Ignore platforms that do not support watching a given path.
  }
}

console.log('[qa:watch] watching for changes in src, tests, public, and config files');
runTests();

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
