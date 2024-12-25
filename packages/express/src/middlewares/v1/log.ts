import { json, Router } from "express";
import {
	LogEndpoint,
	type LogEntries,
} from "passkit-webservice-toolkit/v1/log.js";
import { HandlerNotFoundError } from "../../HandlerNotFoundError.js";
import type { RouteParameters } from "express-serve-static-core";

/**
 * @see https://developer.apple.com/documentation/walletpasses/log_a_message
 */

interface LogRouterOptions {
	onIncomingLogs(logs: string[]): void;
}

export default function LogRouter(opts: LogRouterOptions): Router {
	if (typeof opts?.onIncomingLogs !== "function") {
		throw new HandlerNotFoundError("onIncomingLog", "LogPlugin");
	}

	const router = Router({ caseSensitive: true });
	router.use(json());

	type Route = typeof LogEndpoint.path;
	type Params = RouteParameters<Route>;
	type ResBody = any;
	type ReqBody = LogEntries;

	router.post<Route, Params, ResBody, ReqBody>(
		LogEndpoint.path,
		async (request, response) => {
			opts.onIncomingLogs(request.body.logs);
			response.status(200);
		},
	);

	return router;
}
