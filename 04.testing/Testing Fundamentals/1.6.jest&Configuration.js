// ==========================================
// 2.1 JEST CONFIGURATION - PRACTICAL EXAMPLES
// ==========================================

// ==========================================
// EXAMPLE 1: MINIMAL CONFIGURATION
// ==========================================

// jest.config.js - Minimal setup
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

// jest.setup.js
import '@testing-library/jest-dom';

// ==========================================
// EXAMPLE 2: REACT PROJECT (Create React App style)
// ==========================================

// jest.config.js
module.exports = {
  // Use jsdom for React/DOM testing
  testEnvironment: 'jsdom',
  
  // Setup file runs after Jest is initialized
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
  // Module name mapping for path aliases
  moduleNameMapper: {
    // Map @ to src
    '^@/(.*)$': '<rootDir>/src/$1',
    
    // Mock CSS modules
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    
    // Mock static assets
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  
  // Transform files with babel-jest
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  // Ignore these paths
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
  ],
  
  // Coverage
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
  ],
  
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

// __mocks__/fileMock.js
module.exports = 'test-file-stub';

// src/setupTests.js
import '@testing-library/jest-dom';

// ==========================================
// EXAMPLE 3: NEXT.JS PROJECT
// ==========================================

// jest.config.js (Next.js 13+)
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Path to Next.js app
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },
  
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
  ],
  
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
};

module.exports = createJestConfig(customJestConfig);

// jest.setup.js
import '@testing-library/jest-dom';

// Mock next/router
jest.mock('next/router', () => require('next-router-mock'));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />;
  },
}));

// ==========================================
// EXAMPLE 4: TYPESCRIPT + REACT
// ==========================================

// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  roots: ['<rootDir>/src'],
  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.ts',
  },
  
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
      },
    }],
  },
  
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.stories.tsx',
  ],
  
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;

// jest.setup.ts
import '@testing-library/jest-dom';

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(floor: number, ceiling: number): R;
    }
  }
}

expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be within range ${floor} - ${ceiling}`
          : `expected ${received} to be within range ${floor} - ${ceiling}`,
    };
  },
});

// ==========================================
// EXAMPLE 5: MONOREPO / MULTIPLE PROJECTS
// ==========================================

// jest.config.js (root)
module.exports = {
  projects: [
    '<rootDir>/packages/*/jest.config.js',
  ],
};

// packages/ui/jest.config.js
module.exports = {
  displayName: 'ui',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/*.test.{js,jsx,ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

// packages/api/jest.config.js
module.exports = {
  displayName: 'api',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.test.{js,ts}'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

// ==========================================
// EXAMPLE 6: ADVANCED CONFIGURATION
// ==========================================

// jest.config.js - Full featured
module.exports = {
  // Basic setup
  testEnvironment: 'jsdom',
  rootDir: '.',
  roots: ['<rootDir>/src'],
  
  // Setup files
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module resolution
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  
  moduleNameMapper: {
    // Path aliases
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    
    // Style mocks
    '\\.(css|less)$': 'identity-obj-proxy',
    '\\.module\\.(css|scss)$': 'identity-obj-proxy',
    
    // Asset mocks
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(woff|woff2|eot|ttf|otf)$': '<rootDir>/__mocks__/fileMock.js',
  },
  
  // Transforms
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
    }],
  },
  
  transformIgnorePatterns: [
    'node_modules/(?!(some-esm-package)/)',
  ],
  
  // Test patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/.next/',
  ],
  
  // Coverage
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/index.tsx',
  ],
  
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
  ],
  
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/components/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    './src/utils/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  
  // Performance
  maxWorkers: '50%',
  
  // Watch mode
  watchman: true,
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  
  // Globals
  globals: {
    __DEV__: true,
  },
  
  // Misc
  verbose: true,
  testTimeout: 10000,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

// jest.polyfills.js
// Polyfills that need to run before anything else
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// jest.setup.js
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Suppress console in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Global test utilities
global.testUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
};

// ==========================================
// EXAMPLE 7: PACKAGE.JSON SCRIPTS
// ==========================================

/*
// package.json
{
  "name": "my-app",
  "scripts": {
    // Basic test commands
    "test": "jest",
    "test:watch": "jest --watch",
    "test:watchAll": "jest --watchAll",
    
    // Coverage
    "test:coverage": "jest --coverage",
    "test:coverage:watch": "jest --coverage --watchAll",
    
    // CI/CD
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    
    // Specific patterns
    "test:unit": "jest --testPathPattern=/__tests__/unit/",
    "test:integration": "jest --testPathPattern=/__tests__/integration/",
    "test:components": "jest --testPathPattern=/components/",
    
    // Debug
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    
    // Update snapshots
    "test:update": "jest --updateSnapshot"
  },
  "jest": {
    "preset": "react-native"
  }
}
*/

// ==========================================
// EXAMPLE 8: HANDLING ESM PACKAGES
// ==========================================

// jest.config.js - Transform ESM packages
module.exports = {
  transformIgnorePatterns: [
    // Don't transform anything in node_modules except these ESM packages
    'node_modules/(?!(uuid|nanoid|some-esm-package)/)',
  ],
  
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
      ],
    }],
  },
};

// ==========================================
// EXAMPLE 9: PER-FILE TEST ENVIRONMENT
// ==========================================

// someComponent.test.js
/**
 * @jest-environment jsdom
 */
test('component renders', () => {
  // Uses jsdom
  render(<MyComponent />);
});

// api.test.js
/**
 * @jest-environment node
 */
test('API endpoint works', async () => {
  // Uses node
  const result = await apiFunction();
});

// ==========================================
// EXAMPLE 10: CUSTOM MATCHER EXAMPLE
// ==========================================

// jest.setup.js with custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () =>
        `expected ${received} ${pass ? 'not ' : ''}to be within range ${floor} - ${ceiling}`,
    };
  },
  
  toHaveBeenCalledWithMatch(received, expectedArg) {
    const calls = received.mock.calls;
    const pass = calls.some(call =>
      call.some(arg => {
        if (typeof expectedArg === 'object') {
          return JSON.stringify(arg).includes(JSON.stringify(expectedArg));
        }
        return arg === expectedArg;
      })
    );
    
    return {
      pass,
      message: () =>
        `expected mock to ${pass ? 'not ' : ''}have been called with ${expectedArg}`,
    };
  },
});

// Usage in tests
test('custom matchers work', () => {
  expect(15).toBeWithinRange(10, 20);
  
  const mockFn = jest.fn();
  mockFn({ user: { id: 1, name: 'John' } });
  expect(mockFn).toHaveBeenCalledWithMatch({ user: { id: 1 } });
});

// ==========================================
// QUICK START GUIDE
// ==========================================

/*
STEP 1: Install dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

STEP 2: Create jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

STEP 3: Create jest.setup.js
import '@testing-library/jest-dom';

STEP 4: Add script to package.json
"scripts": {
  "test": "jest"
}

STEP 5: Run tests
npm test
*/