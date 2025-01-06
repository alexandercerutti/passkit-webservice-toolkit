import { networkInterfaces } from "node:os";
import fs from "node:fs";
import path from "node:path";
import { PKPass, type OverridablePassProps } from "passkit-generator";
console.log("DIRNAME", __dirname);

const intentPluginPackageRoot = path.resolve(__dirname, "../../../..");
const workspaceRoot = path.resolve(intentPluginPackageRoot, "../..");
const passkitGeneratorProjectRoot = path.resolve(
	workspaceRoot,
	"../passkit-generator",
);

const IPV4Interfaces: Record<string, { address: string }[]> = {};

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
} as const;

function getRandomAirport(current: string = "") {
	const list = Object.keys(AIRPORTS);

	let selected = current;

	while (selected === current || !selected) {
		selected = list[Math.floor(Math.random() * (list.length - 0 + 1) + 0)];
	}

	return selected;
}

export async function createPass(
	modifications?: OverridablePassProps,
	serialNumber = String(Math.random() * 100),
) {
	const pass = await PKPass.from(
		{
			model: `${passkitGeneratorProjectRoot}/examples/models/exampleBooking.pass`,
			certificates: {
				signerCert: fs.readFileSync(
					`${passkitGeneratorProjectRoot}/certificates/nfc/signerCert.pem`,
				),
				signerKey: fs.readFileSync(
					`${passkitGeneratorProjectRoot}/certificates/nfc/signerKey.pem`,
				),
				wwdr: fs.readFileSync(
					`${passkitGeneratorProjectRoot}/certificates/WWDRG4.pem`,
				),
				signerKeyPassphrase: "123456",
			},
		},
		{
			serialNumber,
			webServiceURL: `http://${
				Object.entries(IPV4Interfaces)[0][1][0].address
			}:5001`,
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
