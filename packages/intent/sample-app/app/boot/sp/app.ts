import { IntentApplicationContext, ServiceProvider } from "@intentjs/core";
import { IndexService } from "app/services/index.js";
import { RegistrationService } from "intent-passkit-webservice/v1/registration/service.js";

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

		this.bindWithValue(RegistrationService, {
			async onRegister(
				deviceLibraryIdentifier: string,
				passTypeIdentifier: string,
				serialNumber: string,
				pushToken: string,
			): Promise<boolean> {
				console.group("RECEIVED REGISTER REQUEST");
				console.log("deviceLibraryIdentifier:", deviceLibraryIdentifier);
				console.log("passTypeIdentifier:", passTypeIdentifier);
				console.log("serialNumber:", serialNumber);
				console.log("pushToken:", pushToken);
				console.groupEnd();
				console.log("=========================");

				return true;
			},
			async onUnregister(
				deviceLibraryIdentifier: string,
				passTypeIdentifier: string,
				serialNumber: string,
			): Promise<void> {
				console.group("RECEIVED UN-REGISTER REQUEST");
				console.log("deviceLibraryIdentifier:", deviceLibraryIdentifier);
				console.log("passTypeIdentifier:", passTypeIdentifier);
				console.log("serialNumber:", serialNumber);
				console.groupEnd();
				console.log("=========================");
			},
			async tokenVerifier(token: string): Promise<boolean> {
				console.log("Verifying token", token);
				return true;
			},
		});
	}

	/**
	 * Bootstrap any application service here.
	 */
	boot(app: IntentApplicationContext) {}
}
