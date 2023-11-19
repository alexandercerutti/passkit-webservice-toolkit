/**
 * Utility to extract the Autorization token by the
 * header, while performing minimum validation
 *
 * @param authorizationString
 * @returns
 */

export function getAuthorizationToken(
	authorizationString: string,
): string | undefined {
	const authorization = authorizationString || "";

	const [authorizationScheme, passAuthorizationToken] =
		authorization.split("\x20");

	if (!isAuthorizationSchemeValid(authorizationScheme)) {
		return undefined;
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
