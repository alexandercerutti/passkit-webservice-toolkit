/**
 * @param {import("express").Application} instance
 * @return {Promise<{ address: string | null, close: Function }>}
 */

export async function startExpress(instance) {
	return new Promise((resolve) => {
		const server = instance.listen();

		server.once("error", (error) => {
			console.log(error);
		});

		server.once("listening", () => {
			resolve({
				get address() {
					const addressInfo = server.address();

					if (addressInfo && typeof addressInfo === "object") {
						if (addressInfo.family === "IPv6") {
							return `http://[${addressInfo.address}]:${addressInfo.port}`;
						}

						return `http://${addressInfo.address}:${addressInfo.port}`;
					}

					return addressInfo;
				},
				close() {
					server.close();
				},
			});
		});
	});
}
