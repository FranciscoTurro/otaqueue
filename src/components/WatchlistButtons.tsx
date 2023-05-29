import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import { Button } from "./ui/Button";
import { LoadingSpinner } from "./ui/LoadingSpinner";

interface WatchlistButtonsProps {
  animeId: string;
}

export const WatchlistButtons: React.FC<WatchlistButtonsProps> = ({
  animeId,
}) => {
  const { data: sessionData } = useSession();

  const context = api.useContext();

  const { data, isLoading: getWatchlistLoading } =
    api.watchlist.getCurrentUserWatchlist.useQuery();

  const { mutate: addMutate, isLoading: addLoading } =
    api.watchlist.addAnime.useMutation({
      onSuccess: () => {
        void context.watchlist.getCurrentUserWatchlist.invalidate();
      },
    });

  const { mutate: removeMutate, isLoading: removeLoading } =
    api.watchlist.removeAnime.useMutation({
      onSuccess: () => {
        void context.watchlist.getCurrentUserWatchlist.invalidate();
      },
    });

  const animeExists = data?.anime.find((anime) => anime.id === animeId);

  if (getWatchlistLoading) return <LoadingSpinner />;

  if (!sessionData?.user)
    return (
      <Button
        className="w-36"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        Sign in
      </Button>
    );

  if (animeExists) {
    return (
      <Button
        className="w-36"
        disabled={removeLoading}
        onClick={() => {
          removeMutate({ animeId });
        }}
      >
        Remove from list
      </Button>
    );
  } else {
    return (
      <Button
        className="w-36"
        disabled={addLoading}
        onClick={() => {
          addMutate({ animeId });
        }}
      >
        Add to list
      </Button>
    );
  }
};
