import {
	CorsMiddleware,
	IntentGuard,
	IntentMiddleware,
	Kernel,
	MiddlewareConfigurator,
	Type,
} from "@intentjs/core";
import { IndexController } from "./controllers/index.js";
import { Server } from "@intentjs/hyper-express";
import { RegistrationController } from "intent-passkit-webservice/v1/registration/controller.js";
import { LogController } from "intent-passkit-webservice/v1/log/controller.js";

export class HttpKernel extends Kernel {
	/**
	 * Global registry for all of the controller classes.
	 * Read more - https://tryintent.com/docs/controllers
	 */
	public controllers(): Type<any>[] {
		return [IndexController, RegistrationController, LogController];
	}

	/**
	 * Register all of your global middlewares here.
	 * Middlewares added in the return array will be
	 * applied to all routes by default.
	 *
	 * Read more - https://tryintent.com/docs/middlewares
	 */
	public middlewares(): Type<IntentMiddleware>[] {
		return [CorsMiddleware];
	}

	/**
	 * Register all of your route based middlewares here.
	 * You can apply middlewares to group of routes, controller classes
	 * or exclude them.
	 *
	 * Read more - https://tryintent.com/docs/middlewares
	 */
	public routeMiddlewares(configurator: MiddlewareConfigurator) {
		return;
	}

	/**
	 * Register all of your global guards here.
	 * Guards added in the return array will be
	 * applied to all routes by default.
	 *
	 * Read more - https://tryintent.com/docs/guards
	 */
	public guards(): Type<IntentGuard>[] {
		return [];
	}

	/**
	 * @param app
	 */
	public async boot(app: Server): Promise<void> {}
}
