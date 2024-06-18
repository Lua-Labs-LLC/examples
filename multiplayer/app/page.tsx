import { Resource } from "sst";
import Chat from "@/components/chat";
import { SignIn } from "@/components/sign-in";
import { getUser } from "@/auth/auth-guard";
import { Logout } from "@/components/logout";
import { CreateGame } from "@/components/create-game";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const topic = "sst-chat";

export default async function Home() {
  const { userId } = await getUser();

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <h1 className="text-7xl uppercase">Multiplayer</h1>
      {!userId && <SignIn></SignIn>}
      {userId && (
        <>
          <Link href="/games">
            <Button variant="outline">View Games</Button>
          </Link>
          <Logout></Logout>
        </>
      )}
    </div>
  );
}
