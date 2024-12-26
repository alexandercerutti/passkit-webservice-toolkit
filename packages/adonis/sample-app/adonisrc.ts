import { defineConfig } from "@adonisjs/core/app";

export default defineConfig({
	directories: {
		config: "./src/config",
	},
	/*
  |--------------------------------------------------------------------------
  | Commands
  |--------------------------------------------------------------------------
  |
  | List of ace commands to register from packages. The application commands
  | will be scanned automatically from the "./commands" directory.
  |
  */
	commands: [() => import("@adonisjs/core/commands")],

	/*
  |--------------------------------------------------------------------------
  | Service providers
  |--------------------------------------------------------------------------
  |
  | List of service providers to import and register when booting the
  | application
  |
  */
	providers: [
		() => import("@adonisjs/core/providers/app_provider"),
		() => import("@adonisjs/core/providers/hash_provider"),
		{
			file: () => import("@adonisjs/core/providers/repl_provider"),
			environment: ["repl", "test"],
		},
	],

	/*
  |--------------------------------------------------------------------------
  | Preloads
  |--------------------------------------------------------------------------
  |
  | List of modules to import before starting the application.
  |
  */
	preloads: [
		() => import("./src/start/routes.js"),
		() => import("./src/start/kernel.js"),
	],
});
