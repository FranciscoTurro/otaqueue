import type { Anime as JikanResponse } from "@tutkli/jikan-ts";

export const formatAnimeSearch = (animeArray: JikanResponse[]) => {
  return animeArray.map((anime) => {
    return {
      id: anime.mal_id,
      image: anime.images.jpg.small_image_url ?? anime.images.jpg.image_url,
      title: anime.title_english ?? anime.title_japanese,
      type: anime.type,
      episodes: anime.episodes,
      score: anime.score,
    };
  });
};
