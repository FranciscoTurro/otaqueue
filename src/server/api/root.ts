import { createTRPCRouter } from "~/server/api/trpc";
import { animeRouter } from "./routers/anime";
import { watchlistRouter } from "./routers/watchlist";

export const appRouter = createTRPCRouter({
  anime: animeRouter,
  watchlist: watchlistRouter,
});

export type AppRouter = typeof appRouter;
