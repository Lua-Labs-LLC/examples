import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-col gap-6 items-center justify-center">
        <Link className="mr-auto" href="/games">
          <Button variant="outline">Back</Button>
        </Link>
        <h1 className="text-7xl">Tic Tac Toe</h1>
        {children}
      </div>
    </>
  );
}
