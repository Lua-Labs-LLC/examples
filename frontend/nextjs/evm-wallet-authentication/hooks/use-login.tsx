import useServerAction from "@/hooks/use-server-action"
import { generateMessage } from "@/server-actions/authentication/generate-message"
import { login as serverLogin } from "@/server-actions/authentication/login"
import { useState } from "react"
import { useAccount, useSignMessage } from "wagmi"
export const useLogin = () => {
  const { serverAction } = useServerAction()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { isConnected, address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const login = async () => {
    setIsLoggingIn(true)
    try {
      if (isConnected && address) {
        const { token, message } = await serverAction(() =>
          generateMessage(address)
        )
        const signature = await signMessageAsync({
          message: message.message,
        })
        if (signature) {
          await serverAction(() => serverLogin(signature, token))
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login failed:", error.message)
      } else {
        console.error("An unknown error occurred")
      }
    } finally {
      setIsLoggingIn(false)
    }
  }
  return { isLoggingIn, login }
}
