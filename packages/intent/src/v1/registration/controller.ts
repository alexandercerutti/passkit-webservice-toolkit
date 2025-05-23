import {
	Body,
	Controller,
	Delete,
	Header,
	Param,
	Post,
	Res,
	Response,
} from "@intentjs/core";
import { v1 } from "passkit-webservice-toolkit";
import { RegistrationService } from "./service.js";
import { ServiceMethodNotReplacedError } from "../../ServiceMethodNotReplaced.js";

const { getAuthorizationToken, RegisterEndpoint, UnregisterEndpoint } = v1;

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
		@Res() res: Response,
		@Header("authorization") authorization: string,
		@Body("pushToken") pushToken: string,
		@Param(RegisterEndpoint.params[0]) deviceLibraryIdentifier: string,
		@Param(RegisterEndpoint.params[1]) passTypeIdentifier: string,
		@Param(RegisterEndpoint.params[2]) serialNumber: string,
	) {
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
		@Res() res: Response,
		@Header("authorization") authorization: string,
		@Param(UnregisterEndpoint.params[0]) deviceLibraryIdentifier: string,
		@Param(UnregisterEndpoint.params[1]) passTypeIdentifier: string,
		@Param(UnregisterEndpoint.params[2]) serialNumber: string,
	) {
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
