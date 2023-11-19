import { createEndpointDefinition } from "../endpointDefinition.js";

/**
 * Record a message on your server.
 * @see https://developer.apple.com/documentation/walletpasses/log_a_message
 */
export const LogEndpoint = createEndpointDefinition("POST /v1/log");

export type LogParams = (typeof LogEndpoint)["params"];

/**
 * @see https://developer.apple.com/documentation/walletpasses/logentries
 */
export interface LogEntries {
	logs: string[];
}
