import { createEndpointDefinition } from "../endpointDefinition.js";

/**
 * Send the serial numbers for updated passes to a device.
 * @see https://developer.apple.com/documentation/walletpasses/get_the_list_of_updatable_passes
 */
export const ListEndpoint = createEndpointDefinition(
	"GET /v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier",
);

export type ListParams = (typeof ListEndpoint)["params"];

/**
 * @see https://developer.apple.com/documentation/walletpasses/serialnumbers
 */
export interface SerialNumbers {
	serialNumbers: string[];

	/**
	 * A developer-defined string that contains a tag that
	 * indicates the modification time for the returned passes.
	 *
	 * You use the value of this key for the `previousLastUpdated`
	 * parameter of Get the List of Updatable Passes to return
	 * passes modified after the represented date and time.
	 */

	lastUpdated: string;
}
