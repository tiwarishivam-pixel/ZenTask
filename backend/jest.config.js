/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",              // tells Jest to work with TypeScript
  testEnvironment: "node",        // backend tests run in Node.js
  testMatch: ["**/src/**/*.test.ts"], // looks for test files inside src
  verbose: true                   // show detailed test results
};
