import { json, Router } from "express";
import {
	ListEndpoint,
	type SerialNumbers,
} from "passkit-webservice-toolkit/v1/list.js";
import { HandlerNotFoundError } from "../../HandlerNotFoundError.js";
import type { RouteParameters } from "express-serve-static-core";

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
): Router {
	if (typeof opts?.onListRetrieve !== "function") {
		throw new HandlerNotFoundError("onListRetrieve", "ListPlugin");
	}

	const router = Router({ caseSensitive: true });
	router.use(json());

	type Route = typeof ListEndpoint.path;
	type Params = RouteParameters<Route>;
	type ResBody = any;
	type ReqBody = any;
	type ReqQuery = {
		passesUpdatedSince: LastUpdatedFormat;
	};

	router.get<Route, Params, ResBody, ReqBody, ReqQuery>(
		ListEndpoint.path,
		async (request, response) => {
			const { deviceLibraryIdentifier, passTypeIdentifier } = request.params;
			const filters: { passesUpdatedSince?: LastUpdatedFormat } = {
				passesUpdatedSince: undefined,
			};

			if (request.query.passesUpdatedSince) {
				filters.passesUpdatedSince = request.query.passesUpdatedSince;
			}

			const retrieve = await opts.onListRetrieve(
				deviceLibraryIdentifier,
				passTypeIdentifier,
				filters,
			);

			if (!retrieve) {
				response.status(204).send();
				return;
			}

			if (
				!("serialNumbers" in retrieve) ||
				!Array.isArray(retrieve["serialNumbers"])
			) {
				response
					.status(500)
					.send(
						"'serialNumbers' property is missing in 'onListRetrieve' response or is not an array.",
					);
				return;
			}

			if (!("lastUpdated" in retrieve)) {
				response
					.status(500)
					.send(
						"'lastUpdated' property is missing in 'onListRetrieve' response.",
					);
				return;
			}

			response
				.header("Content-Type", "application/json")
				.status(200)
				.send(JSON.stringify(retrieve));
		},
	);

	return router;
}
