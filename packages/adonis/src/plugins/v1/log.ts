import router from "@adonisjs/core/services/router";
import { LogEndpoint } from "passkit-webservice-toolkit/v1/log.js";
import type { LogEntries } from "passkit-webservice-toolkit/v1/log.js";
import { HandlerNotFoundError } from "../../HandlerNotFoundError.js";

/**
 * @see https://developer.apple.com/documentation/walletpasses/log_a_message
 */

interface LogRouterOptions {
	onIncomingLogs(logs: string[]): void;
}

export default function LogRouter(opts: LogRouterOptions): () => void {
	if (typeof opts?.onIncomingLogs !== "function") {
		throw new HandlerNotFoundError("onIncomingLog", "LogPlugin");
	}

	return () => {
		router.post(LogEndpoint.path, async ({ request, response }) => {
			const body = request.body() as LogEntries;
			opts.onIncomingLogs(body.logs);
			response.status(200);
		});
	};
}
