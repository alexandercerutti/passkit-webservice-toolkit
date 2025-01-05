import { Controller, Get, Req, Request, Res, Response } from "@intentjs/core";
import { IndexService } from "app/services/index.js";

@Controller()
export class IndexController {
	constructor(private readonly service: IndexService) {
		console.log(service);
	}

	@Get()
	async getHello(@Req() req: Request, @Res() res: Response) {
		return res.json({ hello: "world" });
	}
}
