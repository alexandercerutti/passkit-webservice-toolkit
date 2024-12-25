import { Hono } from "hono";
import { UpdateEndpoint } from "passkit-webservice-toolkit/v1/update.js";
import { HandlerNotFoundError } from "../../HandlerNotFoundError.js";
import { assertAuthorizationSchemeValid, assertTokenValid } from "./hooks.js";

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

export default function UpdateRouter(opts: UpdateRouterOptions): Hono {
	if (typeof opts?.onUpdateRequest !== "function") {
		throw new HandlerNotFoundError("onUpdateRequest", "UpdateRouter");
	}

	const router = new Hono();

	router.get(
		UpdateEndpoint.path,
		assertAuthorizationSchemeValid,
		assertTokenValid(opts.tokenVerifier),
		async (context) => {
			const { passTypeIdentifier, serialNumber } = context.req.param();

			const ifModifiedSinceHeader = context.req.header("if-modified-since");

			const modifiedSinceTimestamp = ifModifiedSinceHeader
				? new Date(ifModifiedSinceHeader).getTime()
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

				context.status(304);
				return context.body(null);
			}

			if (!(updateResponse instanceof Uint8Array)) {
				context.status(500);
				return context.json({
					message:
						"Response from 'onUpdateRequest' is neither undefined or a Uint8Array.",
				});
			}

			context.header("Content-Type", "application/vnd.apple.pkpass");
			context.header("last-modified", new Date().toUTCString());
			context.status(200);
			return context.body(updateResponse);
		},
	);

	return router;
}
