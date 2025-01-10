import { HttpKernel } from "./http/kernel.js";
import { ApplicationContainer } from "./boot/container.js";
import { ApplicationExceptionFilter } from "./errors/filter.js";
import { IntentHttpServer } from "@intentjs/core";

const server = IntentHttpServer.init();

server.useContainer(ApplicationContainer);

server.useKernel(HttpKernel);

server.handleErrorsWith(ApplicationExceptionFilter);

server.start();
