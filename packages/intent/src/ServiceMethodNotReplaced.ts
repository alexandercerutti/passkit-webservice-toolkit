export class ServiceMethodNotReplacedError extends Error {
	constructor(serviceHandlerName: string, serviceName: string) {
		super();
		this.name = "ServiceMethodNotReplacedError";
		this.message = `Service '${serviceName}' handler '${serviceHandlerName}' is expected to get replaced through 'this.bindWithValues(...). Follow the documentation for more details.'`;
	}
}
