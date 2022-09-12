import { Router } from "express";

const wifiRouter = Router();

wifiRouter.post("/wifis");
wifiRouter.get("/wifis/all");
wifiRouter.get("/wifis/:id");
wifiRouter.delete("/wifis/:id/delete");

export { wifiRouter };