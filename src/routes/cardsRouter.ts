import { Router } from "express";
import { createCard } from "../controllers/cardsController";
import { validateSchemas } from "../middlewares/validateSchemasMiddleware";
import { validatetoken } from "../middlewares/validateTokenMiddleware";


const cardsRouter = Router();

cardsRouter.post("/cards", validateSchemas("card"), validatetoken, createCard);
cardsRouter.get("/cards/all");
cardsRouter.get("/cards/:id");
cardsRouter.delete("cards/:id/delete");

export { cardsRouter };