/// <reference types="node" />

/**
 * index.js barrel file imports
 */

const {
	v1: {
		ListEndpoint: IBListEndpoint,
		LogEndpoint: IBLogEndpoint,
		RegisterEndpoint: IBRegisterEndpoint,
		UnregisterEndpoint: IBUnregisterEndpoint,
		UpdateEndpoint: IBUpdateEndpoint,
		getAuthorizationToken: IBgetAuthorizationToken,
		isAuthorizationSchemeValid: IBisAuthorizationSchemeValid,
	},
} = require("passkit-webservice-toolkit");

/**
 * V1 Entrypoint tests
 */

const {
	ListEndpoint: V1ListEndpoint,
} = require("passkit-webservice-toolkit/v1");
const { LogEndpoint: V1LogEndpoint } = require("passkit-webservice-toolkit/v1");
const {
	RegisterEndpoint: V1RegisterEndpoint,
} = require("passkit-webservice-toolkit/v1");
const {
	UnregisterEndpoint: V1UnregisterEndpoint,
} = require("passkit-webservice-toolkit/v1");
const {
	UpdateEndpoint: V1UpdateEndpoint,
} = require("passkit-webservice-toolkit/v1");
const {
	getAuthorizationToken: V1getAuthorizationToken,
	isAuthorizationSchemeValid: V1isAuthorizationSchemeValid,
} = require("passkit-webservice-toolkit/v1");

/**
 * Direct imports
 */

const { ListEndpoint } = require("passkit-webservice-toolkit/v1/list.js");
const { LogEndpoint } = require("passkit-webservice-toolkit/v1/log.js");
const {
	RegisterEndpoint,
} = require("passkit-webservice-toolkit/v1/register.js");
const {
	UnregisterEndpoint,
} = require("passkit-webservice-toolkit/v1/unregister.js");
const { UpdateEndpoint } = require("passkit-webservice-toolkit/v1/update.js");
const {
	getAuthorizationToken,
	isAuthorizationSchemeValid,
} = require("passkit-webservice-toolkit/v1/utils/auth.js");
