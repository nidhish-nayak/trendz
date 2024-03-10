/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleNameMapper: {
		"^\\$/controllers/(.*)$": "<rootDir>/src/controllers/$1",
		"^\\$/middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
		"^\\$/routes/(.*)$": "<rootDir>/src/routes/$1",
		"^\\$/(.*)$": "<rootDir>/src/$1",
		// Add more mappings as needed...
	},
};
