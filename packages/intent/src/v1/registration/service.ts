import { Injectable } from "@intentjs/core";
import { ServiceMethodNotReplacedError } from "../../ServiceMethodNotReplaced.js";

@Injectable()
export class RegistrationService {
	/**
	 * If token verification is desired, this method should
	 * get overridden on integration side by using:
	 *
	 * @example
	 *
	 * ```js
	 * this.bindWithValue(RegistrationService, {
	 *		async tokenVerifier(token: string): PromiseLike<boolean> {
	 *		...
	 *		}
	 * })
	 * ```
	 *
	 * @param {string} _token
	 */
	public async tokenVerifier(_token: string) {
		return true;
	}

	/**
	 * Return `true` if the registration has been successful (HTTP 201)
	 * Otherwise `false` to tell Apple the SN has been already registered
	 * for the device (HTTP 200).
	 *
	 * This method **must** get overridden when using this service, like
	 * below:
	 *
	 * @example
	 *
	 * ```js
	 * this.bindWithValue(RegistrationService, {
	 *		async onRegister(
	 *			deviceLibraryIdentifier: string,
	 *			passTypeIdentifier: string,
	 *			serialNumber: string,
	 *			pushToken: string
	 *		): PromiseLike<boolean> {
	 *			...
	 *		}
	 * })
	 * ```
	 *
	 * @param {string} _deviceLibraryIdentifier
	 * @param {string} _passTypeIdentifier
	 * @param {string} _serialNumber
	 * @param {string} _pushToken
	 * @return {Promise<boolean>}
	 *
	 * @see https://developer.apple.com/documentation/walletpasses/register_a_pass_for_update_notifications
	 */
	public async onRegister(
		_deviceLibraryIdentifier: string,
		_passTypeIdentifier: string,
		_serialNumber: string,
		_pushToken: string,
	): Promise<boolean> {
		throw new ServiceMethodNotReplacedError(
			"onRegister",
			"registration/service",
		);
	}

	/**
	 * This method **must** get overridden when using this service, like
	 * below:
	 *
	 * @example
	 *
	 * ```js
	 * this.bindWithValue(RegistrationService, {
	 *		async onUnregister(
	 *			deviceLibraryIdentifier: string,
	 *			passTypeIdentifier: string,
	 *			serialNumber: string,
	 *		): PromiseLike<boolean> {
	 *			...
	 *		}
	 * })
	 * ```
	 *
	 * @param {string} _deviceLibraryIdentifier
	 * @param {string} _passTypeIdentifier
	 * @param {string} _serialNumber
	 *
	 * @see https://developer.apple.com/documentation/walletpasses/unregister_a_pass_for_update_notifications
	 */
	public async onUnregister(
		_deviceLibraryIdentifier: string,
		_passTypeIdentifier: string,
		_serialNumber: string,
	): Promise<void> {
		throw new ServiceMethodNotReplacedError(
			"onUnregister",
			"registration/service",
		);
	}
}
