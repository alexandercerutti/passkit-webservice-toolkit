import router from "@adonisjs/core/services/router";
import { ListEndpoint } from "passkit-webservice-toolkit/v1/list.js";
import type {
	ListParams,
	SerialNumbers,
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
): () => void {
	if (typeof opts?.onListRetrieve !== "function") {
		throw new HandlerNotFoundError("onListRetrieve", "ListPlugin");
	}

	type RequestQuery = {
		passesUpdatedSince: LastUpdatedFormat;
	};

	return () => {
		router.get(ListEndpoint.path, async ({ request, response, params }) => {
			const { deviceLibraryIdentifier, passTypeIdentifier } = params as Record<
				ListParams[number],
				string
			>;
			const filters: { passesUpdatedSince?: LastUpdatedFormat } = {
				passesUpdatedSince: undefined,
			};

			const queryString = request.qs() as RequestQuery;

			if (queryString.passesUpdatedSince) {
				filters.passesUpdatedSince = queryString.passesUpdatedSince;
			}

			const retrieve = await opts.onListRetrieve(
				deviceLibraryIdentifier,
				passTypeIdentifier,
				filters,
			);

			if (!retrieve) {
				response.status(204).send({});
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
		});
	};
}
