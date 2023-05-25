import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { AnimeClient } from "@tutkli/jikan-ts";
import { prisma } from "../../db";
import { createAnime } from "../../utils/createAnime";

export const animeRouter = createTRPCRouter({
  getAnimeById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const animeClient = new AnimeClient();
      let anime = await prisma.anime.findUnique({
        where: { id: input.id },
      });
      if (!anime) {
        const { data } = await animeClient.getAnimeById(parseInt(input.id));
        anime = createAnime(data);
        await prisma.anime.create({ data: anime });
      }
      return anime;
    }),
});
//the genres and studios thing miserably failed
