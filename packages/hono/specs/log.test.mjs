import { Hono } from "hono";
import { describe, it, beforeEach } from "node:test";
import { rejects, strictEqual } from "node:assert";
import { HandlerNotFoundError } from "../lib/HandlerNotFoundError.js";

describe("log service", () => {
	/**
	 * @type {import("hono").Hono};
	 */
	let honoApp;

	beforeEach(() => {
		honoApp = new Hono();
	});

	describe("import", async () => {
		it("should import plugin from direct import", async () => {
			const { default: directFileImport } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"hono-passkit-webservice/v1/log.js"
			);

			strictEqual(typeof directFileImport, "function");
			strictEqual(directFileImport.name, "LogRouter");
		});

		it("should import plugin from v1 entry point", async () => {
			const { LogRouter } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"hono-passkit-webservice/v1"
			);

			strictEqual(typeof LogRouter, "function");
			strictEqual(LogRouter.name, "LogRouter");
		});

		it("should import v1 plugin from global package entry", async () => {
			const {
				v1: { LogRouter },
			} = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"hono-passkit-webservice"
			);

			strictEqual(typeof LogRouter, "function");
			strictEqual(LogRouter.name, "LogRouter");
		});
	});

	it("should throw an error if the handler is not provided", async () => {
		await rejects(
			async () => {
				honoApp.route(
					"/",
					// @ts-expect-error
					(await import("../lib/middlewares/v1/log.js")).default(),
				);
			},
			(/** @type {HandlerNotFoundError} */ err) => {
				strictEqual(err.name, "HandlerNotFoundError");
				return true;
			},
		);
	});
});
