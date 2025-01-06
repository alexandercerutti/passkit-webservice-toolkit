import { Controller, Get, Header, Param, Res, Response } from "@intentjs/core";
import { UpdateEndpoint } from "passkit-webservice-toolkit/v1/update.js";
import { UpdateService } from "./service.js";
import { getAuthorizationToken } from "passkit-webservice-toolkit/v1/utils/auth.js";
import { ServiceMethodNotReplacedError } from "../../ServiceMethodNotReplaced.js";

@Controller()
export class UpdateController {
	constructor(private service: UpdateService) {
		if (typeof service.onUpdateRequest !== "function") {
			throw new ServiceMethodNotReplacedError(
				"onUpdateRequest",
				"update/service",
			);
		}
	}

	private async verifyToken(
		authorizationString: string = "",
	): Promise<boolean> {
		if (typeof this.service.tokenVerifier !== "function") {
			return true;
		}

		return this.service.tokenVerifier(
			getAuthorizationToken(authorizationString),
		);
	}

	@Get(UpdateEndpoint.path)
	async onUpdate(
		@Res() res: Response,
		@Header("authorization") authorization: string,
		@Header("if-modified-since") modifiedSinceDate: string,
		@Param(UpdateEndpoint.params[0]) passTypeIdentifier: string,
		@Param(UpdateEndpoint.params[1]) serialNumber: string,
	) {
		if (!this.verifyToken(authorization)) {
			res.status(401).send();
			return;
		}

		const modifiedSinceTimestamp = modifiedSinceDate
			? new Date(modifiedSinceDate).getTime()
			: undefined;

		const updateResponse = await this.service.onUpdateRequest(
			passTypeIdentifier,
			serialNumber,
			modifiedSinceTimestamp,
		);

		if (typeof updateResponse === "undefined") {
			/**
			 * @see https://developer.apple.com/library/archive/documentation/PassKit/Reference/PassKit_WebService/WebService.html#//apple_ref/doc/uid/TP40011988-CH0-SW6
			 * @see https://web.archive.org/web/20221113111320/https://developer.apple.com/library/archive/documentation/PassKit/Reference/PassKit_WebService/WebService.html#//apple_ref/doc/uid/TP40011988
			 */

			res.status(304).send();
			return;
		}

		if (!(updateResponse instanceof Uint8Array)) {
			res
				.status(500)
				.send(
					"Response from 'onUpdateRequest' is neither undefined or a Uint8Array.",
				);
			return;
		}

		res
			.header("Content-Type", "application/vnd.apple.pkpass")
			.header("last-modified", new Date().toUTCString())
			.status(200)
			.send(updateResponse);
	}
}
