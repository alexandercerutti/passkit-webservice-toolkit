import { Controller, Get, Param, Query, Res, Response } from "@intentjs/core";
import { ListEndpoint } from "passkit-webservice-toolkit/v1/list.js";
import { ListService } from "./service.js";
import { ServiceMethodNotReplacedError } from "../../ServiceMethodNotReplaced.js";

@Controller()
export class ListController {
	constructor(private service: ListService) {
		if (typeof service.onListRetrieve !== "function") {
			throw new ServiceMethodNotReplacedError(
				"onUpdateRequest",
				"update/service",
			);
		}
	}

	@Get(ListEndpoint.path)
	async onListRetrieve<LastUpdatedFormat extends string>(
		@Res() res: Response,
		@Param(ListEndpoint.params[0]) deviceLibraryIdentifier: string,
		@Param(ListEndpoint.params[1]) passTypeIdentifier: string,
		@Query("passesUpdatedSince") passesUpdatedSince: LastUpdatedFormat,
	) {
		const filters: { passesUpdatedSince?: LastUpdatedFormat } = {
			passesUpdatedSince: undefined,
		};

		if (passesUpdatedSince) {
			filters.passesUpdatedSince = passesUpdatedSince;
		}

		const retrieve = await this.service.onListRetrieve<LastUpdatedFormat>(
			deviceLibraryIdentifier,
			passTypeIdentifier,
			filters,
		);

		if (!retrieve) {
			res.status(204).send();
			return;
		}

		if (
			!("serialNumbers" in retrieve) ||
			!Array.isArray(retrieve["serialNumbers"])
		) {
			res
				.status(500)
				.send(
					"'serialNumbers' property is missing in 'onListRetrieve' response or is not an array.",
				);
			return;
		}

		if (!("lastUpdated" in retrieve)) {
			res
				.status(500)
				.send(
					"'lastUpdated' property is missing in 'onListRetrieve' response.",
				);
			return;
		}

		res
			.header("Content-Type", "application/json")
			.status(200)
			.send(JSON.stringify(retrieve));
	}
}
