import { IntentApplicationContext, ServiceProvider } from "@intentjs/core";
import { IndexService } from "app/services/index.js";
import { RegistrationService } from "intent-passkit-webservice/v1/registration/service.js";
import { LogService } from "intent-passkit-webservice/v1/log/service.js";
import { UpdateService } from "intent-passkit-webservice/v1/update/service.js";
import { ListService } from "intent-passkit-webservice/v1/list/service.js";
import { createPass } from "app/utils/index.js";

let lastUpdate: number;

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

		this.bindWithValue(LogService, {
			onIncomingLogs(logs: string[]) {
				console.group("Logs received");
				console.log(logs);
				console.groupEnd();
				console.log("=========================");
			},
		});

		this.bindWithValue(UpdateService, {
			async onUpdateRequest(
				passTypeIdentifier: string,
				serialNumber: string,
				modifiedSinceTimestamp: number,
			) {
				console.group("RECEIVED UPDATE REQUEST");
				console.log("passTypeIdentifier:", passTypeIdentifier);
				console.log("serialNumber:", serialNumber);
				console.log("modifiedSinceTimestamp:", modifiedSinceTimestamp);
				console.groupEnd();
				console.log("=========================");

				if (modifiedSinceTimestamp) {
					console.log(new Date(modifiedSinceTimestamp), new Date(lastUpdate));
				}

				if (modifiedSinceTimestamp && modifiedSinceTimestamp >= lastUpdate) {
					console.log("modifiedSinceTimestamp >= lastUpdate");
					return undefined;
				}

				lastUpdate = Date.now();

				const pass = await createPass(
					{
						voided: true,
						passTypeIdentifier,
					},
					serialNumber,
				);

				return pass.getAsBuffer();
			},
		});

		this.bindWithValue(ListService, {
			async onListRetrieve<LastUpdatedFormat>(
				deviceLibraryIdentifier: string,
				passTypeIdentifier: string,
				{ passesUpdatedSince }: { passesUpdatedSince: LastUpdatedFormat },
			) {
				console.group("RECEIVED LIST REQUEST");
				console.log("deviceLibraryIdentifier:", deviceLibraryIdentifier);
				console.log("passTypeIdentifier:", passTypeIdentifier);
				console.log("passesUpdatedSince:", passesUpdatedSince);
				console.groupEnd();
				console.log("=========================");

				return {
					serialNumbers: ["askdfgas"],
					lastUpdated: `${Date.now()}`,
				};
			},
		});
	}

	/**
	 * Bootstrap any application service here.
	 */
	boot(app: IntentApplicationContext) {}
}
