import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { AnimeClient } from "@tutkli/jikan-ts";
import { prisma } from "../../db";
import { formatAnime } from "../../utils/formatAnime";
import { TRPCClientError } from "@trpc/client";
import { formatAnimeSearch } from "../../utils/formatAnimeSearch";

const animeClient = new AnimeClient();

export const animeRouter = createTRPCRouter({
  getAnimeById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      let anime = await prisma.anime.findUnique({
        where: { id: input.id },
      });
      if (!anime) {
        try {
          console.log("🟡 fetched from the anime API");
          const { data } = await animeClient.getAnimeById(parseInt(input.id));
          anime = formatAnime(data);
          await prisma.anime.create({ data: anime });
        } catch (error) {
          throw new TRPCClientError("This ID doesn't match an existing anime");
        }
      }
      return anime;
    }),
  searchAnime: publicProcedure
    .input(
      z.object({
        keyword: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { data } = await animeClient.getAnimeSearch({
        q: input.keyword,
      });
      return formatAnimeSearch(data);
    }),
});
