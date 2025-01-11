import { v1 } from "intent-passkit-webservice";
import { Controller } from "@intentjs/core";

/**
 * This is an example controller that extends the
 * one provided by intent-passkit-webservice in order
 * to register the responses on a custom path
 */

@Controller("/pass")
export default class ExtendedLogController extends v1.Log.Controller {
	constructor(service: v1.Log.Service) {
		super(service);
	}
}
