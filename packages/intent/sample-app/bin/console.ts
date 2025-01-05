import {
	CommandMeta,
	CommandRunner,
	ContainerFactory,
	ConsoleLogger,
} from "@intentjs/core";
import yargs from "yargs-parser";
import "console.mute";
import { ApplicationContainer } from "../app/boot/container.js";

console["mute"]();
await ContainerFactory.createStandalone(ApplicationContainer);
console["resume"]();

const argv = yargs(process.argv.slice(2));
argv.command = argv._[0];

if (typeof argv.command != "string") {
	ConsoleLogger.error(" PLEASE ADD A COMMAND ");
	process.exit();
}

const command = CommandMeta.getCommand(argv.command);
if (!command || !command.target) {
	ConsoleLogger.error(` ${argv.command} : command not found `);
	process.exit();
}

await CommandRunner.handle(command, argv);
