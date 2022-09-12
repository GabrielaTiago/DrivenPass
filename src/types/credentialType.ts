import { Credential } from "@prisma/client";

export type CredentialData = Omit<Credential, "id" | "userId" |"createdAt">;