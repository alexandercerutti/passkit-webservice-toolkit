import Fastify from "fastify";
import { describe, it, beforeEach, afterEach, mock } from "node:test";
import { strictEqual, rejects, deepStrictEqual } from "node:assert";
import { HandlerNotFoundError } from "../lib/HandlerNotFoundError.js";

import { UpdateEndpoint } from "passkit-webservice-toolkit/v1/update.js";
import { startFastify } from "./utils.mjs";

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
	 * @type {import("fastify").FastifyInstance};
	 */
	let fastifyInstance;

	beforeEach(() => {
		fastifyInstance = Fastify();
	});

	afterEach(async () => {
		await fastifyInstance.close();
	});

	describe("import", async () => {
		it("should import plugin from direct import", async () => {
			const { default: directFileImport } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"fastify-passkit-webservice/v1/update.js"
			);

			strictEqual(typeof directFileImport, "function");
			strictEqual(directFileImport.name, "updatePlugin");
		});

		it("should import plugin from v1 entry point", async () => {
			const { updatePlugin } = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"fastify-passkit-webservice/v1"
			);

			strictEqual(typeof updatePlugin, "function");
			strictEqual(updatePlugin.name, "updatePlugin");
		});

		it("should import v1 plugin from global package entry", async () => {
			const {
				v1: { updatePlugin },
			} = await import(
				/** this will give error when package itself is not linked through `pnpm test` */
				"fastify-passkit-webservice"
			);

			strictEqual(typeof updatePlugin, "function");
			strictEqual(updatePlugin.name, "updatePlugin");
		});
	});

	it("should throw an error if the handler is not provided", async () => {
		await rejects(
			async () => {
				// @ts-expect-error
				await fastifyInstance.register(import("../lib/plugins/v1/update.js"));
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

		await fastifyInstance.register(
			import("fastify-passkit-webservice/v1/update.js"),
			{
				onUpdateRequest: onUpdateRequestMock,
			},
		);

		const address = await startFastify(fastifyInstance);
		const response = await fetch(`${address}${UPDATE_BASE_PATH}`, {
			method: "GET",
			headers: BASE_HEADERS,
		});

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

		await fastifyInstance.register(
			import("fastify-passkit-webservice/v1/update.js"),
			{
				onUpdateRequest: onUpdateRequestMock,
			},
		);

		const address = await startFastify(fastifyInstance);

		const response = await fetch(`${address}${UPDATE_BASE_PATH}`, {
			method: "GET",
			headers: {
				...BASE_HEADERS,
				authorization: "ApplePass 0000000000",
			},
		});

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

		await fastifyInstance.register(
			import("fastify-passkit-webservice/v1/update.js"),
			{
				onUpdateRequest: onUpdateRequestMock,
			},
		);

		const address = await startFastify(fastifyInstance);
		const response = await fetch(`${address}${UPDATE_BASE_PATH}`, {
			method: "GET",
			headers: {
				...BASE_HEADERS,
				authorization: "ApplePass 0000000000",
			},
		});

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

		await fastifyInstance.register(
			import("fastify-passkit-webservice/v1/update.js"),
			{
				onUpdateRequest: onUpdateRequestMock,
			},
		);

		const address = await startFastify(fastifyInstance);
		const response = await fetch(`${address}${UPDATE_BASE_PATH}`, {
			method: "GET",
			headers: {
				...BASE_HEADERS,
				authorization: "ApplePass 0000000000",
			},
		});

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

		await fastifyInstance.register(
			import("fastify-passkit-webservice/v1/update.js"),
			{
				onUpdateRequest: onUpdateRequestMock,
			},
		);

		const address = await startFastify(fastifyInstance);

		const UPDATE_BASE_PATH_WITH_PARAMS = UPDATE_BASE_PATH.replace(
			":passTypeIdentifier",
			"com.my.pass.test",
		).replace(":serialNumber", "763R2B67R76Q");

		const response = await fetch(`${address}${UPDATE_BASE_PATH_WITH_PARAMS}`, {
			method: "GET",
			headers: {
				...BASE_HEADERS,
				authorization: "ApplePass 0000000000",
			},
		});

		strictEqual(response.status, 200);
		strictEqual(onUpdateRequestMock.mock.callCount(), 1);
		deepStrictEqual(onUpdateRequestMock.mock.calls[0].arguments, [
			"com.my.pass.test",
			"763R2B67R76Q",
			undefined,
		]);
	});
});
