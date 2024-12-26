import router from "@adonisjs/core/services/router";
import { UpdateEndpoint } from "passkit-webservice-toolkit/v1/update.js";
import type { UpdateParams } from "passkit-webservice-toolkit/v1/update.js";
import { HandlerNotFoundError } from "../../HandlerNotFoundError.js";
import {
	assertAuthorizationSchemeValidMiddleware,
	assertTokenValidMiddleware,
} from "./hooks.js";

/**
 * @see https://developer.apple.com/documentation/walletpasses/send_an_updated_pass
 */

interface UpdateRouterOptions {
	tokenVerifier?(token: string): PromiseLike<boolean>;

	/**
	 * @param passTypeIdentifier
	 * @param serialNumber
	 * @param {number} [modifiedSinceTimestamp] A timestamp that is provided by Apple,
	 * 		based on the the time the last successful (HTTP 200) update was provided
	 *
	 * @returns {Uint8Array | undefined} If _falsy_ is returned, the request will
	 * 		be replied with HTTP 304 Not Modified.
	 */

	onUpdateRequest(
		passTypeIdentifier: string,
		serialNumber: string,
		modifiedSinceTimestamp?: number | undefined,
	): PromiseLike<Uint8Array | undefined>;
}

export default function UpdateRouter(opts: UpdateRouterOptions): () => void {
	if (typeof opts?.onUpdateRequest !== "function") {
		throw new HandlerNotFoundError("onUpdateRequest", "UpdatePlugin");
	}

	return () => {
		router
			.get(UpdateEndpoint.path, async (context) => {
				const { passTypeIdentifier, serialNumber } = context.params as Record<
					UpdateParams[number],
					string
				>;

				const modifiedSinceHeader = context.request.header("if-modified-since");

				const modifiedSinceTimestamp = modifiedSinceHeader
					? new Date(modifiedSinceHeader).getTime()
					: undefined;

				const updateResponse = await opts.onUpdateRequest(
					passTypeIdentifier,
					serialNumber,
					modifiedSinceTimestamp,
				);

				if (typeof updateResponse === "undefined") {
					/**
					 * @see https://developer.apple.com/library/archive/documentation/PassKit/Reference/PassKit_WebService/WebService.html#//apple_ref/doc/uid/TP40011988-CH0-SW6
					 * @see https://web.archive.org/web/20221113111320/https://developer.apple.com/library/archive/documentation/PassKit/Reference/PassKit_WebService/WebService.html#//apple_ref/doc/uid/TP40011988
					 */

					context.response.status(304).send({});
					return;
				}

				if (!(updateResponse instanceof Uint8Array)) {
					context.response
						.status(500)
						.send(
							"Response from 'onUpdateRequest' is neither undefined or a Uint8Array.",
						);
					return;
				}

				context.response
					.header("Content-Type", "application/vnd.apple.pkpass")
					.header("last-modified", new Date().toUTCString())
					.status(200)
					.send(updateResponse);
			})
			.use([
				assertAuthorizationSchemeValidMiddleware,
				assertTokenValidMiddleware(opts.tokenVerifier),
			]);
	};
}
