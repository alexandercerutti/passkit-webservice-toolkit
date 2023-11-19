import { createEndpointDefinition } from "../endpointDefinition.js";

/**
 * Record a message on your server.
 * @see https://developer.apple.com/documentation/walletpasses/log_a_message
 */

export const LOG_ENDPOINT = createEndpointDefinition("POST /v1/log");
