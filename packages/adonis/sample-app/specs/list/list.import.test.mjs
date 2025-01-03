import { test } from "@japa/runner";

test("should import plugin from direct import", async ({ assert }) => {
	const { default: directFileImport } = await import(
		/** this will give error when package itself is not linked through `pnpm test` */
		"adonis-passkit-webservice/v1/list.js"
	);

	assert.strictEqual(typeof directFileImport, "function");
	assert.strictEqual(directFileImport.name, "ListRouter");
});

test("should import plugin from v1 entry point", async ({ assert }) => {
	const { ListRouter } = await import(
		/** this will give error when package itself is not linked through `pnpm test` */
		"adonis-passkit-webservice/v1"
	);

	assert.strictEqual(typeof ListRouter, "function");
	assert.strictEqual(ListRouter.name, "ListRouter");
});

test("should import v1 plugin from global package entry", async ({
	assert,
}) => {
	const {
		v1: { ListRouter },
	} = await import(
		/** this will give error when package itself is not linked through `pnpm test` */
		"adonis-passkit-webservice"
	);

	assert.strictEqual(typeof ListRouter, "function");
	assert.strictEqual(ListRouter.name, "ListRouter");
});
