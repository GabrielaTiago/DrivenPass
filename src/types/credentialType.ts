import { Credential } from "@prisma/client";

export type credentialData = Omit<Credential, "id" | "createdAt">;