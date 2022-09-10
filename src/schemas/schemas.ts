import { ISchemas } from "../interfaces/schemasInterface";
import { authSchema } from "./authSchema";

const schemas: ISchemas = {
    "auth": authSchema
};

export { schemas };