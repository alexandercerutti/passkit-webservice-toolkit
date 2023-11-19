import { createEndpointDefinition } from "../endpointDefinition.js";

/**
 * Send the serial numbers for updated passes to a device.
 * @see https://developer.apple.com/documentation/walletpasses/get_the_list_of_updatable_passes
 */

export const ListEndpoint = createEndpointDefinition(
	"POST /v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier",
);
