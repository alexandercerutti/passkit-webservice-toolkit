import express from "express";
import { describe, it, beforeEach, mock, afterEach } from "node:test";
import { strictEqual, rejects, deepStrictEqual } from "node:assert";
import { HandlerNotFoundError } from "../lib/HandlerNotFoundError.js";
import { ListEndpoint } from "passkit-webservice-toolkit/v1/list.js";
import { startExpress } from "./utils.mjs";

/**
 * @type {HeadersInit}
 */

const BASE_HEADERS = {
	Accept: "application/json",
	"Content-Type": "application/json",
};

const LIST_BASE_PATH = ListEndpoint.path;

describe("list service", () => {
	/**
	 * @type {import("express").Application};
	 */
	let expressApp;

	/**
	 * @type {{ close: Function; address: string | null }}
	 */
	let serverInstance;

	beforeEach(() => {
		expressApp = express();
	});

	afterEach(() => {
		if (typeof serverInstance !== "undefined") {
			serverInstance.close();
		}
	});

	describe("import", async () => {
		it("should import plugin from direct import", async () => {
			const { default: directFileImport } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"express-passkit-webservice/v1/list.js"
			);

			strictEqual(typeof directFileImport, "function");
			strictEqual(directFileImport.name, "ListRouter");
		});

		it("should import plugin from v1 entry point", async () => {
			const { ListRouter } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"express-passkit-webservice/v1"
			);

			strictEqual(typeof ListRouter, "function");
			strictEqual(ListRouter.name, "ListRouter");
		});

		it("should import v1 plugin from global package entry", async () => {
			const {
				v1: { ListRouter },
			} = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"express-passkit-webservice"
			);

			strictEqual(typeof ListRouter, "function");
			strictEqual(ListRouter.name, "ListRouter");
		});
	});

	it("should throw an error if the handler is not provided", async () => {
		rejects(
			async () => {
				expressApp.use(
					// @ts-expect-error
					(await import("../lib/middlewares/v1/list.js")).default(),
				);
			},
			(/** @type {HandlerNotFoundError} */ err) => {
				strictEqual(err.name, "HandlerNotFoundError");
				return true;
			},
		);
	});

	it("handler should get called when provided", async () => {
		const onListRetrieveMock = mock.fn(
			/**
			 * @param {string} deviceLibraryIdentifier
			 * @param {string} passTypeIdentifier
			 * @param {object} filters
			 * @param {string} [filters.passesUpdatedSince]
			 * @return {Promise<import("passkit-webservice-toolkit/v1").SerialNumbers>}
			 */
			async (deviceLibraryIdentifier, passTypeIdentifier, filters) => ({
				serialNumbers: [],
				lastUpdated: String(Date.now()),
			}),
		);

		expressApp.use(
			(await import("express-passkit-webservice/v1/list.js")).default({
				onListRetrieve: onListRetrieveMock,
			}),
		);

		serverInstance = await startExpress(expressApp);

		const response = await fetch(`${serverInstance.address}${LIST_BASE_PATH}`, {
			method: "GET",
			headers: BASE_HEADERS,
		});

		strictEqual(response.status, 200);
		strictEqual(onListRetrieveMock.mock.callCount(), 1);
	});

	it("handler should make return http 204 when it returns null or undefined", async () => {
		const onListRetrieveMock = mock.fn(
			/**
			 * @param {string} deviceLibraryIdentifier
			 * @param {string} passTypeIdentifier
			 * @param {object} filters
			 * @param {string} [filters.passesUpdatedSince]
			 * @return {Promise<import("passkit-webservice-toolkit/v1").SerialNumbers>}
			 */
			// @ts-expect-error
			async (deviceLibraryIdentifier, passTypeIdentifier, filters) => null,
		);

		expressApp.use(
			(await import("express-passkit-webservice/v1/list.js")).default({
				onListRetrieve: onListRetrieveMock,
			}),
		);

		serverInstance = await startExpress(expressApp);
		const response = await fetch(`${serverInstance.address}${LIST_BASE_PATH}`, {
			method: "GET",
			headers: BASE_HEADERS,
		});

		strictEqual(response.status, 204);
		strictEqual(onListRetrieveMock.mock.callCount(), 1);
		strictEqual(await onListRetrieveMock.mock.calls[0].result, null);
	});

	it("handlers should receive the arguments of the request path", async () => {
		const onListRetrieveMock = mock.fn(
			/**
			 * @param {string} deviceLibraryIdentifier
			 * @param {string} passTypeIdentifier
			 * @param {object} filters
			 * @param {string} [filters.passesUpdatedSince]
			 * @return {Promise<import("passkit-webservice-toolkit/v1").SerialNumbers>}
			 */
			async (deviceLibraryIdentifier, passTypeIdentifier, filters) => ({
				serialNumbers: [""],
				lastUpdated: String(Date.now()),
			}),
		);

		expressApp.use(
			(await import("express-passkit-webservice/v1/list.js")).default({
				onListRetrieve: onListRetrieveMock,
			}),
		);

		serverInstance = await startExpress(expressApp);

		const LIST_BASE_PATH_WITH_PARAMS = LIST_BASE_PATH.replace(
			":deviceLibraryIdentifier",
			"hkweagjdyjukhiljsadck",
		).replace(":passTypeIdentifier", "com.my.pass.test");

		const response = await fetch(
			`${serverInstance.address}${LIST_BASE_PATH_WITH_PARAMS}?passesUpdatedSince=09128365712`,
			{
				method: "GET",
				headers: BASE_HEADERS,
			},
		);

		strictEqual(response.status, 200);
		strictEqual(onListRetrieveMock.mock.callCount(), 1);
		deepStrictEqual(onListRetrieveMock.mock.calls[0].arguments, [
			"hkweagjdyjukhiljsadck",
			"com.my.pass.test",
			{
				passesUpdatedSince: "09128365712",
			},
		]);
	});
});
