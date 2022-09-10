import { ErrorsTypes } from "../types/erros";

export interface IErrors extends Error {
    type : ErrorsTypes;
    error_message: string | string[];
}