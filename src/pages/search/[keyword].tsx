import type { NextPage } from "next";
import { api } from "../../utils/api";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

const SearchPage: NextPage<{ keyword: string }> = ({ keyword }) => {
  const { data, isLoading } = api.anime.searchAnime.useQuery({ keyword });
  //see how to do all that shingeki+no+kyojin on the url
  //PAGINATION LAD

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {data?.map((anime) => (
        <div key={anime.id}>{anime.title}</div>
      ))}
    </div>
  );
};

SearchPage.getInitialProps = (context) => {
  const keyword = context.query.keyword;
  if (typeof keyword !== "string") throw new Error("bad word");
  const decodedWord = decodeURIComponent(keyword).replace(/_/g, " ");
  return { keyword: decodedWord };
};

export default SearchPage;
