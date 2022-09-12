import { ISchemas } from "../interfaces/schemasInterface";
import { authSchema } from "./authSchema";
import { cardSchema } from "./cardSchema";
import { credentialSchema } from "./credentialSchema";
import { noteSchema } from "./noteSchema";

const schemas: ISchemas = {
    "auth": authSchema,
    "credential": credentialSchema,
    "note": noteSchema,
    "card": cardSchema
};

export { schemas };