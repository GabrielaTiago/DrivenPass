import { ISchemas } from "../interfaces/schemasInterface";
import { authSchema } from "./authSchema";
import { credentialSchema } from "./credentialSchema";

const schemas: ISchemas = {
    "auth": authSchema,
    "credential": credentialSchema
};

export { schemas };