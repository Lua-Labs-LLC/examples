import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../../ui/dialog";
import { WalletOptions } from "./wallet-options";

export function ConnectWalletDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Connect Wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Connect a Wallet</DialogHeader>
        <WalletOptions />
      </DialogContent>
    </Dialog>
  );
}
