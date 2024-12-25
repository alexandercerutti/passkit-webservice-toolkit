/**
 * @param {import("fastify").FastifyInstance} instance
 * @return {Promise<string>}
 */

export async function startFastify(instance) {
	return new Promise((resolve) => {
		instance.listen({ port: 0 }, (err, address) => {
			if (err) {
				console.log("Error while starting up fastify:", err);
				return;
			}

			resolve(address);
		});
	});
}
