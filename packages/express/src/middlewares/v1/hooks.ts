import type { NextFunction, Request, Response, Handler } from "express";
import {
	isAuthorizationSchemeValid,
	getAuthorizationToken,
} from "passkit-webservice-toolkit/v1/utils/auth.js";

export function assertAuthorizationSchemeValid(
	request: Request,
	response: Response,
	next: NextFunction,
): void {
	const { authorization = "" } = request.headers;

	if (!isAuthorizationSchemeValid(authorization)) {
		response
			.status(401)
			.send("Apple Schema validation for Authorization header failed.");
		return;
	}

	next();
}

export function assertTokenValid(
	verifyToken?: (token: string) => PromiseLike<boolean>,
): Handler {
	return async function (
		request: Request,
		response: Response,
		next: NextFunction,
	) {
		if (typeof verifyToken !== "function") {
			return next();
		}

		const { authorization = "" } = request.headers;

		try {
			const token = getAuthorizationToken(authorization);

			if (!(await verifyToken(token))) {
				throw new Error("Token verifier rejected the provided token.");
			}

			return next();
		} catch (error) {
			response.status(401).send();
			return;
		}
	};
}
