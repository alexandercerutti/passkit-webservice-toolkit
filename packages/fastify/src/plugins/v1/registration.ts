import type {
	FastifyInstance,
	FastifyPluginAsync,
	FastifySchema,
	preHandlerAsyncHookHandler,
	preHandlerHookHandler,
} from "fastify";
import {
	RegisterEndpoint,
	type PushToken,
	type RegisterParams,
} from "passkit-webservice-toolkit/v1/register.js";
import {
	UnregisterEndpoint,
	type UnregisterParams,
} from "passkit-webservice-toolkit/v1/unregister.js";
import {
	checkAuthorizationSchemeValidationHook,
	createTokenVerifierHook,
} from "./hooks.js";
import { HandlerNotFoundError } from "../../HandlerNotFoundError.js";

interface RegistrationPluginOptions {
	tokenVerifier?(token: string): PromiseLike<boolean>;
	/**
	 * Return `true` if the registration has been successful (HTTP 201)
	 * Otherwise `false` to tell Apple the SN has been already registered
	 * for the device (HTTP 200).
	 *
	 * @see https://developer.apple.com/documentation/walletpasses/register_a_pass_for_update_notifications
	 */
	onRegister(
		deviceLibraryIdentifier: string,
		passTypeIdentifier: string,
		serialNumber: string,
		pushToken: string,
	): PromiseLike<boolean>;

	/**
	 * @see https://developer.apple.com/documentation/walletpasses/unregister_a_pass_for_update_notifications
	 */
	onUnregister(
		deviceLibraryIdentifier: string,
		passTypeIdentifier: string,
		serialNumber: string,
	): PromiseLike<void>;
}

const postSchema: FastifySchema = {
	headers: {
		type: "object",
		properties: {
			authorization: { type: "string" },
		},
		required: ["authorization"],
	},
	params: {
		type: "object",
		properties: {
			deviceLibraryIdentifier: { type: "string" },
			passTypeIdentifier: { type: "string" },
			serialNumber: { type: "string" },
		},
	},
	body: {
		type: "object",
		properties: {
			pushToken: { type: "string" },
		},
	},
};

const deleteSchema: FastifySchema = {
	headers: {
		type: "object",
		properties: {
			authorization: { type: "string" },
		},
	},
	params: {
		type: "object",
		properties: {
			deviceLibraryIdentifier: { type: "string" },
			passTypeIdentifier: { type: "string" },
			serialNumber: { type: "string" },
		},
	},
};

async function registrationPlugin(
	fastify: FastifyInstance,
	opts: RegistrationPluginOptions,
) {
	if (typeof opts.onRegister !== "function") {
		throw new HandlerNotFoundError("onRegister", "RegistrationPlugin");
	}

	if (typeof opts.onUnregister !== "function") {
		throw new HandlerNotFoundError("onUnregister", "RegistrationPlugin");
	}

	const preHandlerHooks: (
		| preHandlerAsyncHookHandler
		| preHandlerHookHandler
	)[] = [];

	if (typeof opts.tokenVerifier === "function") {
		preHandlerHooks.push(createTokenVerifierHook(opts.tokenVerifier));
	}

	fastify.post<{
		Body: PushToken;
		Params: Record<RegisterParams[number], string>;
	}>(RegisterEndpoint.path, {
		prefixTrailingSlash: "no-slash",
		schema: postSchema,
		preValidation: [checkAuthorizationSchemeValidationHook],
		preHandler: preHandlerHooks,
		async handler(request, reply) {
			const { deviceLibraryIdentifier, passTypeIdentifier, serialNumber } =
				request.params;

			const { pushToken } = request.body;

			const registrationSuccessful = Boolean(
				await opts.onRegister(
					deviceLibraryIdentifier,
					passTypeIdentifier,
					serialNumber,
					pushToken,
				),
			);

			return reply.code(200 + Number(registrationSuccessful)).send();
		},
	});

	fastify.delete<{
		Body: never;
		Params: Record<UnregisterParams[number], string>;
	}>(UnregisterEndpoint.path, {
		prefixTrailingSlash: "no-slash",
		schema: deleteSchema,
		preValidation: [checkAuthorizationSchemeValidationHook],
		preHandler: preHandlerHooks,
		async handler(request, reply) {
			const { deviceLibraryIdentifier, passTypeIdentifier, serialNumber } =
				request.params;

			await opts.onUnregister(
				deviceLibraryIdentifier,
				passTypeIdentifier,
				serialNumber,
			);

			return reply.code(200).send();
		},
	});
}

export default registrationPlugin satisfies FastifyPluginAsync<RegistrationPluginOptions>;
