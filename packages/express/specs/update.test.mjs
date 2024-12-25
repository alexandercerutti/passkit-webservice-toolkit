import express from "express";
import { describe, it, beforeEach, afterEach, mock } from "node:test";
import { strictEqual, rejects, deepStrictEqual } from "node:assert";
import { HandlerNotFoundError } from "../lib/HandlerNotFoundError.js";

import { UpdateEndpoint } from "passkit-webservice-toolkit/v1/update.js";
import { startExpress as startExpress } from "./utils.mjs";

/**
 * @type {HeadersInit}
 */

const BASE_HEADERS = {
	Accept: "application/json",
	"Content-Type": "application/json",
};

const UPDATE_BASE_PATH = UpdateEndpoint.path;

describe("update service", () => {
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
				"express-passkit-webservice/v1/update.js"
			);

			strictEqual(typeof directFileImport, "function");
			strictEqual(directFileImport.name, "UpdateRouter");
		});

		it("should import plugin from v1 entry point", async () => {
			const { UpdateRouter } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"express-passkit-webservice/v1"
			);

			strictEqual(typeof UpdateRouter, "function");
			strictEqual(UpdateRouter.name, "UpdateRouter");
		});

		it("should import v1 plugin from global package entry", async () => {
			const {
				v1: { UpdateRouter },
			} = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"express-passkit-webservice"
			);

			strictEqual(typeof UpdateRouter, "function");
			strictEqual(UpdateRouter.name, "UpdateRouter");
		});
	});

	it("should throw an error if the handler is not provided", async () => {
		await rejects(
			async () => {
				expressApp.use(
					// @ts-expect-error
					(await import("../lib/middlewares/v1/update.js")).default(),
				);
			},
			(/** @type {HandlerNotFoundError} */ err) => {
				strictEqual(err.name, "HandlerNotFoundError");
				return true;
			},
		);
	});

	it("handler should not get called if the authorization header is not compliant with Apple specs", async () => {
		const onUpdateRequestMock = mock.fn(
			/**
			 * @param {string} passTypeIdentifier
			 * @param {string} serialNumber
			 * @param {number} [modifiedSinceTimestamp]
			 * @return {Promise<Uint8Array>}
			 */
			async (passTypeIdentifier, serialNumber, modifiedSinceTimestamp) =>
				new Uint8Array([]),
		);

		expressApp.use(
			(await import("express-passkit-webservice/v1/update.js")).default({
				onUpdateRequest: onUpdateRequestMock,
			}),
		);

		serverInstance = await startExpress(expressApp);
		const response = await fetch(
			`${serverInstance.address}${UPDATE_BASE_PATH}`,
			{
				method: "GET",
				headers: BASE_HEADERS,
			},
		);

		strictEqual(response.status, 401);
		strictEqual(onUpdateRequestMock.mock.callCount(), 0);
	});

	it("handler should get called when provided", async () => {
		const onUpdateRequestMock = mock.fn(
			/**
			 * @param {string} passTypeIdentifier
			 * @param {string} serialNumber
			 * @param {number} [modifiedSinceTimestamp]
			 * @return {Promise<Uint8Array>}
			 */
			async (passTypeIdentifier, serialNumber, modifiedSinceTimestamp) =>
				new Uint8Array([]),
		);

		expressApp.use(
			(await import("express-passkit-webservice/v1/update.js")).default({
				onUpdateRequest: onUpdateRequestMock,
			}),
		);

		serverInstance = await startExpress(expressApp);

		const response = await fetch(
			`${serverInstance.address}${UPDATE_BASE_PATH}`,
			{
				method: "GET",
				headers: {
					...BASE_HEADERS,
					authorization: "ApplePass 0000000000",
				},
			},
		);

		strictEqual(response.status, 200);
		strictEqual(onUpdateRequestMock.mock.callCount(), 1);
	});

	it("handlers should not be called when token validation fails", async () => {
		const onUpdateRequestMock = mock.fn(
			/**
			 * @param {string} passTypeIdentifier
			 * @param {string} serialNumber
			 * @param {number} [modifiedSinceTimestamp]
			 * @return {Promise<Uint8Array>}
			 */
			async (passTypeIdentifier, serialNumber, modifiedSinceTimestamp) =>
				new Uint8Array(),
		);

		expressApp.use(
			(await import("express-passkit-webservice/v1/update.js")).default({
				onUpdateRequest: onUpdateRequestMock,
			}),
		);

		serverInstance = await startExpress(expressApp);
		const response = await fetch(
			`${serverInstance.address}${UPDATE_BASE_PATH}`,
			{
				method: "GET",
				headers: {
					...BASE_HEADERS,
					authorization: "ApplePass 0000000000",
				},
			},
		);

		strictEqual(response.status, 200);
		strictEqual(onUpdateRequestMock.mock.callCount(), 1);
	});

	it("handler should make return http 500 when it does not return an Uint8Array or undefined", async () => {
		const onUpdateRequestMock = mock.fn(
			/**
			 * @param {string} passTypeIdentifier
			 * @param {string} serialNumber
			 * @param {number} [modifiedSinceTimestamp]
			 * @return {Promise<Uint8Array>}
			 */
			// @ts-expect-error
			async (passTypeIdentifier, serialNumber, modifiedSinceTimestamp) => false,
		);

		expressApp.use(
			(await import("express-passkit-webservice/v1/update.js")).default({
				onUpdateRequest: onUpdateRequestMock,
			}),
		);

		serverInstance = await startExpress(expressApp);
		const response = await fetch(
			`${serverInstance.address}${UPDATE_BASE_PATH}`,
			{
				method: "GET",
				headers: {
					...BASE_HEADERS,
					authorization: "ApplePass 0000000000",
				},
			},
		);

		strictEqual(response.status, 500);
		strictEqual(onUpdateRequestMock.mock.callCount(), 1);
		strictEqual(await onUpdateRequestMock.mock.calls[0].result, false);
	});

	it("handlers should receive the arguments of the request path", async () => {
		const onUpdateRequestMock = mock.fn(
			/**
			 * @param {string} passTypeIdentifier
			 * @param {string} serialNumber
			 * @param {number} [modifiedSinceTimestamp]
			 * @return {Promise<Uint8Array>}
			 */
			async (passTypeIdentifier, serialNumber, modifiedSinceTimestamp) =>
				new Uint8Array([]),
		);

		expressApp.use(
			(await import("express-passkit-webservice/v1/update.js")).default({
				onUpdateRequest: onUpdateRequestMock,
			}),
		);

		serverInstance = await startExpress(expressApp);

		const UPDATE_BASE_PATH_WITH_PARAMS = UPDATE_BASE_PATH.replace(
			":passTypeIdentifier",
			"com.my.pass.test",
		).replace(":serialNumber", "763R2B67R76Q");

		const response = await fetch(
			`${serverInstance.address}${UPDATE_BASE_PATH_WITH_PARAMS}`,
			{
				method: "GET",
				headers: {
					...BASE_HEADERS,
					authorization: "ApplePass 0000000000",
				},
			},
		);

		strictEqual(response.status, 200);
		strictEqual(onUpdateRequestMock.mock.callCount(), 1);
		deepStrictEqual(onUpdateRequestMock.mock.calls[0].arguments, [
			"com.my.pass.test",
			"763R2B67R76Q",
			undefined,
		]);
	});
});
