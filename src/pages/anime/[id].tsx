import type { NextPage, GetStaticProps } from "next";
import { generateServerSideHelper } from "../../server/utils/serverSideHelper";
import { api } from "../../utils/api";
import Head from "next/head";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { WatchlistButtons } from "../../components/WatchlistButtons";
import { Layout } from "../../components/Layout";
import Image from "next/image";
import { Badge } from "../../components/ui/Badge";

const AnimePage: NextPage<{ id: string }> = ({ id }) => {
  const {
    data: animeData,
    error: animeError,
    isLoading: animeLoading,
  } = api.anime.getAnimeById.useQuery(
    { id },
    { refetchOnWindowFocus: false, retry: false }
  );

  if (animeError)
    return (
      <Layout>
        <div className="flex justify-center pt-20">
          <p>{animeError.message}</p>
        </div>
      </Layout>
    );

  if (animeLoading)
    return (
      <Layout>
        <div className="flex justify-center pt-20">
          <LoadingSpinner />
        </div>
      </Layout>
    );

  const studios = JSON.parse(animeData.studios) as string[];
  const genres = JSON.parse(animeData.genres) as string[];

  return (
    <>
      <Head>
        <title>{`${animeData?.title ?? ""} - Otaqueue`}</title>
      </Head>
      <Layout>
        <div className="flex flex-col gap-5">
          <h1 className="text-center text-3xl font-bold">{animeData.title}</h1>
          <div className="flex flex-col gap-4 pl-4 pr-2">
            <div className="flex gap-4 ">
              <Image
                src={animeData.pictureURL}
                alt={`${animeData.title} illustration`}
                className="rounded"
                width={140}
                height={0}
                quality={100}
              />
              <div className="flex flex-col gap-1">
                <WatchlistButtons animeId={id} />
                <div className="flex gap-1">
                  <p className="font-bold text-red-600">Japanese:</p>
                  <p>{animeData.japTitle}</p>
                </div>
                <div className="flex gap-1">
                  <p className="font-bold text-red-600">English:</p>
                  <p>{animeData.engTitle}</p>
                </div>
                <div className="flex gap-1">
                  <p className="font-bold text-red-600">Episodes:</p>
                  <p>{animeData.episodes}</p>
                </div>
                <div className="flex gap-1">
                  <p className="font-bold text-red-600">Studios:</p>
                  {studios.map((studio) => (
                    <p key={studio}>{studio}</p>
                  ))}
                </div>
                <div className="flex gap-1">
                  <p className="font-bold text-red-600">Score:</p>
                  <p>{animeData.score} / 10</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                <p className="font-bold text-red-600">Type:</p>
                <p>{animeData.type}</p>
              </div>
              <div className="flex gap-1">
                <p className="font-bold text-red-600">Popularity:</p>
                <p>#{animeData.popularity}</p>
              </div>
              <div className="flex gap-1">
                <p className="font-bold text-red-600">Year released:</p>
                <p>{animeData.year}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                <p className="font-bold text-red-600">Genres:</p>
                {genres.map((genre) => (
                  <Badge key={genre}>{genre}</Badge> //make each of these a link to search by genre only? let users search by genre and let them mix them, search for horror and comedy
                ))}
              </div>
              <div>
                <p className="font-bold text-red-600">Synopsis:</p>
                <p className="text-sm">{animeData.synopsis}</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = generateServerSideHelper();

  const id = context.params?.id;
  if (typeof id !== "string") throw new Error("No ID");

  await helpers.anime.getAnimeById.prefetch({ id }); //caches the fetch

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" }; //??
};

export default AnimePage;
