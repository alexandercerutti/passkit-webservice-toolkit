import { configNamespace } from "@intentjs/core";
import type { HttpConfig, RegisterNamespaceReturnType } from "@intentjs/core";

export default configNamespace(
	"http",
	(): HttpConfig => ({
		/**
		 * -----------------------------------------------------
		 * Cross Origin Resource Sharing
		 * -----------------------------------------------------
		 *
		 * You can use this setting to define the CORS rule of
		 * your application.
		 */
		cors: {
			origin: true,
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		},
	}),
) as RegisterNamespaceReturnType<"http", HttpConfig>;
