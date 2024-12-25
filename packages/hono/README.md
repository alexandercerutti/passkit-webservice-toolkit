# Hono Passkit WebService

Integrate Apple Wallet Web services in your current (or new) Hono.dev integration.

## Architecture

Hono Passkit Webservice, as the name says, wraps Apple Wallet specifications into a Hono integration.

It exposes a set of middlewares / routes that will let yourself to dedicate exclusively to the integration of the business logic.

Each plugin represents a subscription to an endpoint defined in [Apple Wallet Developer Documentation](https://developer.apple.com/documentation/walletpasses/adding_a_web_service_to_update_passes).

Everything is designed to provide a good developer experience. It is fully compatible with Typescript.

This package is an integration of [passkit-webservice-toolkit](https://github.com/alexandercerutti/passkit-webservice-toolkit). Visit it for other integrations.

### Installation

```sh
$ npm install hono-passkit-webservice
```

---

## API Documentation

All the details are available in the project wiki.

---

### Usage example

All the exposed middlewares work like this:

```js
import { Hono } from "hono";
import registrationRouter from "hono-passkit-webservice/v1/registration.js";

const app = new Hono();

app.route("/", registrationRouter({
	async onRegister(deviceLibraryIdentifier, passTypeIdentifier, serialNumber, pushToken) {
		/** your implementation */
	}
	async onUnregister(deviceLibraryIdentifier, passTypeIdentifier, serialNumber) {
		/** your implementation */
	}
}));
```
