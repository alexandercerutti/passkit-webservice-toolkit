type ExtractParamsFromEndpoint<T extends string> =
	T extends `${infer Section}/${infer Rest}`
		? Section extends `:${infer Param}`
			? [Param, ...ExtractParamsFromEndpoint<Rest>]
			: [...ExtractParamsFromEndpoint<Rest>]
		: T extends `:${infer LastParam}`
		  ? [LastParam]
		  : [];

type EndpointDefinition<T extends string> =
	T extends `${infer Method}\x20${infer Path}`
		? {
				method: Method;
				path: Path;
				params: ExtractParamsFromEndpoint<Path>;
				toString(): T;
		  }
		: never;

export function createEndpointDefinition<const T extends string>(
	signature: T,
): EndpointDefinition<T> {
	const [method, path] = signature.split("\x20");

	const params = path
		.split("/")
		.filter((section) => section.startsWith(":"))
		.map((param) => param.slice(1));

	return {
		method,
		path,
		params,
		toString() {
			return signature;
		},
	} as EndpointDefinition<T>;
}
