import { NextFunction, Request, Response } from "express";
import { throwErrorMessage } from "./errorHandlerMiddleware";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


function validatetoken(req: Request, res: Response, next: NextFunction){
    const { authorization } = req.headers;

    const token = authorization?.replace("Bearer ", "");

    if (!token){
        throw throwErrorMessage("unauthorized", "Does not contain a valid token");
    }

    const validToken: any = jwt.verify(token, process.env.JWT_SECRET as string);

    res.locals.userId = validToken.id;

    next();
}

export { validatetoken };