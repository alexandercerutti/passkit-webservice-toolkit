# Fastify Passkit WebService

Integrate Apple Wallet Web services in your current fastify integration.

## Architecture

Fastify Passkit Webservice, as the name says, wraps Apple Wallet specifications into a Fastify integration.

It exposes a set of plugins that will let yourself to dedicate exclusively to the integration of the business logic.

Each plugin represents a subscription to an endpoint defined in [Apple Wallet Developer Documentation](https://developer.apple.com/documentation/walletpasses/adding_a_web_service_to_update_passes).

Everything is designed to provide a good developer esperience. It is fully compatible with Typescript.

This package is an integration of [passkit-webservice-toolkit](https://github.com/alexandercerutti/passkit-webservice-toolkit). Visit it for other integrations.

### Installation

```sh
$ npm install fastify-passkit-webservice
```

---

## API Documentation

All the details are available in the dedicated project [wiki page](https://github.com/alexandercerutti/fastify-passkit-webservice/wiki/API-Documentation-Reference).

---

### Usage example

All the exposed middlewares work like this:

```js
import Fastify from "fastify";

const app = Fastify();

app.register(import("fastify-passkit-webservice/v1/registration.js"), {
	async onRegister(
		deviceLibraryIdentifier,
		passTypeIdentifier,
		serialNumber,
		pushToken,
	) {
		/** your implementation */
	},
	async onUnregister(
		deviceLibraryIdentifier,
		passTypeIdentifier,
		serialNumber,
	) {
		/** your implementation */
	},
	async tokenVerifier(token) {
		/** your implementation */
	},
});
```

Give a look at `specs/server.mjs` for fully example.
