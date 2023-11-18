import { createEndpointDefinition } from "../endpointDefinition.js";

export const LIST_ENDPOINT = createEndpointDefinition(
	"POST /v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier",
);
