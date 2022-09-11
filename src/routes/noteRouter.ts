import { Router } from "express";
import { createNote, deleteNote, getNoteById, getUserNotes } from "../controllers/notesController";


const noteRouter = Router();

noteRouter.post("/notes", createNote);
noteRouter.get("/notes/all", getUserNotes);
noteRouter.get("/notes/:id", getNoteById);
noteRouter.delete("/notes/:id/delete", deleteNote);

export { noteRouter };