import { Router } from "express";
import { createWifi } from "../controllers/wifiController";
import { validateSchemas } from "../middlewares/validateSchemasMiddleware";
import { validatetoken } from "../middlewares/validateTokenMiddleware";

const wifiRouter = Router();

wifiRouter.post("/wifis", validateSchemas("wifi"), validatetoken, createWifi);
wifiRouter.get("/wifis/all");
wifiRouter.get("/wifis/:id");
wifiRouter.delete("/wifis/:id/delete");

export { wifiRouter };