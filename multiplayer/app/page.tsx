import { SignIn } from "@/components/sign-in";
import { getUser } from "@/auth/auth-guard";
import { Logout } from "@/components/logout";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
