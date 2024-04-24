"use client";

import { Button } from "@repo/shared/components/ui/button";
import useServerAction from "@repo/shared/hooks/use-server-action";
import { logout } from "@repo/shared/server-actions/authentication/logout";

export const LoggedIn = () => {
  const { serverAction, isPending } = useServerAction();

  const handleLogout = async () => {
    try {
      await serverAction(logout);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Logout failed:", error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  return (
    <Button onClick={handleLogout}>
      {`Log${isPending ? "ing out..." : "out"}`}
    </Button>
  );
};
