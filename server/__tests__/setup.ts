import { afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Global test setup
beforeAll(() => {
  // Add any global test setup here
});

// Runs a cleanup after each test case
afterEach(() => {
  cleanup();
});

// Global test teardown
afterAll(() => {
  // Add any global test teardown here
});
