import type { Anime as JikanResponse } from "@tutkli/jikan-ts";
import type { Anime as AnimeType } from "@prisma/client";

const getYearFromAired = (aired: string): number => {
  const year = aired.split("-")[0];
  if (year) return parseInt(year);
  else return 9999;
};

export const formatAnime = (anime: JikanResponse): AnimeType => {
  const parsedGenres = JSON.stringify(anime.genres.map((genre) => genre.name));
  const parsedStudios = JSON.stringify(
    anime.studios.map((studio) => studio.name)
  );
  const cleanSynopsis = anime.synopsis
    .replace("[Written by MAL Rewrite]", "")
    .trim();

  return {
    id: anime.mal_id.toString(),
    japTitle: anime.title_japanese,
    episodes: anime.episodes,
    popularity: anime.popularity,
    score: anime.score,
    title: anime.title,
    type: anime.type,
    pictureURL: anime.images.jpg.image_url,
    engTitle: anime.title_english ?? anime.title_japanese,
    year: anime.year ?? getYearFromAired(anime.aired.from),
    synopsis: cleanSynopsis,
    genres: parsedGenres,
    studios: parsedStudios,
  };
};
