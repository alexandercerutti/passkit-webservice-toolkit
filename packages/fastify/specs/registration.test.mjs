import Fastify from "fastify";
import { describe, it, beforeEach, afterEach, mock } from "node:test";
import { strictEqual, rejects, deepStrictEqual } from "node:assert";
import { HandlerNotFoundError } from "../lib/HandlerNotFoundError.js";
import { startFastify } from "./utils.mjs";
import { RegisterEndpoint } from "passkit-webservice-toolkit/v1/register.js";
import { UnregisterEndpoint } from "passkit-webservice-toolkit/v1/unregister.js";

/**
 * @type {HeadersInit}
 */

const BASE_HEADERS = {
	Accept: "application/json",
	"Content-Type": "application/json",
};

const REGISTER_BASE_PATH = RegisterEndpoint.path;
const UNREGISTER_BASE_PATH = UnregisterEndpoint.path;

describe("registration service", () => {
	/**
	 * @type {import("fastify").FastifyInstance}
	 */
	let fastifyInstance;

	beforeEach(async () => {
		fastifyInstance = Fastify({ logger: false });
	});

	afterEach(async () => {
		await fastifyInstance.close();
	});

	describe("import", async () => {
		it("should import plugin from direct import", async () => {
			const { default: directFileImport } = await import(
				"fastify-passkit-webservice/v1/registration.js"
			);

			strictEqual(typeof directFileImport, "function");
			strictEqual(directFileImport.name, "registrationPlugin");
		});

		it("should import plugin from v1 entry point", async () => {
			const { registrationPlugin } = await import(
				"fastify-passkit-webservice/v1"
			);

			strictEqual(typeof registrationPlugin, "function");
			strictEqual(registrationPlugin.name, "registrationPlugin");
		});

		it("should import v1 plugin from global package entry", async () => {
			const {
				v1: { registrationPlugin },
			} = await import("fastify-passkit-webservice");

			strictEqual(typeof registrationPlugin, "function");
			strictEqual(registrationPlugin.name, "registrationPlugin");
		});
	});

	it("should throw an error if handlers are not provided", async () => {
		await rejects(
			async () => {
				await fastifyInstance.register(
					// @ts-expect-error
					import("../lib/plugins/v1/registration.js"),
				);
			},
			(/** @type {HandlerNotFoundError} */ err) => {
				strictEqual(err.name, "HandlerNotFoundError");
				return true;
			},
		);
	});

	it("handler should not get called if the authorization header is not compliant with Apple specs", async () => {
		const onRegisterMock = mock.fn(
			/**
			 * @param {string} deviceLibraryIdentifier
			 * @param {string} passTypeIdentifier
			 * @param {string} serialNumber
			 * @return {Promise<boolean>}
			 */
			async (deviceLibraryIdentifier, passTypeIdentifier, serialNumber) => true,
		);
		const onUnregisterMock = mock.fn(
			/**
			 * @param {string} deviceLibraryIdentifier
			 * @param {string} passTypeIdentifier
			 * @param {string} serialNumber
			 * @return {Promise<void>}
			 */
			async (deviceLibraryIdentifier, passTypeIdentifier, serialNumber) => {},
		);

		await fastifyInstance.register(
			import("fastify-passkit-webservice/v1/registration.js"),
			{
				onRegister: onRegisterMock,
				onUnregister: onUnregisterMock,
			},
		);

		const address = await startFastify(fastifyInstance);

		const response = await Promise.all([
			fetch(`${address}${REGISTER_BASE_PATH}`, {
				method: "POST",
				/**
				 * `authorization` header missing on purpose
				 */
				headers: BASE_HEADERS,
				body: JSON.stringify({
					pushToken: "000000000",
				}),
			}),
			fetch(`${address}${UNREGISTER_BASE_PATH}`, {
				method: "DELETE",
				/**
				 * `authorization` header missing on purpose
				 */
			}),
		]);

		strictEqual(response[0].status, 401);
		strictEqual(onRegisterMock.mock.callCount(), 0);
		strictEqual(response[1].status, 401);
		strictEqual(onUnregisterMock.mock.callCount(), 0);
	});

	it("handler should get called when provided", async () => {
		const onRegisterMock = mock.fn(
			/**
			 * @param {string} deviceLibraryIdentifier
			 * @param {string} passTypeIdentifier
			 * @param {string} serialNumber
			 * @return {Promise<boolean>}
			 */
			async (deviceLibraryIdentifier, passTypeIdentifier, serialNumber) => true,
		);
		const onUnregisterMock = mock.fn(
			/**
			 * @param {string} deviceLibraryIdentifier
			 * @param {string} passTypeIdentifier
			 * @param {string} serialNumber
			 * @return {Promise<void>}
			 */
			async (deviceLibraryIdentifier, passTypeIdentifier, serialNumber) => {},
		);

		await fastifyInstance.register(
			import("fastify-passkit-webservice/v1/registration.js"),
			{
				onRegister: onRegisterMock,
				onUnregister: onUnregisterMock,
			},
		);

		const address = await startFastify(fastifyInstance);

		const response = await fetch(`${address}${REGISTER_BASE_PATH}`, {
			method: "POST",
			headers: {
				...BASE_HEADERS,
				authorization: "ApplePass 0000000000",
			},
			body: JSON.stringify({
				pushToken: "000000000",
			}),
		});

		strictEqual(response.status, 201);
		strictEqual(onRegisterMock.mock.callCount(), 1);
	});

	it("register handler returning false, should make return HTTP 200", async () => {
		const onRegisterMock = mock.fn(
			/**
			 * @param {string} deviceLibraryIdentifier
			 * @param {string} passTypeIdentifier
			 * @param {string} serialNumber
			 * @return {Promise<boolean>}
			 */
			async (deviceLibraryIdentifier, passTypeIdentifier, serialNumber) => true,
		);
		const onUnregisterMock = mock.fn(
			/**
			 * @param {string} deviceLibraryIdentifier
			 * @param {string} passTypeIdentifier
			 * @param {string} serialNumber
			 * @return {Promise<void>}
			 */
			async (deviceLibraryIdentifier, passTypeIdentifier, serialNumber) => {},
		);

		await fastifyInstance.register(
			import("fastify-passkit-webservice/v1/registration.js"),
			{
				onRegister: onRegisterMock,
				onUnregister: onUnregisterMock,
			},
		);

		const address = await startFastify(fastifyInstance);

		const response = await fetch(`${address}${REGISTER_BASE_PATH}`, {
			method: "POST",
			headers: {
				...BASE_HEADERS,
				authorization: "ApplePass 0000000000",
			},
			body: JSON.stringify({
				pushToken: "000000000",
			}),
		});

		strictEqual(response.status, 201);
		strictEqual(onRegisterMock.mock.callCount(), 1);
	});

	it("handlers should not be called when token validation fails", async () => {
		const onRegisterMock = mock.fn(
			/**
			 * @param {string} deviceLibraryIdentifier
			 * @param {string} passTypeIdentifier
			 * @param {string} serialNumber
			 * @return {Promise<boolean>}
			 */
			async (deviceLibraryIdentifier, passTypeIdentifier, serialNumber) =>
				false,
		);
		const onUnregisterMock = mock.fn(
			/**
			 * @param {string} deviceLibraryIdentifier
			 * @param {string} passTypeIdentifier
			 * @param {string} serialNumber
			 * @return {Promise<void>}
			 */
			async (deviceLibraryIdentifier, passTypeIdentifier, serialNumber) => {},
		);

		await fastifyInstance.register(
			import("fastify-passkit-webservice/v1/registration.js"),
			{
				onRegister: onRegisterMock,
				onUnregister: onUnregisterMock,
			},
		);

		const address = await startFastify(fastifyInstance);
		const response = await Promise.all([
			fetch(`${address}${REGISTER_BASE_PATH}`, {
				method: "POST",
				headers: {
					...BASE_HEADERS,
					authorization: "ApplePass 0000000000",
				},
				body: JSON.stringify({
					pushToken: "000000000",
				}),
			}),
			fetch(`${address}${UNREGISTER_BASE_PATH}`, {
				method: "DELETE",
				headers: {
					authorization: "ApplePass 0000000000",
				},
			}),
		]);

		strictEqual(response[0].status, 200);
		strictEqual(onRegisterMock.mock.callCount(), 1);
		strictEqual(response[1].status, 200);
		strictEqual(onUnregisterMock.mock.callCount(), 1);
	});

	it("handlers should receive the arguments of the request path", async () => {
		const onRegisterMock = mock.fn(
			/**
			 * @param {string} deviceLibraryIdentifier
			 * @param {string} passTypeIdentifier
			 * @param {string} serialNumber
			 * @return {Promise<boolean>}
			 */
			async (deviceLibraryIdentifier, passTypeIdentifier, serialNumber) => true,
		);
		const onUnregisterMock = mock.fn(
			/**
			 * @param {string} deviceLibraryIdentifier
			 * @param {string} passTypeIdentifier
			 * @param {string} serialNumber
			 * @return {Promise<void>}
			 */
			async (deviceLibraryIdentifier, passTypeIdentifier, serialNumber) => {},
		);

		await fastifyInstance.register(
			import("fastify-passkit-webservice/v1/registration.js"),
			{
				onRegister: onRegisterMock,
				onUnregister: onUnregisterMock,
			},
		);

		const address = await startFastify(fastifyInstance);

		const REGISTER_BASE_PATH_WITH_PARAMS = REGISTER_BASE_PATH.replace(
			":deviceLibraryIdentifier",
			"hkweagjdyjukhiljsadck",
		)
			.replace(":passTypeIdentifier", "com.my.pass.test")
			.replace(":serialNumber", "763R2B67R76Q");

		const UNREGISTER_BASE_PATH_WITH_PARAMS = UNREGISTER_BASE_PATH.replace(
			":deviceLibraryIdentifier",
			"hkweagjdyjukhiljsadck",
		)
			.replace(":passTypeIdentifier", "com.my.pass.test")
			.replace(":serialNumber", "763R2B67R76Q");

		const response = await Promise.all([
			fetch(`${address}${REGISTER_BASE_PATH_WITH_PARAMS}`, {
				method: "POST",
				headers: {
					...BASE_HEADERS,
					authorization: "ApplePass 0000000000",
				},
				body: JSON.stringify({
					pushToken: "000000000",
				}),
			}),
			fetch(`${address}${UNREGISTER_BASE_PATH_WITH_PARAMS}`, {
				method: "DELETE",
				headers: {
					authorization: "ApplePass 0000000000",
				},
			}),
		]);

		strictEqual(response[0].status, 201);
		strictEqual(onRegisterMock.mock.callCount(), 1);
		deepStrictEqual(onRegisterMock.mock.calls[0].arguments, [
			"hkweagjdyjukhiljsadck",
			"com.my.pass.test",
			"763R2B67R76Q",
			"000000000",
		]);

		strictEqual(response[1].status, 200);
		strictEqual(onUnregisterMock.mock.callCount(), 1);
		deepStrictEqual(onUnregisterMock.mock.calls[0].arguments, [
			"hkweagjdyjukhiljsadck",
			"com.my.pass.test",
			"763R2B67R76Q",
		]);
	});
});
