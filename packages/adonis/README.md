# Adonis Passkit WebService

Integrate Apple Wallet Web services in your current AdonisJS integration.

## Architecture

Adonis Passkit Webservice, as the name says, wraps Apple Wallet specifications into an Adonis js integration.

It exposes a set of routing groups that will let yourself to dedicate exclusively to the integration of the business logic.

Each plugin represents a subscription to an endpoint defined in [Apple Wallet Developer Documentation](https://developer.apple.com/documentation/walletpasses/adding_a_web_service_to_update_passes).

Everything is designed to provide a good developer experience. It is fully compatible with Typescript.

This package is an integration of [passkit-webservice-toolkit](https://github.com/alexandercerutti/passkit-webservice-toolkit). Visit it for other integrations.

### Installation

```sh
$ npm install adonis-passkit-webservice
```

---

## API Documentation

All the details are available in the project wiki.

---

### Usage example

All the exposed routes work like this:

```ts
/** src/start/routes.ts */
import router from "@adonisjs/core/services/router";

router.group(
	(await import("adonis-passkit-webservice/v1/registration.js")).default({
		async onRegister(
			deviceLibraryIdentifier,
			passTypeIdentifier,
			serialNumber,
			pushToken,
		) {
			/** Your implementation */
		},
		async onUnregister(
			deviceLibraryIdentifier,
			passTypeIdentifier,
			serialNumber,
		) {
			/** Your implementation */
		},
		async tokenVerifier(token) {
			/** Your implementation */
			return true;
		},
	}),
);
```
