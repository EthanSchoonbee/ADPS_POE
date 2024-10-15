// jest.config.js
module.exports = {
  transform: {
    '^.+\\.m?js$': 'babel-jest', // Handle .js and .mjs files
  },
  moduleFileExtensions: ['js', 'mjs', 'json', 'node'], // Recognize .mjs extensions
  testEnvironment: 'jsdom', // Change to 'jsdom' if testing React components
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
    '**/?(*.)+(spec|test).mjs',
    '**/__test__/**/*.[jt]s?(x)',
  ],
  // Add this to support ECMAScript modules
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/', // Allow axios to be transformed
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS files
    '\\.(png|jpg|jpeg|gif|svg)$': 'jest-transform-stub', // Mock image files
  },
  collectCoverage: true,
  coverageDirectory: 'coverage', // Directory where Jest will output coverage files
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // Report formats
  // Specify which files to collect coverage for (if needed)
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}', // Adjust according to your source file types and paths
    '!**/node_modules/**',
    '!**/vendor/**',
    // Optionally exclude test files from coverage
    '!**/*.test.{js,jsx,ts,tsx}',
  ],
};
