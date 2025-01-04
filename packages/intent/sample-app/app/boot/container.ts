import { IntentAppContainer, IntentProvidersFactory } from "@intentjs/core";
import { AppServiceProvider } from "./sp/app";
import { ConsoleServiceProvider } from "./sp/console";
import config from "config";

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

		/**
		 * Registering our console commands service providers.
		 */
		this.add(ConsoleServiceProvider);
	}
}
