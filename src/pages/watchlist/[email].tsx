import type { NextPage, GetStaticProps } from "next";
import { generateServerSideHelper } from "../../server/utils/serverSideHelper";
import { api } from "../../utils/api";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Layout } from "../../components/Layout";

const WatchlistPage: NextPage<{ email: string }> = ({ email }) => {
  const { data: sessionData } = useSession();

  const { data } = api.watchlist.getWatchlistByUserEmail.useQuery({
    userEmail: email,
  });

  if (!data) {
    return <div className="flex w-full justify-center">error!</div>;
  }

  return (
    <Layout>
      <Head>
        <title>{`${email}'s watchlist - Otaqueue`}</title>
      </Head>
      <div>
        {sessionData?.user.email === data.userEmail ? (
          <div>your wlist</div>
        ) : (
          <div>NOT your wlist</div>
        )}
        <div className="flex flex-col">
          {data.anime.map((anime) => (
            <Link href={`/anime/${anime.id}`} key={anime.id}>
              {anime.engTitle}
            </Link>
          ))}
        </div>
      </div>
    </Layout>
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
