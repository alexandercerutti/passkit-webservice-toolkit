/**
 * Utility to extract the Autorization token by the
 * header, while performing minimum validation.
 *
 * @throws if scheme is invalid
 * @throws if the token is empty
 * @param authorizationString
 * @returns
 */

export function getAuthorizationToken(authorizationString: string): string {
	const authorization = authorizationString || "";

	const [authorizationScheme, passAuthorizationToken] =
		authorization.split("\x20");

	if (!isAuthorizationSchemeValid(authorizationScheme)) {
		throw new Error(
			`Authorization header verification: expected 'ApplePass' but received '${authorizationScheme}.'`,
		);
	}

	if (!passAuthorizationToken.length) {
		throw new Error("Authorization header verification: no token found.");
	}

	return passAuthorizationToken;
}

/**
 * Utility to verify the scheme sent by Apple.
 * It should always be "ApplePass", but... you never know!
 *
 * @param authorizationString
 * @returns
 */

export function isAuthorizationSchemeValid(
	authorizationString: string,
): boolean {
	const [authorizationScheme] = (authorizationString || "").split("\x20");
	return authorizationScheme === "ApplePass";
}
