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
			message: "Apple Schema validation for Authorization header failed.",
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

		let token: string = "";

		try {
			token = getAuthorizationToken(authorization);

			const tokenValid = await verifyToken(token);

			if (!tokenValid) {
				throw new Error("Token verifier rejected the provided token.");
			}
		} catch (error) {
			context.status(401);

			return context.json({
				message: error instanceof Error ? error.message : "Invalid token.",
			});
		}

		return next();
	};
}
