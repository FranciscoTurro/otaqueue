/* eslint-disable @typescript-eslint/no-misused-promises */
import { TextInput } from "./ui/TextInput";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";

//put all the names on the api in the DB? add that to the cache on page load
//and have a suggestions search bar? that'd be sick
//When you want to do it yourself, I strongly advise using a database for
//your search index and not implementing the search with the array filter
//function. Using a database will scale a lot better. The main difference is
//that instead of iterating over an array, you create a SQL query with the
//search input (something like SELECT * from search where searchTerm like %1.
type Input = {
  keyword: string;
};

export const SearchBar = ({}) => {
  const router = useRouter();

  const { register, handleSubmit, reset: resetForm } = useForm<Input>();

  const onSubmit: SubmitHandler<Input> = (data) => {
    resetForm();
    const encodedKeyword = encodeURIComponent(data.keyword).replace(
      /%20/g,
      "_"
    );
    void router.push(`/search/${encodedKeyword}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput className="bg-red-50 text-black" {...register("keyword")} />
      </form>
    </div>
  );
};
