import Fastify from "fastify";
import { networkInterfaces } from "node:os";
import fs from "node:fs";

import passKit from "passkit-generator";
const { PKPass } = passKit;

/**
 * @type {Record<string, { address: string }[]>}
 */

const IPV4Interfaces = {};

for (const [ifName, netIf] of Object.entries(networkInterfaces())) {
	if (!netIf?.length) {
		continue;
	}

	for (let i = 0; i < netIf.length; i++) {
		const netInterface = netIf[i];
		const isIPv4 = netInterface.family == "IPv4";
		const isLoopback = netInterface.address === "127.0.0.1";

		const isSuitable = isIPv4 && !isLoopback && !netInterface.internal;

		if (isSuitable) {
			IPV4Interfaces[ifName] = IPV4Interfaces[ifName] || [];
			IPV4Interfaces[ifName].push(netInterface);
		}
	}
}

export const fastifyInstance = Fastify({
	logger: true,
});

fastifyInstance.get("/health", (_, reply) => {
	return reply.code(200).send({ status: "OK" });
});

/**
 * @type {Record<string, string>}
 */

const AIRPORTS = {
	VCE: "Venice Marco Polo Airport",
	AMS: "Amsterdam Airport Schipol",
	MUC: "Munich Airport",
	FRA: "Frankfurt Airport",
	LAX: "Los Angeles International Airport",
	DXB: "Dubai International Airport",
	IAD: "Dulles International Airport",
	HND: "Haneda Airport",
	LHR: "Heathrow Airport",
	MEL: "Melbourne Airport",
	ZRH: "Zurich Airport",
};

/**
 * @param {string} [current]
 * @returns {string}
 */

function getRandomAirport(current = "") {
	const list = Object.keys(AIRPORTS);

	let selected = current;

	while (selected === current || !selected) {
		selected = list[Math.floor(Math.random() * (list.length - 0 + 1) + 0)];
	}

	return selected;
}

let lastUpdate = Date.now();

/**
 * @param {object} [modifications]
 * @return {Promise<passKit.PKPass>}
 */

async function createPass(
	modifications,
	serialNumber = String(Math.random() * 100),
) {
	const pass = await PKPass.from(
		{
			model: "../../../passkit-generator/examples/models/exampleBooking.pass",
			certificates: {
				signerCert: fs.readFileSync(
					"../../../passkit-generator/certificates/signerCert.pem",
				),
				signerKey: fs.readFileSync(
					"../../../passkit-generator/certificates/signerKey.pem",
				),
				wwdr: fs.readFileSync(
					"../../../passkit-generator/certificates/WWDRG4.pem",
				),
				signerKeyPassphrase: "123456",
			},
		},
		{
			serialNumber,
			webServiceURL: `http://${
				Object.entries(IPV4Interfaces)[0][1][0].address
			}:3500`,
			authenticationToken: "mimmomimmoqgeqwyidukqq",
			voided: false,
			...modifications,
		},
	);

	pass.transitType = "PKTransitTypeAir";

	const departureAirport = getRandomAirport();
	const arrivalAirport = getRandomAirport(departureAirport);

	pass.primaryFields.push({
		key: "Departure",
		label: AIRPORTS[departureAirport],
		value: departureAirport,
	});

	pass.primaryFields.push({
		key: "Destination",
		label: AIRPORTS[arrivalAirport],
		value: arrivalAirport,
		changeMessage: "Destination airport changed to %@",
	});

	pass.setExpirationDate(null);
	pass.setRelevantDate(null);
	pass.setLocations(null);

	return pass;
}

fastifyInstance.get("/testpass", async (_, reply) => {
	const pass = await createPass();

	lastUpdate = Date.now();

	reply.header("Content-Type", pass.mimeType);
	reply.header("Content-Disposition", `attachment; filename="pass.pkpass"`);
	reply.header("Last-Modified", new Date().toUTCString());
	reply.code(200);
	reply.send(pass.getAsBuffer());
});

fastifyInstance.addHook("onRoute", (routeOptions) => {
	console.log("Added new route:", routeOptions.method, routeOptions.url);
});

fastifyInstance.listen(
	{ port: 3500, host: "0.0.0.0" },
	function (err, address) {
		if (err) {
			fastifyInstance.log.error(err);
			process.exit(1);
		}

		console.log(`Listening on ${address}`);
	},
);

fastifyInstance.register(import("fastify-passkit-webservice/v1/log.js"), {
	/**
	 * @param {string[]} logs
	 */

	onIncomingLogs(logs) {
		console.log("RECEIVED LOGS:", logs);
	},
});

fastifyInstance.register(
	import("fastify-passkit-webservice/v1/registration.js"),
	{
		async onRegister(
			deviceLibraryIdentifier,
			passTypeIdentifier,
			serialNumber,
		) {
			console.log(
				"RECEIVED REGISTER REQUEST",
				deviceLibraryIdentifier,
				passTypeIdentifier,
				serialNumber,
			);

			return true;
		},
		async onUnregister(
			deviceLibraryIdentifier,
			passTypeIdentifier,
			serialNumber,
		) {
			console.log(
				"RECEIVED UN-REGISTER REQUEST",
				deviceLibraryIdentifier,
				passTypeIdentifier,
				serialNumber,
			);
		},
		async tokenVerifier(token) {
			console.log("Verifying token", token);
			return true;
		},
	},
);

fastifyInstance.register(import("fastify-passkit-webservice/v1/list.js"), {
	async onListRetrieve(
		deviceLibraryIdentifier,
		passTypeIdentifier,
		{ passesUpdatedSince },
	) {
		console.log(
			"RECEIVED LIST REQUEST",
			deviceLibraryIdentifier,
			passTypeIdentifier,
			passesUpdatedSince,
		);

		return {
			serialNumbers: ["askdfgas"],
			lastUpdated: `${Date.now()}`,
		};
	},
});

fastifyInstance.register(import("fastify-passkit-webservice/v1/update.js"), {
	async onUpdateRequest(
		passTypeIdentifier,
		serialNumber,
		modifiedSinceTimestamp,
	) {
		console.log(
			"RECEIVED UPDATE REQUEST",
			passTypeIdentifier,
			serialNumber,
			modifiedSinceTimestamp,
		);

		if (modifiedSinceTimestamp) {
			console.log(new Date(modifiedSinceTimestamp), new Date(lastUpdate));
		}

		if (modifiedSinceTimestamp && modifiedSinceTimestamp >= lastUpdate) {
			console.log("modifiedSinceTimestamp >= lastUpdate");
			return undefined;
		}

		const pass = await createPass(
			{
				voided: true,
				passTypeIdentifier,
			},
			serialNumber,
		);

		return pass.getAsBuffer();
	},
	async tokenVerifier(token) {
		console.log("Verifying token", token);
		return true;
	},
});
