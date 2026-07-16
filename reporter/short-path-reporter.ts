// short-path-reporter.ts
import type { Reporter, TestCase, TestResult } from '@playwright/test';
import * as path from 'node:path';

const ROOT = process.cwd();

function shorten(p: string) {
  return p.startsWith(ROOT) ? path.relative(ROOT, p) : p;
}

class ShortPathReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'failed') {
      const location = test.location;
      const file = shorten(location.file);
      console.log(`FAIL ${file}:${location.line}:${location.column}`);

      for (const e of result.errors) {
        if (e.stack) {
          const shortenedStack = e.stack
            .split('\n')
            .map(line => line.replace(ROOT + path.sep, ''))
            .join('\n');
          console.log(shortenedStack);
        } else if (e.message) {
          console.log(e.message);
        }
      }
    }
  }
}

export default ShortPathReporter;