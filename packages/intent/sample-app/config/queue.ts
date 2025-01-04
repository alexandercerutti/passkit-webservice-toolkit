import { QueueOptions, configNamespace } from "@intentjs/core";

/**
 * CRASHES WITHOUT A QUEUE SERVICE. JUST WHY.
 */

export default configNamespace("queue", (): QueueOptions => {
	return {
		default: process.env.DEFAULT_QUEUE || "sync",
		connections: {
			db: {
				driver: "db",
				listenerType: "poll",
				table: "intent_jobs",
				queue: "default",
			},
		},
	};
});
