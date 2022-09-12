import { NextFunction, Request, Response } from "express"
import { IErrors } from "../interfaces/errorsInterface";
import { ERRORS, ErrorsTypes } from "../types/errorsType";

function errorHandler(
    err: IErrors,
    _req: Request,
    res: Response,
    _next: NextFunction) {

    const { type, error_message } = err;
    const statusCode = ERRORS[type];

    if(statusCode) {
        return res.status(statusCode).send(error_message);
    }
    return res.status(500).send(err.message);
}

function throwErrorMessage(type: ErrorsTypes, error_message: string | string[]){
    throw { type, error_message };
}

export { errorHandler, throwErrorMessage };