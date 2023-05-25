import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../components/ui/Button";
import { api } from "../utils/api";

const Home: NextPage = () => {
  return <AuthShowcase />;
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data } = api.anime.getAnimeById.useQuery({ id: "1" });

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-white">
      <p className="text-center text-2xl">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      {data?.genres}
      <Button
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
};
