import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../components/ui/Button";
import { Layout } from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <AuthShowcase />
    </Layout>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div>
      <p className="text-center text-2xl">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <Button
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
};
