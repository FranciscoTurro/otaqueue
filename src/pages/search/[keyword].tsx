import type { NextPage } from "next";
import { api } from "../../utils/api";

const SearchPage: NextPage<{ keyword: string }> = ({ keyword }) => {
  const { data } = api.anime.searchAnime.useQuery({ keyword });
  //see how to do all that shingeki+no+kyojin on the url
  //PAGINATION LAD

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
  return { keyword };
};

export default SearchPage;
