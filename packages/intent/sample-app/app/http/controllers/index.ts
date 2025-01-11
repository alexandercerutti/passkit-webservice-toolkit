import { Controller, Get, Req, Request, Res, Response } from "@intentjs/core";
import { IndexService } from "app/services/index.js";
import { createPass } from "app/utils/index.js";

@Controller()
export class IndexController {
	#lastPassUpdate = Date.now();

	constructor(private readonly service: IndexService) {
		console.log(service);
	}

	get passUpdateDate(): number {
		return this.#lastPassUpdate;
	}

	set passUpdateDate(value: number) {
		this.#lastPassUpdate = value;
	}

	@Get()
	async getHello(@Req() req: Request, @Res() res: Response) {
		return res.json({ hello: "world" });
	}

	@Get("/testpass")
	async getInitialPass(@Req() req: Request, @Res() res: Response) {
		const pass = await createPass();

		this.#lastPassUpdate = Date.now();

		res.setHeaders({
			"Content-Type": pass.mimeType,
			"Content-Disposition": `attachment; filename="pass.pkpass"`,
			"Last-Modified": new Date().toUTCString(),
		});

		res.status(200).send(pass.getAsBuffer());
	}
}
