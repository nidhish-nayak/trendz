import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const coveragePath = path.resolve(
	__dirname,
	"../../coverage/lcov-report/index.html"
);

// Display the coverage report link
console.log("Coverage report: \x1b[36m%s\x1b[0m", `${coveragePath.slice(3)}`);
