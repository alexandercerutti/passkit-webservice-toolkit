export class HandlerNotFoundError extends Error {
	constructor(handlerName: string, middlewareName: string) {
		super();
		this.name = "HandlerNotFoundError";
		this.message = `Handler '${handlerName}' is expected to be a function passed as a handler for '${middlewareName}'.`;
	}
}
