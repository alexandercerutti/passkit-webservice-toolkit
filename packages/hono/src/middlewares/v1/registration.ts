import { Hono } from "hono";
import {
	RegisterEndpoint,
	type PushToken,
} from "passkit-webservice-toolkit/v1/register.js";
import { UnregisterEndpoint } from "passkit-webservice-toolkit/v1/unregister.js";
import { HandlerNotFoundError } from "../../HandlerNotFoundError.js";
import { assertAuthorizationSchemeValid, assertTokenValid } from "./hooks.js";

interface RegistrationRouterOptions {
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

export default function RegistrationRouter(
	opts: RegistrationRouterOptions,
): Hono {
	if (typeof opts?.onRegister !== "function") {
		throw new HandlerNotFoundError("onRegister", "RegistrationRouter");
	}

	if (typeof opts.onUnregister !== "function") {
		throw new HandlerNotFoundError("onUnregister", "RegistrationRouter");
	}

	const router = new Hono();

	router.post(
		RegisterEndpoint.path,
		assertAuthorizationSchemeValid,
		assertTokenValid(opts.tokenVerifier),
		async (context) => {
			const { deviceLibraryIdentifier, passTypeIdentifier, serialNumber } =
				context.req.param();

			const { pushToken } = await context.req.json<PushToken>();

			const registrationSuccessful = Boolean(
				await opts.onRegister(
					deviceLibraryIdentifier,
					passTypeIdentifier,
					serialNumber,
					pushToken,
				),
			);

			const statusCode = (200 + Number(registrationSuccessful)) as 200 | 201;
			context.status(statusCode);
			return context.body(null);
		},
	);

	router.delete(
		UnregisterEndpoint.path,
		assertAuthorizationSchemeValid,
		assertTokenValid(opts.tokenVerifier),
		async (context) => {
			const { deviceLibraryIdentifier, passTypeIdentifier, serialNumber } =
				context.req.param();

			await opts.onUnregister(
				deviceLibraryIdentifier,
				passTypeIdentifier,
				serialNumber,
			);

			context.status(200);
			return context.body(null);
		},
	);

	return router;
}
