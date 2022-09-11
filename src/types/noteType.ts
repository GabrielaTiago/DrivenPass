import { Note } from "@prisma/client";

export type noteData = Omit<Note, "id" | "createdAt">;