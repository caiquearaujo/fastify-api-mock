module.exports = {
	verbose: true,
	rootDir: '.',
	roots: ['<rootDir>/src', '<rootDir>/test'],
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
	testMatch: ['**/test/*spec.+(ts)', '**/test/**/*spec.+(ts)'],
	collectCoverage: true,
	coverageThreshold: {
		global: {
			branches: 60,
			functions: 60,
			lines: 60,
			statements: 60,
		},
	},
	coveragePathIgnorePatterns: [
		'./node_modules/',
		'./test/',
		'./src/server',
	],
	coverageReporters: ['json-summary', 'text', 'lcov'],
	globals: {
		'ts-jest': {
			diagnostics: false,
			tsconfig: 'tsconfig.json',
		},
	},
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],
	moduleNameMapper: {
		'@/(.*)': '<rootDir>/src/$1',
		'@test/(.*)': '<rootDir>/test/$1',
	},
	moduleDirectories: ['node_modules', '<rootDir>/src'],
	setupFiles: ['<rootDir>/src/server/config.ts'],
	setupFilesAfterEnv: ['<rootDir>/test/global.ts'],
	extensionsToTreatAsEsm: ['.ts'],
};
