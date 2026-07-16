import { spawn } from 'node:child_process';

const processes = [];

function start(label, command, args) {
  const child = spawn(command, args, {
    shell: true,
    stdio: 'inherit'
  });

  child.on('exit', (code) => {
    console.log(`\n[qa:demo] ${label} exited with code ${code}`);
    for (const proc of processes) {
      if (proc !== child) {
        proc.kill('SIGTERM');
      }
    }
    process.exit(code ?? 0);
  });

  processes.push(child);
}

console.log('[qa:demo] starting dev server, MCP server, and auto test watcher');
start('dev', 'npm', ['run', 'dev']);
start('mcp', 'npm', ['run', 'mcp']);
start('qa:watch', 'npm', ['run', 'qa:watch']);

process.on('SIGINT', () => {
  for (const proc of processes) {
    proc.kill('SIGTERM');
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  for (const proc of processes) {
    proc.kill('SIGTERM');
  }
  process.exit(0);
});
