// @ts-check
/// <reference types="node" />

const { describe, it } = require("node:test");
const { strictEqual } = require("node:assert");

describe("CJS require", () => {
	describe("Register", () => {
		it("should require endpoint from direct require", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const {
				RegisterEndpoint,
			} = require("passkit-webservice-toolkit/v1/register.js");

			strictEqual(typeof RegisterEndpoint, "object");
			strictEqual(RegisterEndpoint.method, "POST");
		});

		it("should require endpoint from v1 entry point", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const { RegisterEndpoint } = require("passkit-webservice-toolkit/v1");

			strictEqual(typeof RegisterEndpoint, "object");
			strictEqual(RegisterEndpoint.method, "POST");
		});

		it("should require v1 endpoint from global package entry", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const {
				v1: { RegisterEndpoint },
			} = require("passkit-webservice-toolkit");

			strictEqual(typeof RegisterEndpoint, "object");
			strictEqual(RegisterEndpoint.method, "POST");
		});
	});

	describe("Unregister", () => {
		it("should import endpoint from direct require", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const {
				UnregisterEndpoint,
			} = require("passkit-webservice-toolkit/v1/unregister.js");

			strictEqual(typeof UnregisterEndpoint, "object");
			strictEqual(UnregisterEndpoint.method, "DELETE");
		});

		it("should import endpoint from v1 entry point", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const { UnregisterEndpoint } = require("passkit-webservice-toolkit/v1");

			strictEqual(typeof UnregisterEndpoint, "object");
			strictEqual(UnregisterEndpoint.method, "DELETE");
		});

		it("should import v1 endpoint from global package entry", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const {
				v1: { UnregisterEndpoint },
			} = require("passkit-webservice-toolkit");

			strictEqual(typeof UnregisterEndpoint, "object");
			strictEqual(UnregisterEndpoint.method, "DELETE");
		});
	});

	describe("Update", () => {
		it("should import endpoint from direct require", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const {
				UpdateEndpoint,
			} = require("passkit-webservice-toolkit/v1/update.js");

			strictEqual(typeof UpdateEndpoint, "object");
			strictEqual(UpdateEndpoint.method, "GET");
		});

		it("should import endpoint from v1 entry point", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const { UpdateEndpoint } = require("passkit-webservice-toolkit/v1");

			strictEqual(typeof UpdateEndpoint, "object");
			strictEqual(UpdateEndpoint.method, "GET");
		});

		it("should import v1 endpoint from global package entry", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const {
				v1: { UpdateEndpoint },
			} = require("passkit-webservice-toolkit");

			strictEqual(typeof UpdateEndpoint, "object");
			strictEqual(UpdateEndpoint.method, "GET");
		});
	});

	describe("List", () => {
		it("should import endpoint from direct require", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const { ListEndpoint } = require("passkit-webservice-toolkit/v1/list.js");

			strictEqual(typeof ListEndpoint, "object");
			strictEqual(ListEndpoint.method, "GET");
		});

		it("should import endpoint from v1 entry point", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const { ListEndpoint } = require("passkit-webservice-toolkit/v1");

			strictEqual(typeof ListEndpoint, "object");
			strictEqual(ListEndpoint.method, "GET");
		});

		it("should import v1 endpoint from global package entry", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const {
				v1: { ListEndpoint },
			} = require("passkit-webservice-toolkit");

			strictEqual(typeof ListEndpoint, "object");
			strictEqual(ListEndpoint.method, "GET");
		});
	});

	describe("Log", () => {
		it("should import endpoint from direct require", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const { LogEndpoint } = require("passkit-webservice-toolkit/v1/log.js");

			strictEqual(typeof LogEndpoint, "object");
			strictEqual(LogEndpoint.method, "POST");
		});

		it("should import endpoint from v1 entry point", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const { LogEndpoint } = require("passkit-webservice-toolkit/v1");

			strictEqual(typeof LogEndpoint, "object");
			strictEqual(LogEndpoint.method, "POST");
		});

		it("should import v1 endpoint from global package entry", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const {
				v1: { LogEndpoint },
			} = require("passkit-webservice-toolkit");

			strictEqual(typeof LogEndpoint, "object");
			strictEqual(LogEndpoint.method, "POST");
		});
	});

	describe("Utils", () => {
		it("should import endpoint from direct require", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const {
				getAuthorizationToken,
				isAuthorizationSchemeValid,
			} = require("passkit-webservice-toolkit/v1/utils/auth.js");

			strictEqual(typeof getAuthorizationToken, "function");
			strictEqual(typeof isAuthorizationSchemeValid, "function");
		});

		it("should require endpoint from v1 entry point", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const {
				getAuthorizationToken,
				isAuthorizationSchemeValid,
			} = require("passkit-webservice-toolkit/v1");

			strictEqual(typeof getAuthorizationToken, "function");
			strictEqual(typeof isAuthorizationSchemeValid, "function");
		});

		it("should require v1 endpoint from global package entry", async () => {
			/** this will give error when package itself is not linked through `pnpm test` */
			const {
				v1: { getAuthorizationToken, isAuthorizationSchemeValid },
			} = require("passkit-webservice-toolkit");

			strictEqual(typeof getAuthorizationToken, "function");
			strictEqual(typeof isAuthorizationSchemeValid, "function");
		});
	});
});
