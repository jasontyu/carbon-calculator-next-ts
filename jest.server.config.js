// copied from https://github.com/vercel/next.js/tree/canary/examples/with-jest

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  displayName: 'server',
  testMatch: [
    "<rootDir>/pages/api/**/*.test.{ts,tsx}",
    "<rootDir>/services/*.test.{ts,tsx}",
    "<rootDir>/utils/*.test.{ts,tsx}",
    // add more folders as necessary
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/pages/*.test.{ts,tsx}",
  ],
  testEnvironment: 'node'
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
