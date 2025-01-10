import { Injectable } from "@intentjs/core";
import { ServiceMethodNotReplacedError } from "../../ServiceMethodNotReplaced.js";

@Injectable()
export class LogService {
	/**
	 * This method **must** get overridden when using this service, like
	 * below:
	 *
	 * @example
	 *
	 * ```js
	 * this.bindWithValue(LogService, {
	 *		onIncomingLogs(
	 *			logs: string[]
	 *		): void {
	 *			...
	 *		}
	 * })
	 * ```
	 *
	 * @param {string[]} _logs
	 *
	 * @see https://developer.apple.com/documentation/walletpasses/log_a_message
	 */
	public onIncomingLogs(_logs: string[]): void {
		throw new ServiceMethodNotReplacedError("onIncomingLogs", "log/service");
	}
}
