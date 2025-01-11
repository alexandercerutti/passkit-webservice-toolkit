import {
	toBoolean,
	configNamespace,
	ValidationErrorSerializer,
} from "@intentjs/core";
import type {
	AppConfig,
	RegisterNamespaceReturnType
} from "@intentjs/core";

export default configNamespace(
	"app",
	(): AppConfig => ({
		/**
		 * -----------------------------------------------------
		 * Application Name
		 * -----------------------------------------------------
		 *
		 * This value is the name of your application. This value is
		 * used when the framework needs to place the application's
		 * name in a notification or any other location as required.
		 */
		name: process.env.APP_NAME || "Intent App",

		/**
		 * -----------------------------------------------------
		 * Application Environment
		 * -----------------------------------------------------
		 *
		 * This value determines the "environment" your application
		 * is running in. You may set this value in ".env" file.
		 */
		env: process.env.APP_ENV || "local",

		/**
		 * -----------------------------------------------------
		 * Application Debug Mode
		 * -----------------------------------------------------
		 *
		 * When your application is in debug mode, Intent will try
		 * to generate detailed error messages of any task failing.
		 */
		debug: toBoolean(process.env.APP_DEBUG || true),

		/**
		 * -----------------------------------------------------
		 * Application URL
		 * -----------------------------------------------------
		 *
		 * This URL is used by the console to generate complete
		 * accessible URLs for your application.
		 */
		url: process.env.APP_URL || "localhost",

		/**
		 * -----------------------------------------------------
		 * Application Port
		 * -----------------------------------------------------
		 *
		 * This value is the port on which the server will listen
		 * to all incoming requests. You may set this value in
		 * ".env" file.
		 */
		port: +process.env.APP_PORT || 5000,

		/**
		 * This has been hardcoded even if the default.
		 * Will have to be remain here for this issue:
		 *
		 * @see https://github.com/intentjs/intent/issues/57
		 */

		hostname: "0.0.0.0",

		error: {
			/**
			 * -----------------------------------------------------
			 * Validation Serializer
			 * -----------------------------------------------------
			 *
			 * This property defines the serializer class that will be
			 * used to parse the validation errors. The value returned
			 * from this class shall be thrown in the response object
			 * whenever theier is a validation failure.
			 */
			validationErrorSerializer: ValidationErrorSerializer,
		},
	}),
) as RegisterNamespaceReturnType<"app", AppConfig>;
