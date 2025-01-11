import { Body, Controller, Post, Res, Response } from "@intentjs/core";
import { v1 } from "passkit-webservice-toolkit";
import { LogService } from "./service.js";
import { ServiceMethodNotReplacedError } from "../../ServiceMethodNotReplaced.js";

const { LogEndpoint } = v1;

@Controller()
export class LogController {
	constructor(private service: LogService) {
		if (typeof service.onIncomingLogs !== "function") {
			throw new ServiceMethodNotReplacedError("onIncomingLogs", "log/service");
		}
	}

	@Post(LogEndpoint.path)
	async onRegistration(@Res() res: Response, @Body("logs") logs: string[]) {
		this.service.onIncomingLogs(logs);
		res.status(200).send();
	}
}
