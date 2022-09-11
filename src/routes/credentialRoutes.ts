import { Router } from "express";
import { validateSchemas } from "../middlewares/validateSchemasMiddleware";

const credentialRouter = Router();

credentialRouter.post("/credentials", validateSchemas("credential"));
credentialRouter.get("/credentials/all");
credentialRouter.get("/credentials/:id");
credentialRouter.delete("/credentials/:id/delete");

export { credentialRouter };