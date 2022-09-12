import { Router } from "express";
import { createCard, getUserCards } from "../controllers/cardsController";
import { validateSchemas } from "../middlewares/validateSchemasMiddleware";
import { validatetoken } from "../middlewares/validateTokenMiddleware";


const cardsRouter = Router();

cardsRouter.post("/cards", validateSchemas("card"), validatetoken, createCard);
cardsRouter.get("/cards/all", validatetoken, getUserCards);
cardsRouter.get("/cards/:id");
cardsRouter.delete("cards/:id/delete");

export { cardsRouter };