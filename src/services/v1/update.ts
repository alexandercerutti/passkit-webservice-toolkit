import { createEndpointDefinition } from "../endpointDefinition.js";

/**
 * Create and sign an updated pass, and send it to the device.
 * @see https://developer.apple.com/documentation/walletpasses/send_an_updated_pass
 */

export const UpdateEndpoint = createEndpointDefinition(
	"GET /v1/passes/:passTypeIdentifier/:serialNumber",
);
