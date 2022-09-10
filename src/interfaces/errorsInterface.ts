import { ErrorsTypes } from "../types/errors";

export interface IErrors extends Error {
    type : ErrorsTypes;
    error_message: string | string[];
}