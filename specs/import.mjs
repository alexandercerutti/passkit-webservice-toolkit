/**
 * index.js barrel file imports
 */

import { v1 as IBv1 } from "passkit-webservice-toolkit";

const {
	ListEndpoint: IBListEndpoint,
	LogEndpoint: IBLogEndpoint,
	RegisterEndpoint: IBRegisterEndpoint,
	UnregisterEndpoint: IBUnregisterEndpoint,
	UpdateEndpoint: IBUpdateEndpoint,
	getAuthorizationToken: IBgetAuthorizationToken,
	isAuthorizationSchemeValid: IBisAuthorizationSchemeValid,
} = IBv1;

/**
 * V1 Entrypoint tests
 */

import { ListEndpoint as V1ListEndpoint } from "passkit-webservice-toolkit/v1";
import { LogEndpoint as V1LogEndpoint } from "passkit-webservice-toolkit/v1";
import { RegisterEndpoint as V1RegisterEndpoint } from "passkit-webservice-toolkit/v1";
import { UnregisterEndpoint as V1UnregisterEndpoint } from "passkit-webservice-toolkit/v1";
import { UpdateEndpoint as V1UpdateEndpoint } from "passkit-webservice-toolkit/v1";
import {
	getAuthorizationToken as V1getAuthorizationToken,
	isAuthorizationSchemeValid as V1isAuthorizationSchemeValid,
} from "passkit-webservice-toolkit/v1";

/**
 * Direct imports
 */

import { ListEndpoint } from "passkit-webservice-toolkit/v1/list.js";
import { LogEndpoint } from "passkit-webservice-toolkit/v1/log.js";
import { RegisterEndpoint } from "passkit-webservice-toolkit/v1/register.js";
import { UnregisterEndpoint } from "passkit-webservice-toolkit/v1/unregister.js";
import { UpdateEndpoint } from "passkit-webservice-toolkit/v1/update.js";
import {
	getAuthorizationToken,
	isAuthorizationSchemeValid,
} from "passkit-webservice-toolkit/v1/utils/auth.js";
