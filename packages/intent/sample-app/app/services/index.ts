import { __, Injectable } from "@intentjs/core";

@Injectable()
export class IndexService {
	constructor() {}

	getHello(): string {
		return __("hello", { name: "Intent" });
	}
}
