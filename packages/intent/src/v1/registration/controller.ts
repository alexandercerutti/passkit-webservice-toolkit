import {
	Body,
	Controller,
	Delete,
	Param,
	Post,
	Req,
	Request,
	Res,
	Response,
} from "@intentjs/core";
import { RegisterEndpoint } from "passkit-webservice-toolkit/v1/register.js";
import { UnregisterEndpoint } from "passkit-webservice-toolkit/v1/unregister.js";
import { RegistrationService } from "./service.js";
import { getAuthorizationToken } from "passkit-webservice-toolkit/v1/utils/auth.js";
import { ServiceMethodNotReplacedError } from "../../ServiceMethodNotReplaced.js";

@Controller()
export class RegistrationController {
	constructor(private service: RegistrationService) {
		if (typeof service.onRegister !== "function") {
			throw new ServiceMethodNotReplacedError(
				"onRegister",
				"registration/service",
			);
		}

		if (typeof service.onUnregister !== "function") {
			throw new ServiceMethodNotReplacedError(
				"onUnregister",
				"registration/service",
			);
		}
	}

	private async verifyToken(
		authorizationString: string = "",
	): Promise<boolean> {
		if (typeof this.service.tokenVerifier !== "function") {
			return true;
		}

		return this.service.tokenVerifier(
			getAuthorizationToken(authorizationString),
		);
	}

	@Post(RegisterEndpoint.path)
	async onRegistration(
		@Req() req: Request,
		@Res() res: Response,
		@Param(RegisterEndpoint.params[0]) deviceLibraryIdentifier: string,
		@Param(RegisterEndpoint.params[1]) passTypeIdentifier: string,
		@Param(RegisterEndpoint.params[2]) serialNumber: string,
		@Body("pushToken") pushToken: string,
	) {
		const authorization = req.header("authorization");

		if (!this.verifyToken(authorization)) {
			// logger.info("Token validation failed.", authorization);
			res.status(401).send();
			return;
		}

		const registrationSuccessful = Boolean(
			await this.service.onRegister(
				deviceLibraryIdentifier,
				passTypeIdentifier,
				serialNumber,
				pushToken,
			),
		);

		res.status(200 + Number(registrationSuccessful)).send();
	}

	@Delete(UnregisterEndpoint.path)
	async onUnregistration(
		@Req() req: Request,
		@Res() res: Response,
		@Param(UnregisterEndpoint.params[0]) deviceLibraryIdentifier: string,
		@Param(UnregisterEndpoint.params[1]) passTypeIdentifier: string,
		@Param(UnregisterEndpoint.params[2]) serialNumber: string,
	) {
		const authorization = req.header("authorization");

		if (!this.verifyToken(authorization)) {
			// logger.info("Token validation failed.", authorization);
			res.status(401).send();
			return;
		}

		await this.service.onUnregister(
			deviceLibraryIdentifier,
			passTypeIdentifier,
			serialNumber,
		);

		res.status(200).send();
		return;
	}
}
