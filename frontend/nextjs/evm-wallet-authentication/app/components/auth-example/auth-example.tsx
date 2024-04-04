import { getUser } from "@/auth/auth-guard"
import { LoggedIn } from "../logged-in/logged-in"
import { LoggedOut } from "../logged-out/logged-out"

export const AuthExample = async () => {
  const { userId } = await getUser()
  return userId ? <LoggedIn /> : <LoggedOut />
}
