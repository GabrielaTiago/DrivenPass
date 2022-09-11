import { Router } from "express";


const noteRouter = Router();

noteRouter.post("/notes");
noteRouter.get("/notes/all");
noteRouter.get("/notes/:id");
noteRouter.delete("/notes/:id/delete");

export { noteRouter };