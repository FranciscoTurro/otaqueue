import type { NextPage, GetStaticProps } from "next";
import { generateServerSideHelper } from "../../server/utils/serverSideHelper";
import { api } from "../../utils/api";
import Head from "next/head";

const WatchlistPage: NextPage<{ email: string }> = ({ email }) => {
  const { data } = api.watchlist.getWatchlistByUserEmail.useQuery({
    userEmail: email,
  });

  if (!data) {
    return <div className="flex w-full justify-center">error!</div>;
  }
  return (
    <>
      <Head>
        <title>{`${email ?? ""}'s watchlist - Otaqueue`}</title>
      </Head>
      <div>
        {data.anime.map((anime) => (
          <div key={anime.id}>{anime.engTitle}</div>
        ))}
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = generateServerSideHelper();

  const email = context.params?.email;
  if (typeof email !== "string") throw new Error("No email");

  await helpers.watchlist.getWatchlistByUserEmail.prefetch({
    userEmail: email,
  });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      email,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" }; //??
};

export default WatchlistPage;
