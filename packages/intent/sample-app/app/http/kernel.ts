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
import RegistrationController from "./controllers/ExtendedRegistrationController.js";
import LogController from "./controllers/ExtendedLogController.js";
import UpdateController from "./controllers/ExtendedUpdateController.js";
import ListController from "./controllers/ExtendedListController.js";

export class HttpKernel extends Kernel {
	/**
	 * Global registry for all of the controller classes.
	 * Read more - https://tryintent.com/docs/controllers
	 */
	public controllers(): Type<any>[] {
		return [
			IndexController,
			RegistrationController,
			LogController,
			UpdateController,
			ListController,
		];
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
