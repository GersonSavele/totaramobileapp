/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: "ts-jest",
  roots: [
    // "./",
    // "../src/totara/auth/e2e",
    // "../src/totara/features/currentLearning/e2e",
    "../src/totara/features/activities/scorm/e2e",
    // "../src/totara/features/about/e2e"
  ],
  testMatch: ['**/*.spec.ts','**/*.test.js'],
  setupFilesAfterEnv: [
    "./init.ts"
  ],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
};
