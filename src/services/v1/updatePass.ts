import { createEndpointDefinition } from "../endpointDefinition.js";

export const UPDATE_PASS_ENDPOINT = createEndpointDefinition(
	"GET /v1/passes/:passTypeIdentifier/:serialNumber",
);
