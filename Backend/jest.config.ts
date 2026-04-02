import type { Config } from "jest";

const config: Config = {
  preset:          "ts-jest",
  testEnvironment: "node",
  roots:           ["<rootDir>/tests"],
  collectCoverageFrom: ["src/**/*.ts"],
  coveragePathIgnorePatterns: ["src/app.ts"],
  globals: {
    "ts-jest": {
      // Use the test-specific tsconfig — not the build one
      tsconfig: "./tsconfig.test.json",
    },
  },
};

export default config;