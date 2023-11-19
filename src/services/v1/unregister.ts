import { createEndpointDefinition } from "../endpointDefinition.js";

/**
 * Stop sending update notifications for a pass on a device.
 * @see https://developer.apple.com/documentation/walletpasses/unregister_a_pass_for_update_notifications
 */

export const UnregisterEndpoint = createEndpointDefinition(
	"DELETE /v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier/:serialNumber",
);
