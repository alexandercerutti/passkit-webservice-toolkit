import { serve } from "@hono/node-server";

/**
 * @param {import("hono").Hono} instance
 * @return {Promise<{ address: string | null, close: () => Promise<void> }>}
 */

export async function startHono(instance) {
	return new Promise((resolve) => {
		/**
		 * @type {import("net").AddressInfo}
		 */

		let addressInfo;

		const server = serve(
			{
				fetch: instance.fetch,
				/**
				 * Let the OS decide the (random) port.
				 * If we try to use the same port, for some reason
				 * we get a TON OF errors with code ECONNRESET and EADDRINUSE
				 * like the server doesn't close correctly before
				 * another test begins. Don't know why.
				 */
				port: 0,
				hostname: "0.0.0.0",
			},
			(info) => {
				addressInfo = info;
			},
		);

		server.once("listening", () => {
			console.log("Listening @", addressInfo.address, addressInfo.port);

			resolve({
				get address() {
					if (addressInfo.family === "IPv6") {
						return `http://[${addressInfo.address}]:${addressInfo.port}`;
					}

					return `http://${addressInfo.address}:${addressInfo.port}`;
				},
				close() {
					return new Promise((resolve, reject) => {
						server.close((err) => {
							if (err) {
								console.error("Failed closing server", err);
								return reject();
							}

							resolve();
						});
					});
				},
			});
		});
	});
}
