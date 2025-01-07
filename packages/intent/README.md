# Intent Passkit WebService

Integrate Apple Wallet Web services in your current (or new) [IntentJS](https://github.com/intentjs/intent) integration.

## Architecture

Intent Passkit Webservice, as the name says, wraps Apple Wallet specifications into an IntentJS integration.

Each endpoint defined in [Apple Wallet specification](https://developer.apple.com/documentation/walletpasses/adding_a_web_service_to_update_passes) is exposed under a the form of a `Controller` and a `Service`, that will let you dedicate exclusively to the integration of the business logic.

For the architecture of IntentJS, the `Service` (for each endpoint) includes the minimum needed to represent the signatures a `Controller` will use from it. However, all the methods from `Service` will get overridden when loading. It acts more as a safe guard.

Everything is designed to provide a good developer experience. It is fully compatible with Typescript.

This package is an integration of [passkit-webservice-toolkit](https://github.com/alexandercerutti/passkit-webservice-toolkit). Visit it for other integrations.

### Installation

```sh
$ npm install intent-passkit-webservice
```

---

## API Documentation

All the details are available in the project wiki.

---

### Usage example

All the exposed `Controller`s and `Service`s work like this:

```js
/** Registering Service inside: app/boot/sp/app.ts **/
/** Use require or import as a CJS TS */
const { v1: { Registration: { Service: RegistrationService }} } = require("intent-passkit-webservice");

export class AppServiceProvider extends ServiceProvider {
	/**
	 * Register any application services here.
	 */
	register() {
		this.bindWithValue(RegistrationService, {
			async onRegister(
				deviceLibraryIdentifier: string,
				passTypeIdentifier: string,
				serialNumber: string,
				pushToken: string,
			): Promise<boolean> {
				/** your implementation */
			},
			async onUnregister(
				deviceLibraryIdentifier: string,
				passTypeIdentifier: string,
				serialNumber: string,
			): Promise<void> {
				/** your implementation */
			},
			async tokenVerifier(token: string): Promise<boolean> {
				/** your implementation */
			},
		});
	}

	// ...
}

/** Registering Controller inside: app/http/kernel.ts **/
/** Use require or import as a CJS TS */
const { v1: { Registration: { Controller: RegistrationController }} } = require("intent-passkit-webservice");

export class HttpKernel extends Kernel {
	public controllers(): Type<any>[] {
		return [
			RegistrationController,
		];
	}

	// ...
}
```
