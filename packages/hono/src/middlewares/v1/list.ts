import { Hono } from "hono";
import {
	ListEndpoint,
	type SerialNumbers,
} from "passkit-webservice-toolkit/v1/list.js";
import { HandlerNotFoundError } from "../../HandlerNotFoundError.js";

/**
 * @see https://developer.apple.com/documentation/walletpasses/get_the_list_of_updatable_passes
 */

interface ListRouterOptions<LastUpdatedFormat> {
	onListRetrieve(
		deviceLibraryIdentifier: string,
		passTypeIdentifier: string,
		filters: { passesUpdatedSince?: LastUpdatedFormat },
	): PromiseLike<SerialNumbers | undefined>;
}

export default function ListRouter<LastUpdatedFormat = string>(
	opts: ListRouterOptions<LastUpdatedFormat>,
): Hono {
	if (typeof opts?.onListRetrieve !== "function") {
		throw new HandlerNotFoundError("onListRetrieve", "ListRouter");
	}

	const router = new Hono();

	router.get(ListEndpoint.path, async (context) => {
		const { deviceLibraryIdentifier, passTypeIdentifier } = context.req.param();
		const filters: { passesUpdatedSince?: LastUpdatedFormat | undefined } = {
			passesUpdatedSince:
				(context.req.query().passesUpdatedSince as LastUpdatedFormat) ||
				undefined,
		};

		const retrieve = await opts.onListRetrieve(
			deviceLibraryIdentifier,
			passTypeIdentifier,
			filters,
		);

		if (!retrieve) {
			context.status(204);
			return context.body(null);
		}

		if (
			!("serialNumbers" in retrieve) ||
			!Array.isArray(retrieve["serialNumbers"])
		) {
			context.status(500);
			return context.json({
				message:
					"'serialNumbers' property is missing in 'onListRetrieve' response or is not an array.",
			});
		}

		if (!("lastUpdated" in retrieve)) {
			context.status(500);
			return context.json({
				message:
					"'lastUpdated' property is missing in 'onListRetrieve' response.",
			});
		}

		context.header("Content-Type", "application/json");
		context.status(200);
		return context.json(retrieve);
	});

	return router;
}
