import { IntentAppContainer, IntentProvidersFactory } from "@intentjs/core";
import { AppServiceProvider } from "./sp/app.js";
import config from "../../config/index.js";

export class ApplicationContainer extends IntentAppContainer {
	build() {
		/**
		 * !! DO NOT REMOVE THIS !!
		 *
		 * Registers the core Intent Service Providers.
		 */
		this.add(IntentProvidersFactory(config));

		/**
		 * Register our main application service providers.
		 */
		this.add(AppServiceProvider);
	}
}
