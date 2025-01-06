import { Injectable } from "@intentjs/core";
import { ServiceMethodNotReplacedError } from "../../ServiceMethodNotReplaced.js";

@Injectable()
export class UpdateService {
	/**
	 * If token verification is desired, this method should
	 * get overridden on integration side by using:
	 *
	 * @example
	 *
	 * ```js
	 * this.bindWithValue(UpdateService, {
	 * 	async tokenVerifier(token: string): PromiseLike<boolean> {
	 *		...
	 * 	}
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
	 * this.bindWithValue(UpdateService, {
	 *		async onUpdateRequest(
	 *			_passTypeIdentifier: string,
	 *			_serialNumber: string,
	 *			_modifiedSinceTimestamp?: number | undefined,
	 *		): PromiseLike<boolean> {
	 *			...
	 *		}
	 * })
	 * ```
	 *
	 * @see https://developer.apple.com/documentation/walletpasses/send_an_updated_pass
	 *
	 * @param _passTypeIdentifier
	 * @param _serialNumber
	 * @param {number} [_modifiedSinceTimestamp] A timestamp that is provided by Apple,
	 * 		based on the the time the last successful (HTTP 200) update was provided
	 *
	 * @returns {Uint8Array | undefined} If _falsy_ is returned, the request will
	 * 		be replied with HTTP 304 Not Modified.
	 */

	async onUpdateRequest(
		_passTypeIdentifier: string,
		_serialNumber: string,
		_modifiedSinceTimestamp?: number | undefined,
	): Promise<Uint8Array | undefined> {
		throw new ServiceMethodNotReplacedError(
			"onUpdateRequest",
			"update/service",
		);
	}
}
