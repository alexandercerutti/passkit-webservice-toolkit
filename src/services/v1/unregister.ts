import { createEndpointDefinition } from "../endpointDefinition.js";

export const UNREGISTER_ENDPOINT = createEndpointDefinition(
	"DELETE /v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier/:serialNumber",
);
