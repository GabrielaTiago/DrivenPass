import { NextFunction, Request, Response } from "express"
import { IErrors } from "../interfaces/errorsInterface";
import { ERRORS, ErrorsTypes } from "../types/erros";

export default function errorHandler(
    err: IErrors,
    _req: Request,
    res: Response,
    _next: NextFunction) {
    
    const type = err.type;
    let statusCode = ERRORS[type];

    if(type) {
        return res.status(statusCode).send(err.error_message);
    }

    return res.status(500).send(err.message);
}

export function throwErrorMessage(type: ErrorsTypes, err:string){
    return { type: type, error_message: err };
}