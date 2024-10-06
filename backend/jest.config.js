module.exports = {
    transform: {
        '^.+\\.m?js$': 'babel-jest', // Handle .js and .mjs files
    },
    moduleFileExtensions: ['js', 'mjs', 'json', 'node'], // Recognize .mjs extensions
    testEnvironment: 'node', // Use Node.js environment
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)', '**/?(*.)+(spec|test).mjs'], // Include mjs
};
