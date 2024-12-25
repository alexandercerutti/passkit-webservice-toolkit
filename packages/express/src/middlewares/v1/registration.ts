import { json, Router } from "express";
import {
	RegisterEndpoint,
	type PushToken,
} from "passkit-webservice-toolkit/v1/register.js";
import { UnregisterEndpoint } from "passkit-webservice-toolkit/v1/unregister.js";
import { HandlerNotFoundError } from "../../HandlerNotFoundError.js";
import { assertAuthorizationSchemeValid, assertTokenValid } from "./hooks.js";
import type { RouteParameters } from "express-serve-static-core";

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
): Router {
	if (typeof opts?.onRegister !== "function") {
		throw new HandlerNotFoundError("onRegister", "RegistrationPlugin");
	}

	if (typeof opts.onUnregister !== "function") {
		throw new HandlerNotFoundError("onUnregister", "RegistrationPlugin");
	}

	const router = Router({ caseSensitive: true });
	router.use(json());

	type Route = typeof RegisterEndpoint.path;
	type Params = RouteParameters<Route>;
	type ResBody = any;
	type ReqBody = PushToken;

	router.post<Route, Params, ResBody, ReqBody>(
		RegisterEndpoint.path,
		assertAuthorizationSchemeValid,
		assertTokenValid(opts.tokenVerifier),
		async (request, response) => {
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

			response.status(200 + Number(registrationSuccessful)).send();
		},
	);

	router.delete(
		UnregisterEndpoint.path,
		assertAuthorizationSchemeValid,
		assertTokenValid(opts.tokenVerifier),
		async (request, response) => {
			const { deviceLibraryIdentifier, passTypeIdentifier, serialNumber } =
				request.params;

			await opts.onUnregister(
				deviceLibraryIdentifier,
				passTypeIdentifier,
				serialNumber,
			);

			response.status(200).send();
		},
	);

	return router;
}
