import type { RegisterNamespaceReturnType } from "@intentjs/core";
import app from "./app.js";
import logger from "./logger.js";
import localization from "./localization.js";
import queue from "./queue.js";
import http from "./http.js";

export default [app, localization, logger, queue, http] as RegisterNamespaceReturnType<string, object>[]
