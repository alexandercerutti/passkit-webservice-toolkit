import type {
	FastifyInstance,
	FastifyPluginAsync,
	FastifySchema,
	onSendAsyncHookHandler,
	onSendHookHandler,
} from "fastify";
import {
	ListEndpoint,
	type ListParams,
	type SerialNumbers,
} from "passkit-webservice-toolkit/v1/list.js";
import { HandlerNotFoundError } from "../../HandlerNotFoundError.js";
import { createResponsePayloadValidityCheckerHook } from "./hooks.js";
import { Buffer } from "node:buffer";
import { Stream } from "node:stream";

/**
 * @see https://developer.apple.com/documentation/walletpasses/get_the_list_of_updatable_passes
 */

interface ListPluginOptions<LastUpdatedFormat> {
	onListRetrieve(
		deviceLibraryIdentifier: string,
		passTypeIdentifier: string,
		filters: { passesUpdatedSince?: LastUpdatedFormat },
	): PromiseLike<SerialNumbers | undefined>;
}

const schema: FastifySchema = {
	params: {
		type: "object",
		properties: {
			deviceLibraryIdentifier: { type: "string" },
			passTypeIdentifier: { type: "string" },
		},
	},
	querystring: {
		type: "object",
		properties: {
			passesUpdatedSince: {
				type: "string",
			},
		},
	},
	response: {
		200: {
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							serialNumbers: {
								type: "array",
								items: { type: "string" },
							},
							lastUpdated: { type: "string" },
						},
					},
				},
			},
		},
		204: {},
	},
};

async function listPlugin<LastUpdatedFormat = unknown>(
	fastify: FastifyInstance,
	opts: ListPluginOptions<LastUpdatedFormat>,
) {
	if (typeof opts.onListRetrieve !== "function") {
		throw new HandlerNotFoundError("onListRetrieve", "ListPlugin");
	}

	const onSendHooks: (onSendAsyncHookHandler | onSendHookHandler)[] = [
		createResponsePayloadValidityCheckerHook(
			"{ serialNumbers: string[], lastUpdated: string; }",
			(payload: unknown, statusCode: number) => {
				if (statusCode === 204) {
					return true;
				}

				if (Buffer.isBuffer(payload) || payload instanceof Stream.Stream) {
					return false;
				}

				const payloadObj = JSON.parse(payload as string);
				return "serialNumbers" in payloadObj;
			},
		),
	];

	fastify.get<{
		Params: Record<ListParams[number], string>;
		Querystring: {
			passesUpdatedSince?: LastUpdatedFormat;
		};
	}>(ListEndpoint.path, {
		prefixTrailingSlash: "no-slash",
		schema,
		onSend: onSendHooks,
		async handler(request, reply) {
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
				reply.code(204).send();
				return;
			}

			reply.header("Content-Type", "application/json");

			return reply.code(200).send(JSON.stringify(retrieve));
		},
	});
}

export default listPlugin satisfies FastifyPluginAsync<
	ListPluginOptions<unknown>
>;
