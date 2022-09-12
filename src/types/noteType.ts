import { Note } from "@prisma/client";

export type NoteData = Omit<Note, "id" | "userId" |"createdAt">;