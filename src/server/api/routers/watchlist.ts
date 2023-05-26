import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import type { Prisma, PrismaClient } from "@prisma/client";

const getUserWatchlist = async (
  userId: string,
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
) => {
  let watchlist = await prisma.watchlist.findUnique({
    where: { userId },
    include: { anime: true },
  });
  if (!watchlist) {
    watchlist = await prisma.watchlist.create({
      data: { userId },
      include: { anime: true },
    });
  }
  return watchlist;
};

export const watchlistRouter = createTRPCRouter({
  getWatchlist: privateProcedure.query(async ({ ctx }) => {
    const watchlist = await ctx.prisma.watchlist.findUnique({
      where: { userId: ctx.session.user.id },
      include: { anime: true },
    });
    if (!watchlist) throw new Error("No watchlist");
    return watchlist;
  }),
  addAnime: privateProcedure
    .input(
      z.object({
        animeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const watchlist = await getUserWatchlist(ctx.session.user.id, ctx.prisma);

      const animeExists = watchlist.anime.find(
        (anime) => anime.id === input.animeId
      );
      if (animeExists) {
        throw new Error("Anime already exists in the watchlist");
      }

      await ctx.prisma.watchlist.update({
        where: { id: watchlist.id },
        data: { anime: { connect: { id: input.animeId } } },
      });
      return true;
    }),
  removeAnime: privateProcedure
    .input(
      z.object({
        animeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const watchlist = await getUserWatchlist(ctx.session.user.id, ctx.prisma);

      const animeExists = watchlist.anime.find(
        (anime) => anime.id === input.animeId
      );
      if (!animeExists) {
        throw new Error("Anime doesn't exist in the watchlist");
      }

      await ctx.prisma.watchlist.update({
        where: { id: watchlist.id },
        data: { anime: { disconnect: { id: input.animeId } } },
      });
      return true;
    }),
});
