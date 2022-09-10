import { ISchemas } from "../interfaces/schemasInterface";
import { authSchema } from "./authSchema";

const schemas: ISchemas = {
    "user": authSchema
};

export { schemas };