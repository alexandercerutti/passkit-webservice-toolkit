import type { Context, Next, MiddlewareHandler } from "hono";
import type { BlankEnv } from "hono/types";
import {
	isAuthorizationSchemeValid,
	getAuthorizationToken,
} from "passkit-webservice-toolkit/v1/utils/auth.js";

export async function assertAuthorizationSchemeValid(
	context: Context<BlankEnv>,
	next: Next,
): Promise<Response | void> {
	const authorization = context.req.header("Authorization") || "";

	if (!isAuthorizationSchemeValid(authorization)) {
		context.status(401);
		return context.json({
			message: `Apple Schema validation for Authorization header failed. Received: '${authorization}'.`,
		});
	}

	await next();
}

export function assertTokenValid(
	verifyToken?: (token: string) => PromiseLike<boolean>,
): MiddlewareHandler {
	return async function (context: Context<BlankEnv>, next: Next) {
		if (typeof verifyToken !== "function") {
			return next();
		}

		const authorization = context.req.header("Authorization") || "";

		const token = getAuthorizationToken(authorization);

		if (!(await verifyToken(token))) {
			console.warn(
				`Authorization token validation failed. Received: ${authorization}`,
			);
			context.status(401);
			return context.json({
				message: `Authorization token validation failed. Received: ${authorization}`,
			});
		}

		return next();
	};
}
