"use client"

import { ConnectWalletDialog } from "@/components/shared/wagmi/components/connect-wallet-dialog"
import { Button } from "@/components/ui/button"
import { useLogin } from "@/hooks/use-login"
import { useAccount, useDisconnect } from "wagmi"
export const LoggedOut = () => {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { login, isLoggingIn } = useLogin()
  if (isConnected && address) {
    return (
      <div className="flex flex-col justify-center gap-6">
        <p>{address}</p>
        <Button onClick={() => disconnect()}>Disconnect Wallet</Button>
        <Button
          onClick={async () => await login()}
        >{`Log${isLoggingIn ? "ing in..." : "in"}`}</Button>
      </div>
    )
  } else {
    return <ConnectWalletDialog />
  }
}
