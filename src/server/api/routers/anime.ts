import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { AnimeClient } from "@tutkli/jikan-ts";
import { prisma } from "../../db";
import { createAnime } from "../../utils/createAnime";

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
        console.log("❌ fetched from the anime API");
        const { data } = await animeClient.getAnimeById(parseInt(input.id));
        anime = createAnime(data);
        await prisma.anime.create({ data: anime });
      }
      return anime;
    }),
  //to search for anime can't have an autocompletion search bar
  //let the user search and then have a page where you show all the
  //results from getAnimeSearch

  //when i add or remove an anime to watchlist, THERE i check if there is an
  //existing watchlist for that user. if there isnt i create one
  //watchlist gets its own router, with remove and add anime
});
