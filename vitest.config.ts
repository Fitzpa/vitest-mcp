import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use test.projects instead of deprecated environmentMatchGlobs
    // This allows defining different configurations for different test environments
    projects: [
      {
        test: {
          name: 'node',
          // Run all tests except browser tests in node environment
          include: ['**/*.test.ts', '**/*.spec.ts'],
          exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/coverage/**',
            '**/test-validation/**',
            '**/browser/**'
          ],
          environment: 'node',
        }
      },
      {
        test: {
          name: 'browser',
          // Run browser tests in jsdom environment
          include: ['**/browser/**/*.test.ts', '**/browser/**/*.spec.ts'],
          exclude: ['**/test-validation/**'],
          environment: 'jsdom',
        }
      }
    ],
    // Shared coverage configuration across all projects
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.test.ts',
        '**/*.spec.ts'
      ]
    }
  },
});