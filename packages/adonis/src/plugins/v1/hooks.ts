import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn, MiddlewareFn } from "@adonisjs/core/types/http";
import {
	isAuthorizationSchemeValid,
	getAuthorizationToken,
} from "passkit-webservice-toolkit/v1/utils/auth.js";

export async function assertAuthorizationSchemeValidMiddleware(
	context: HttpContext,
	next: NextFn,
): Promise<void> {
	const { authorization = "" } = context.request.headers();

	if (!isAuthorizationSchemeValid(authorization)) {
		context.response
			.status(401)
			.send("Apple Schema validation for Authorization header failed.");
		return;
	}

	await next();
}

export function assertTokenValidMiddleware(
	verifyToken?: (token: string) => PromiseLike<boolean>,
): MiddlewareFn {
	return async function (context: HttpContext, next: NextFn): Promise<void> {
		if (typeof verifyToken !== "function") {
			await next();
			return;
		}

		const { authorization = "" } = context.request.headers();

		try {
			const token = getAuthorizationToken(authorization);

			if (!(await verifyToken(token))) {
				throw new Error("Token verifier rejected the provided token.");
			}

			return await next();
		} catch (error) {
			context.response.status(401).send(error);
			return;
		}
	};
}
