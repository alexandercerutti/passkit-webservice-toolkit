import { createEndpointDefinition } from "../endpointDefinition.js";

export const REGISTER_ENDPOINT = createEndpointDefinition(
	"POST /v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier/:serialNumber",
);
