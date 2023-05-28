import type { NextPage, GetStaticProps } from "next";
import { generateServerSideHelper } from "../../server/utils/serverSideHelper";
import { api } from "../../utils/api";
import Head from "next/head";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

const AnimePage: NextPage<{ id: string }> = ({ id }) => {
  const {
    data: animeData,
    error,
    isLoading,
  } = api.anime.getAnimeById.useQuery({ id }, { refetchOnWindowFocus: false });

  if (error) return <div>{error.message}</div>;

  if (isLoading)
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

      <div>{animeData?.genres}</div>
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
