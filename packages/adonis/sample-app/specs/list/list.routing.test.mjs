import router from "@adonisjs/core/services/router";
import { test } from "@japa/runner";

test("should throw an error if the handler is not provided", async ({
	assert,
	cleanup,
}) => {
	cleanup(() => {
		router.routes.length = 0;
	});

	assert.rejects(async () => {
		router.group(
			// @ts-expect-error
			(await import("../lib/middlewares/v1/list.js")).default(),
		);
	});
});
