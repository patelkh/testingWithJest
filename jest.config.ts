import type { Config } from '@jest/types';

const baseDir = '<rootDir>/src/app/server_app/server';
const baseTestDir = '<rootDir>/test/server_app/server';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true, 
    collectCoverage: true,
    collectCoverageFrom: [
        `${baseDir}/**/*.ts`
    ],
    testMatch: [
        `${baseTestDir}/**/*.ts`
    ]
}

export default config; 