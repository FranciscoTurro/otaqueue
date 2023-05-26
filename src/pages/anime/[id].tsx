import type { NextPage, GetStaticProps } from "next";
import { generateServerSideHelper } from "../../server/utils/serverSideHelper";
import { api } from "../../utils/api";
import Head from "next/head";

const AnimePage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.anime.getAnimeById.useQuery({ id });

  return (
    <>
      <Head>
        <title>{`${data?.title ?? ""} - Otaqueue`}</title>
      </Head>
      <div>{data?.synopsis}</div>
    </>
  );
};
//THROW AN ERROR IF THE ID DOESNT MATCH AN ANIME

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
