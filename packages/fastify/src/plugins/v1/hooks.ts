import type {
	FastifyPluginCallback,
	FastifyReply,
	FastifyRequest,
	onSendHookHandler,
	preHandlerAsyncHookHandler,
} from "fastify";
import {
	isAuthorizationSchemeValid,
	getAuthorizationToken,
} from "passkit-webservice-toolkit/v1/utils/auth.js";

export function checkAuthorizationSchemeValidationHook(
	request: FastifyRequest,
	reply: FastifyReply,
	done: Parameters<FastifyPluginCallback>[2],
): void {
	const { authorization = "" } = request.headers;

	if (!isAuthorizationSchemeValid(authorization)) {
		request.log.info({ authorization }, "Apple Schema validation failed");
		reply.code(401).send();
		return;
	}

	done();
}

export function createTokenVerifierHook(
	verifyToken: (token: string) => PromiseLike<boolean>,
): preHandlerAsyncHookHandler {
	return async function verifyTokenValidityHook(
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const { authorization = "" } = request.headers;

		const token = getAuthorizationToken(authorization);

		if (!(await verifyToken(token))) {
			request.log.info("Token validation failed.");
			reply.code(401).send();
			return;
		}
	};
}

export function createResponsePayloadValidityCheckerHook(
	expectedType: string,
	predicate: (payload: unknown, code: number) => boolean,
): onSendHookHandler<unknown> {
	return async function payloadValidityCheckerHook<Payload>(
		_: FastifyRequest,
		reply: FastifyReply,
		payload: Payload,
	) {
		const result = predicate(payload, reply.statusCode);

		if (!result) {
			throw new Error(
				`Unexpected outcoming payload type. Expected a '${expectedType}' but returning ${result}`,
			);
		}

		return payload;
	};
}
