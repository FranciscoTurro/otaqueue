import type { PropsWithChildren } from "react";
import { SearchBar } from "./SearchBar";

export const Layout = (props: PropsWithChildren) => {
  return (
    <main className="overflow-none flex h-screen justify-center">
      <div className="flex h-full w-full flex-col border-x border-siteBorders md:max-w-5xl">
        <SearchBar />
        {props.children}
      </div>
    </main>
  );
};
