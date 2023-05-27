import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import type { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const getUserWatchlist = async (
  userEmail: string,
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
) => {
  let watchlist = await prisma.watchlist.findUnique({
    where: { userEmail },
    include: { anime: true },
  });
  if (!watchlist) {
    watchlist = await prisma.watchlist.create({
      data: { userEmail },
      include: { anime: true },
    });
  }
  return watchlist;
};

export const watchlistRouter = createTRPCRouter({
  getCurrentUserWatchlist: privateProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.email) throw new TRPCError({ code: "NOT_FOUND" });
    const watchlist = await ctx.prisma.watchlist.findUnique({
      where: { userEmail: ctx.session.user.email },
      include: { anime: true },
    });
    if (!watchlist) throw new Error("No watchlist");
    return watchlist;
  }),
  getWatchlistByUserEmail: publicProcedure
    .input(
      z.object({
        userEmail: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const watchlist = await ctx.prisma.watchlist.findUnique({
        where: { userEmail: input.userEmail },
        include: { anime: true },
      });

      if (!watchlist) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return watchlist;
    }),
  addAnime: privateProcedure
    .input(
      z.object({
        animeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.email) throw new TRPCError({ code: "NOT_FOUND" });

      const watchlist = await getUserWatchlist(
        ctx.session.user.email,
        ctx.prisma
      );
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
      if (!ctx.session.user.email) throw new TRPCError({ code: "NOT_FOUND" });

      const watchlist = await getUserWatchlist(
        ctx.session.user.email,
        ctx.prisma
      );

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
