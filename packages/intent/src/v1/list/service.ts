import { Injectable } from "@intentjs/core";
import { ServiceMethodNotReplacedError } from "../../ServiceMethodNotReplaced.js";
import type { v1 } from "passkit-webservice-toolkit";

type SerialNumbers = v1.SerialNumbers;

@Injectable()
export class ListService {
	/**
	 * This method **must** get overridden when using this service, like
	 * below:
	 *
	 * @example
	 *
	 * ```js
	 * this.bindWithValue(ListService, {
	 *		async onListRetrieve(
	 *			_passTypeIdentifier: string,
	 *			_serialNumber: string,
	 *			_filters: {
	 *				passesUpdatedSince?: LastUpdatedFormat;
	 *			},
	 *		): PromiseLike<boolean> {
	 *			...
	 *		}
	 * })
	 * ```
	 *
	 * @param {string} _deviceLibraryIdentifier
	 * @param {string} _passTypeIdentifier
	 * @param {{ passesUpdatedSince: LastUpdatedFormat }} _filters A filters set to retrive passes to update
	 *
	 * @returns {SerialNumbers | undefined} If _falsy_ is returned, the request will
	 * 		be replied with HTTP 204 No Content.
	 *
	 * @see https://developer.apple.com/documentation/walletpasses/get_the_list_of_updatable_passes
	 */

	async onListRetrieve<LastUpdatedFormat>(
		_deviceLibraryIdentifier: string,
		_passTypeIdentifier: string,
		_filters: {
			passesUpdatedSince?: LastUpdatedFormat;
		},
	): Promise<SerialNumbers | undefined> {
		throw new ServiceMethodNotReplacedError("onListRetrieve", "list/service");
	}
}
