import { test, configure } from "@japa/runner";
import { spy } from "sinon";
import { ListEndpoint } from "passkit-webservice-toolkit/v1/list.js";
import router from "@adonisjs/core/services/router";
import app from "@adonisjs/core/services/app";

const BASE_HEADERS = {
	Accept: "application/json",
	"Content-Type": "application/json",
};

const LIST_BASE_PATH = ListEndpoint.path;

test("handler should get called when provided", async ({
	assert,
	client,
	cleanup,
}) => {
	cleanup(() => {
		router.routes.length = 0;
	});

	const onListRetrieveMock = spy(
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

	// app.booting(async () => {
	// });

	// app.ready(async () => {
	// console.log("ROUTER GROUP ADDED", router.routes[0].routes[0].toJSON());
	// console.log("PERFORMING REQUEST");
	router.group(
		(await import("adonis-passkit-webservice/v1/list.js")).default({
			onListRetrieve: onListRetrieveMock,
		}),
	);

	debugger;

	const response = await client
		.get(LIST_BASE_PATH)
		.headers(BASE_HEADERS)
		.trustLocalhost();

	response.assertStatus(200);
	assert.strictEqual(onListRetrieveMock.getCalls().length, 1);
	// });
});

test("handler should make return http 204 when it returns null or undefined", async ({
	assert,
	client,
	cleanup,
}) => {
	cleanup(() => {
		router.routes.length = 0;
	});

	const onListRetrieveMock = spy(
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

	router.group(
		(await import("adonis-passkit-webservice/v1/list.js")).default({
			onListRetrieve: onListRetrieveMock,
		}),
	);

	// router.commit();

	const response = await client.get(LIST_BASE_PATH).headers(BASE_HEADERS);

	response.assertStatus(204);

	assert.strictEqual(response.status, 204);
	assert.strictEqual(onListRetrieveMock.getCalls(), 1);
	assert.strictEqual(await onListRetrieveMock.firstCall.returnValue, null);
});

test("handlers should receive the arguments of the request path", async ({
	assert,
	client,
	cleanup,
}) => {
	cleanup(() => {
		router.routes.length = 0;
	});

	const onListRetrieveMock = spy(
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

	router.group(
		(await import("adonis-passkit-webservice/v1/list.js")).default({
			onListRetrieve: onListRetrieveMock,
		}),
	);

	router.commit();

	const LIST_BASE_PATH_WITH_PARAMS = LIST_BASE_PATH.replace(
		":deviceLibraryIdentifier",
		"hkweagjdyjukhiljsadck",
	).replace(":passTypeIdentifier", "com.my.pass.test");

	const response = await client
		.get(`${LIST_BASE_PATH_WITH_PARAMS}?passesUpdatedSince=09128365712`)
		.headers(BASE_HEADERS);

	response.assertStatus(200);

	assert.strictEqual(onListRetrieveMock.getCalls().length, 1);
	assert.deepEqual(onListRetrieveMock.firstCall.args, [
		"hkweagjdyjukhiljsadck",
		"com.my.pass.test",
		{
			passesUpdatedSince: "09128365712",
		},
	]);
});
