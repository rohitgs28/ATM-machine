import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
        isolatedModules: true,
      },
    ],
  },

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@features/(.*)$': '<rootDir>/features/$1',
    '^@hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@models/(.*)$': '<rootDir>/models/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@api/(.*)$': '<rootDir>/api/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },

  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],

  collectCoverage: true,
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'features/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    'models/**/*.{ts,tsx}',
    '!app/api/**',
    '!**/*.d.ts',
    '!**/__tests__/**',
    '!**/*.stories.tsx',
    '!**/test-utils.tsx',
    '!**/theme.ts',
  ],
  coverageThreshold: {
    global: { branches: 90, functions: 90, lines: 90, statements: 90 },
  },
  coverageReporters: ['text', 'text-summary', 'lcov'],
};

export default config;
