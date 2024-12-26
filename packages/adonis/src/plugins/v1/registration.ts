import router from "@adonisjs/core/services/router";
import { RegisterEndpoint } from "passkit-webservice-toolkit/v1/register.js";
import type {
	RegisterParams,
	PushToken,
} from "passkit-webservice-toolkit/v1/register.js";
import { UnregisterEndpoint } from "passkit-webservice-toolkit/v1/unregister.js";
import { HandlerNotFoundError } from "../../HandlerNotFoundError.js";
import {
	assertAuthorizationSchemeValidMiddleware,
	assertTokenValidMiddleware,
} from "./hooks.js";

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
): () => void {
	if (typeof opts?.onRegister !== "function") {
		throw new HandlerNotFoundError("onRegister", "RegistrationPlugin");
	}

	if (typeof opts.onUnregister !== "function") {
		throw new HandlerNotFoundError("onUnregister", "RegistrationPlugin");
	}

	return () => {
		router
			.group(() => {
				router.post(RegisterEndpoint.path, async (context) => {
					const { deviceLibraryIdentifier, passTypeIdentifier, serialNumber } =
						context.params as Record<RegisterParams[number], string>;

					const { pushToken } = context.request.body() as PushToken;

					const registrationSuccessful = Boolean(
						await opts.onRegister(
							deviceLibraryIdentifier,
							passTypeIdentifier,
							serialNumber,
							pushToken,
						),
					);

					context.response
						.status(200 + Number(registrationSuccessful))
						.send({});
				});

				router.delete(UnregisterEndpoint.path, async (context) => {
					const { deviceLibraryIdentifier, passTypeIdentifier, serialNumber } =
						context.params as Record<RegisterParams[number], string>;

					await opts.onUnregister(
						deviceLibraryIdentifier,
						passTypeIdentifier,
						serialNumber,
					);

					context.response.status(200).send({});
				});
			})
			.use([
				assertAuthorizationSchemeValidMiddleware,
				assertTokenValidMiddleware(opts.tokenVerifier),
			]);
	};
}
