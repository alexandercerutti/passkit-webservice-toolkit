import { IntentApplicationContext, ServiceProvider } from "@intentjs/core";
import { GreetingCommand } from "app/console/greeting.js";

export class ConsoleServiceProvider extends ServiceProvider {
	/**
	 * Register any application services here.
	 */
	register() {
		this.bind(GreetingCommand);
	}

	/**
	 * Bootstrap any application service here.
	 */
	boot(app: IntentApplicationContext) {}
}
