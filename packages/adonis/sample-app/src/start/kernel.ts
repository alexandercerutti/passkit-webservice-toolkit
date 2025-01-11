/*
|--------------------------------------------------------------------------
| HTTP kernel file
|--------------------------------------------------------------------------
|
| The HTTP kernel file is used to register the middleware with the server
| or the router.
|
*/

import router from "@adonisjs/core/services/router";
import server from "@adonisjs/core/services/server";

/**
 * The error handler is used to convert an exception
 * to a HTTP response.
 */
server.errorHandler(() => import("../app/exceptions/handler.js"));

/**
 * The server middleware stack runs middleware on all the HTTP
 * requests, even if there is no route registered for
 * the request URL.
 */
server.use([
	() => import("../app/middleware/container_bindings_middleware.js"),
]);

/**
 * The router middleware stack runs middleware on all the HTTP
 * requests with a registered route.
 */
router.use([() => import("@adonisjs/core/bodyparser_middleware")]);

/**
 * Named middleware collection must be explicitly assigned to
 * the routes or the routes group.
 */
export const middleware = router.named({});
