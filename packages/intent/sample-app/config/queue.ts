import { configNamespace } from "@intentjs/core";
import type { QueueOptions, RegisterNamespaceReturnType } from "@intentjs/core";

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
}) as RegisterNamespaceReturnType<"queue", QueueOptions>;
