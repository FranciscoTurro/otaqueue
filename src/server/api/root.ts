import { createTRPCRouter } from "~/server/api/trpc";
import { animeRouter } from "./routers/anime";

export const appRouter = createTRPCRouter({
  anime: animeRouter,
});

export type AppRouter = typeof appRouter;
