import { describe, it } from "node:test";
import { strictEqual } from "node:assert";

describe("ESM Import", () => {
	describe("Register", () => {
		it("should import endpoint from direct import", async () => {
			const { RegisterEndpoint } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"passkit-webservice-toolkit/v1/register.js"
			);

			strictEqual(typeof RegisterEndpoint, "object");
			strictEqual(RegisterEndpoint.method, "POST");
		});

		it("should import endpoint from v1 entry point", async () => {
			const { RegisterEndpoint } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"passkit-webservice-toolkit/v1"
			);

			strictEqual(typeof RegisterEndpoint, "object");
			strictEqual(RegisterEndpoint.method, "POST");
		});

		it("should import v1 endpoint from global package entry", async () => {
			const {
				v1: { RegisterEndpoint },
			} = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"passkit-webservice-toolkit"
			);

			strictEqual(typeof RegisterEndpoint, "object");
			strictEqual(RegisterEndpoint.method, "POST");
		});
	});

	describe("Unregister", () => {
		it("should import endpoint from direct import", async () => {
			const { UnregisterEndpoint } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"passkit-webservice-toolkit/v1/unregister.js"
			);

			strictEqual(typeof UnregisterEndpoint, "object");
			strictEqual(UnregisterEndpoint.method, "DELETE");
		});

		it("should import endpoint from v1 entry point", async () => {
			const { UnregisterEndpoint } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"passkit-webservice-toolkit/v1"
			);

			strictEqual(typeof UnregisterEndpoint, "object");
			strictEqual(UnregisterEndpoint.method, "DELETE");
		});

		it("should import v1 endpoint from global package entry", async () => {
			const {
				v1: { UnregisterEndpoint },
			} = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"passkit-webservice-toolkit"
			);

			strictEqual(typeof UnregisterEndpoint, "object");
			strictEqual(UnregisterEndpoint.method, "DELETE");
		});
	});

	describe("Update", () => {
		it("should import endpoint from direct import", async () => {
			const { UpdateEndpoint } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"passkit-webservice-toolkit/v1/update.js"
			);

			strictEqual(typeof UpdateEndpoint, "object");
			strictEqual(UpdateEndpoint.method, "GET");
		});

		it("should import endpoint from v1 entry point", async () => {
			const { UpdateEndpoint } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"passkit-webservice-toolkit/v1"
			);

			strictEqual(typeof UpdateEndpoint, "object");
			strictEqual(UpdateEndpoint.method, "GET");
		});

		it("should import v1 endpoint from global package entry", async () => {
			const {
				v1: { UpdateEndpoint },
			} = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"passkit-webservice-toolkit"
			);

			strictEqual(typeof UpdateEndpoint, "object");
			strictEqual(UpdateEndpoint.method, "GET");
		});
	});

	describe("List", () => {
		it("should import endpoint from direct import", async () => {
			const { ListEndpoint } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"passkit-webservice-toolkit/v1/list.js"
			);

			strictEqual(typeof ListEndpoint, "object");
			strictEqual(ListEndpoint.method, "GET");
		});

		it("should import endpoint from v1 entry point", async () => {
			const { ListEndpoint } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"passkit-webservice-toolkit/v1"
			);

			strictEqual(typeof ListEndpoint, "object");
			strictEqual(ListEndpoint.method, "GET");
		});

		it("should import v1 endpoint from global package entry", async () => {
			const {
				v1: { ListEndpoint },
			} = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"passkit-webservice-toolkit"
			);

			strictEqual(typeof ListEndpoint, "object");
			strictEqual(ListEndpoint.method, "GET");
		});
	});

	describe("Log", () => {
		it("should import endpoint from direct import", async () => {
			const { LogEndpoint } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"passkit-webservice-toolkit/v1/log.js"
			);

			strictEqual(typeof LogEndpoint, "object");
			strictEqual(LogEndpoint.method, "POST");
		});

		it("should import endpoint from v1 entry point", async () => {
			const { LogEndpoint } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"passkit-webservice-toolkit/v1"
			);

			strictEqual(typeof LogEndpoint, "object");
			strictEqual(LogEndpoint.method, "POST");
		});

		it("should import v1 endpoint from global package entry", async () => {
			const {
				v1: { LogEndpoint },
			} = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"passkit-webservice-toolkit"
			);

			strictEqual(typeof LogEndpoint, "object");
			strictEqual(LogEndpoint.method, "POST");
		});
	});

	describe("Utils", () => {
		it("should import endpoint from direct import", async () => {
			const { getAuthorizationToken, isAuthorizationSchemeValid } =
				await import(
					/** this will give error when package itself is not linked through `pnpm test` */
					"passkit-webservice-toolkit/v1/utils/auth.js"
				);

			strictEqual(typeof getAuthorizationToken, "function");
			strictEqual(typeof isAuthorizationSchemeValid, "function");
		});

		it("should import endpoint from v1 entry point", async () => {
			const { getAuthorizationToken, isAuthorizationSchemeValid } =
				await import(
					/** this will give error when package itself is not linked through `pnpm test` */
					"passkit-webservice-toolkit/v1"
				);

			strictEqual(typeof getAuthorizationToken, "function");
			strictEqual(typeof isAuthorizationSchemeValid, "function");
		});

		it("should import v1 endpoint from global package entry", async () => {
			const {
				v1: { getAuthorizationToken, isAuthorizationSchemeValid },
			} = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"passkit-webservice-toolkit"
			);

			strictEqual(typeof getAuthorizationToken, "function");
			strictEqual(typeof isAuthorizationSchemeValid, "function");
		});
	});
});
