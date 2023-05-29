import type { NextPage, GetStaticProps } from "next";
import { generateServerSideHelper } from "../../server/utils/serverSideHelper";
import { api } from "../../utils/api";
import Head from "next/head";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { WatchlistButtons } from "../../components/WatchlistButtons";

const AnimePage: NextPage<{ id: string }> = ({ id }) => {
  const {
    data: animeData,
    error: animeError,
    isLoading: animeLoading,
  } = api.anime.getAnimeById.useQuery({ id }, { refetchOnWindowFocus: false });

  if (animeError) return <div>{animeError.message}</div>;

  if (animeLoading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );

  return (
    <>
      <Head>
        <title>{`${animeData?.title ?? ""} - Otaqueue`}</title>
      </Head>
      <WatchlistButtons animeId={id} />
      <div>{animeData?.engTitle}</div>
      <div>{animeData.synopsis}</div>
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
