import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { AnimeClient } from "@tutkli/jikan-ts";
import { prisma } from "../../db";
import { formatAnime } from "../../utils/formatAnime";

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
        console.log("🟡 fetched from the anime API");
        const { data } = await animeClient.getAnimeById(parseInt(input.id));
        anime = formatAnime(data);
        await prisma.anime.create({ data: anime });
      }
      return anime;
    }),
  //to search for anime can't have an autocompletion search bar
  //let the user search and then have a page where you show all the
  //results from getAnimeSearch
});
