//this whole page's code feels like a war crime against programming. just hacked at it until it worked. will refactor at some point
import type { NextPage } from "next";
import { api } from "../../utils/api";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Layout } from "../../components/Layout";

const SearchPage: NextPage<{ keyword: string }> = ({ keyword }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = api.anime.searchAnime.useQuery({
    keyword,
    page: currentPage,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  if (isLoading) return <LoadingSpinner />;

  const pages = Array.from(
    { length: data?.pagination?.last_visible_page ?? 1 },
    (foo, index) => index + 1
  );

  return (
    <Layout>
      <div className="text-2xl font-bold text-red-600">
        currently on page {currentPage}
      </div>
      <div className="flex flex-col">
        {data?.anime.map((anime) => (
          <Link href={`/anime/${anime.id}`} key={anime.id}>
            {anime.title}
          </Link>
        ))}
      </div>
      <div className="flex gap-10">
        {pages.map((page) => (
          <button
            className="bg-red-50 text-black"
            key={page}
            disabled={currentPage === page}
            onClick={() => {
              setCurrentPage(page);
            }}
          >
            {page}
          </button>
        ))}
      </div>
    </Layout>
  );
};

SearchPage.getInitialProps = (context) => {
  const keyword = context.query.keyword;
  if (typeof keyword !== "string") throw new Error("bad word");
  const decodedWord = decodeURIComponent(keyword).replace(/_/g, " ");
  return { keyword: decodedWord };
};

export default SearchPage;
