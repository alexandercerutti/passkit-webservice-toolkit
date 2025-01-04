import { IntentApplicationContext, ServiceProvider } from "@intentjs/core";
import { IndexService } from "app/services";

export class AppServiceProvider extends ServiceProvider {
	/**
	 * Register any application services here.
	 */
	register() {
		/**
		 * Binding the UserService with the application.
		 *
		 * Read more - https://tryintent.com/docs/providers
		 */
		this.bind(IndexService);
	}

	/**
	 * Bootstrap any application service here.
	 */
	boot(app: IntentApplicationContext) {}
}
