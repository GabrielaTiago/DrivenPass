import { Router } from "express";


const cardsRouter = Router();

cardsRouter.post("/cards");
cardsRouter.get("/cards/all");
cardsRouter.get("/cards/:id");
cardsRouter.delete("cards/:id/delete");

export { cardsRouter };