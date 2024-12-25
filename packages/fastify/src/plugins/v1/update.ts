import type {
	FastifyInstance,
	FastifyPluginAsync,
	FastifySchema,
	onSendAsyncHookHandler,
	onSendHookHandler,
	preHandlerAsyncHookHandler,
	preHandlerHookHandler,
} from "fastify";
import {
	UpdateEndpoint,
	type UpdateParams,
} from "passkit-webservice-toolkit/v1/update.js";
import {
	checkAuthorizationSchemeValidationHook,
	createResponsePayloadValidityCheckerHook,
	createTokenVerifierHook,
} from "./hooks.js";
import { HandlerNotFoundError } from "../../HandlerNotFoundError.js";

/**
 * @see https://developer.apple.com/documentation/walletpasses/send_an_updated_pass
 */

interface UpdatePluginOptions {
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

const schema: FastifySchema = {
	headers: {
		type: "object",
		properties: {
			authorization: { type: "string" },
		},
	},
	params: {
		type: "object",
		properties: {
			passTypeIdentifier: { type: "string" },
			serialNumber: { type: "string" },
		},
	},
	response: {
		200: {
			content: {
				"application/vnd.apple.pkpass": {
					schema: {},
				},
			},
		},
	},
};

async function updatePlugin(
	fastify: FastifyInstance,
	opts: UpdatePluginOptions,
) {
	if (typeof opts.onUpdateRequest !== "function") {
		throw new HandlerNotFoundError("onUpdateRequest", "UpdatePlugin");
	}

	const preHandlerHooks: (
		| preHandlerAsyncHookHandler
		| preHandlerHookHandler
	)[] = [];

	if (typeof opts.tokenVerifier === "function") {
		preHandlerHooks.push(createTokenVerifierHook(opts.tokenVerifier));
	}

	const onSendHooks: (onSendAsyncHookHandler | onSendHookHandler)[] = [
		createResponsePayloadValidityCheckerHook(
			"Uint8Array",
			(payload: unknown) =>
				payload === undefined || payload instanceof Uint8Array,
		),
	];

	fastify.get<{
		Params: Record<UpdateParams[number], string>;
	}>(UpdateEndpoint.path, {
		prefixTrailingSlash: "no-slash",
		schema,
		preValidation: [checkAuthorizationSchemeValidationHook],
		preHandler: preHandlerHooks,
		onSend: onSendHooks,
		async handler(request, reply) {
			const { passTypeIdentifier, serialNumber } = request.params;

			const modifiedSinceTimestamp = request.headers["if-modified-since"]
				? new Date(request.headers["if-modified-since"]).getTime()
				: undefined;

			const response = await opts.onUpdateRequest(
				passTypeIdentifier,
				serialNumber,
				modifiedSinceTimestamp,
			);

			if (response === undefined) {
				/**
				 * @see https://developer.apple.com/library/archive/documentation/PassKit/Reference/PassKit_WebService/WebService.html#//apple_ref/doc/uid/TP40011988-CH0-SW6
				 */
				return reply.code(304).send();
			}

			reply.header("Content-Type", "application/vnd.apple.pkpass");
			reply.header("last-modified", new Date().toUTCString());
			return reply.code(200).send(response);
		},
	});
}

export default updatePlugin satisfies FastifyPluginAsync<UpdatePluginOptions>;
