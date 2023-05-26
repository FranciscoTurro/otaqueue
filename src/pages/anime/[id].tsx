import type { NextPage, GetStaticProps } from "next";
import { generateServerSideHelper } from "../../server/utils/serverSideHelper";
import { api } from "../../utils/api";
import Head from "next/head";

const AnimePage: NextPage<{ id: string }> = ({ id }) => {
  const { data: animeData } = api.anime.getAnimeById.useQuery({ id });

  if (!animeData) {
    return <div>Error!</div>; //unsure if this is enough error handling. i would like to make it clear that certain IDs dont match any anime
  }

  return (
    <>
      <Head>
        <title>{`${animeData.title ?? ""} - Otaqueue`}</title>
      </Head>

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
