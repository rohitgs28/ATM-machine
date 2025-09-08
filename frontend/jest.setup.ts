// jest.setup.ts
/**
 * Test setup for Jest + Testing Library.
 *
 * - Import jest-dom matchers (use the package root import).
 * - Provide a minimal global.fetch mock so components that call `api()` won't throw.
 * - Provide requestAnimationFrame shim for environments that need it.
 * - Keep the console.error filter to silence known act() warnings.
 *
 * Make sure @testing-library/jest-dom is installed as a devDependency:
 *   npm install --save-dev @testing-library/jest-dom
 */

import '@testing-library/jest-dom';

if (!(global as any).fetch) {
  (global as any).fetch = jest.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
    text: async () => '',
  }));
}

// requestAnimationFrame shim
if (!(global as any).requestAnimationFrame) {
  (global as any).requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(cb, 0) as unknown as number;
}

// Preserve original console.error but filter noisy "act" warnings commonly seen in tests.
const _consoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  try {
    const first = String(args[0] ?? '');
    // Filter the specific React "not wrapped in act" warning which pollutes output in some envs.
    if (first.includes('Warning: An update to %s inside a test was not wrapped in act')) {
      return;
    }
  } catch {
    // ignore parsing errors and fall-through to real console error
  }
  _consoleError(...args);
};
