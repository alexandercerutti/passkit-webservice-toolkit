import type { LocalizationOptions, RegisterNamespaceReturnType, } from "@intentjs/core";
import { configNamespace } from "@intentjs/core";

export default configNamespace(
	"localization",
	(): LocalizationOptions => ({
		/**
		 * -----------------------------------------------------
		 * Locale Path
		 * -----------------------------------------------------
		 * Documentation - https://tryintent.com/docs/localization
		 *
		 * This value is the name of the default disk. This will be
		 * used when you use the `Storage` facade to access your
		 * files.
		 */
		path: "resources/lang",

		/**
		 * -----------------------------------------------------
		 * Fallback Lang
		 * -----------------------------------------------------
		 *
		 * This value is used to define the default lang that
		 * will be used when you are using translations in your app.
		 */
		fallbackLang: "en",
	}),
) satisfies RegisterNamespaceReturnType<"localization", LocalizationOptions>;
