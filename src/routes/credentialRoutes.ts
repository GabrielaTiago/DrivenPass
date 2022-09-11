import { Router } from "express";
import { createCredential,
         deleteCredentials,
         getAllCredentials,
         getCredentialById } from "../controllers/credentialsController";
import { validateSchemas } from "../middlewares/validateSchemasMiddleware";
import { validatetoken } from "../middlewares/validateTokenMiddleware";

const credentialRouter = Router();

credentialRouter.post("/credentials", validateSchemas("credential"), validatetoken, createCredential);
credentialRouter.get("/credentials/all", validatetoken,getAllCredentials );
credentialRouter.get("/credentials/:id", validatetoken, getCredentialById);
credentialRouter.delete("/credentials/:id/delete", validatetoken, deleteCredentials );

export { credentialRouter };