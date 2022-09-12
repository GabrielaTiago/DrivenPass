import { Wifi } from "@prisma/client";

export type WifiData = Omit<Wifi, "id" | "userId" | "createdAt">