module.exports = {
  transform: {
    '^.+\\.m?js$': 'babel-jest', // Handle .js and .mjs files
  },
  moduleFileExtensions: ['js', 'mjs', 'json', 'node'], // Recognize .mjs extensions
  testEnvironment: 'node', // Use Node.js environment
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
    '**/?(*.)+(spec|test).mjs', // Include mjs
  ],
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
