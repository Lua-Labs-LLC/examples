import { Suspense } from "react";
import { AuthExample } from "./components/auth-example/auth-example";
import Link from "next/link";
import { Button } from "@repo/shared/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-1 items-center justify-center flex-col">
      <Suspense fallback="loading user...">
        <h1 className="text-7xl mb-10">App A</h1>
        <AuthExample></AuthExample>
        <Link href="/b" className="mt-10">
          <Button variant="link">Go to App B</Button>
        </Link>
      </Suspense>
    </div>
  );
}
