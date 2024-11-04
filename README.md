# Passkit WebService Toolkit

Integrate Apple Wallet Web services with ease.

## Architecture

Passkit WebService Toolkit is a set of functions and constants that aim to make it easier to create an Apple-Wallet-Webservice-compliant API.

It exposes the endpoints defined by Apple in its [documentation](https://developer.apple.com/documentation/walletpasses/adding_a_web_service_to_update_passes) and makes it easier for them to be used in a Typescript-based project, by keeping an eye on the developer experience and endpoint versioning.

This library is meant to be **framework-agnostic** and **not really to be imported directly**. Instead, it is meant to be **used by third-party libraries to create integrations** with Apple Wallet webservices with existing frameworks (e.g. Fastify, Express, ...).

If you are aiming to use an integration, instead, **you can give a look at some third-party integrations, [whose are listed below](#third-parties-integrations)**.

### Installation

```sh
$ npm install passkit-webservice-toolkit
```

---

## API Documentation

All the exposed informations are detailed in the Wiki.

---

## Integrations

Did you develop an integration that uses this package? Open a Pull Request to add it here!

- [Fastify Passkit Webservice](https://github.com/alexandercerutti/fastify-passkit-webservice)
- [Express Passkit Webservice](https://github.com/alexandercerutti/express-passkit-webservice)
- [Hono Passkit Webservice](https://github.com/alexandercerutti/hono-passkit-webservice)
