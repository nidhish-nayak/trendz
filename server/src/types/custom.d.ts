import "express-session";

// Define a custom interface for session data
declare module "express-session" {
	interface SessionData {
		check?: boolean; // Define the custom property check
	}
}
