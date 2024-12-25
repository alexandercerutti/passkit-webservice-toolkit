import { Hono } from "hono";
import {
	LogEndpoint,
	type LogEntries,
} from "passkit-webservice-toolkit/v1/log.js";
import { HandlerNotFoundError } from "../../HandlerNotFoundError.js";

/**
 * @see https://developer.apple.com/documentation/walletpasses/log_a_message
 */

interface LogRouterOptions {
	onIncomingLogs(logs: string[]): void;
}

export default function LogRouter(opts: LogRouterOptions): Hono {
	if (typeof opts?.onIncomingLogs !== "function") {
		throw new HandlerNotFoundError("onIncomingLog", "LogRouter");
	}

	const router = new Hono();

	router.post(LogEndpoint.path, async (context) => {
		const payload = await context.req.json<LogEntries>();

		opts.onIncomingLogs(payload.logs);
		context.status(200);
		return context.body(null);
	});

	return router;
}
