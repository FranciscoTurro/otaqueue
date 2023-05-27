import { createTRPCRouter } from "~/server/api/trpc";
import { animeRouter } from "./routers/anime";
import { watchlistRouter } from "./routers/watchlist";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  anime: animeRouter,
  watchlist: watchlistRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
