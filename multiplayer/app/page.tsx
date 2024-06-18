import { Resource } from "sst";
import Chat from "@/components/chat";
import { SignIn } from "@/components/sign-in";
import { getUser } from "@/auth/auth-guard";
import { Logout } from "@/components/logout";
const topic = "sst-chat";

export default async function Home() {
  const { userId } = await getUser();
  return (
    <main>
      <div>
        <Chat
          endpoint={Resource.MyRealtime.endpoint}
          authorizer={Resource.MyRealtime.authorizer}
          topic={`${Resource.App.name}/${Resource.App.stage}/${topic}`}
        />
      </div>
      {!userId && <SignIn></SignIn>}
      {userId && <Logout></Logout>}
    </main>
  );
}
