import { createEndpointDefinition } from "../endpointDefinition.js";

/**
 * Set up change notifications for a pass on a device.
 * @see https://developer.apple.com/documentation/walletpasses/register_a_pass_for_update_notifications
 */

export const REGISTER_ENDPOINT = createEndpointDefinition(
	"POST /v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier/:serialNumber",
);
