/* eslint-disable @typescript-eslint/no-misused-promises */
import { TextInput } from "./ui/TextInput";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { IconNotes, IconHome } from "@tabler/icons-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

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

export const SearchBar = () => {
  const router = useRouter();

  const { data: userData } = useSession();

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
    <div className="flex gap-3 px-5 py-2">
      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput placeholder="Search for anime!" {...register("keyword")} />
        </form>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Link href={"/"}>
          <IconHome size={36} />
        </Link>
        {userData ? (
          <Link href={`/watchlist/${userData.user.email ?? ""}`}>
            <IconNotes size={36} />
          </Link>
        ) : null}
      </div>
    </div>
  );
};
