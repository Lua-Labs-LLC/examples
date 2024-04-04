import { Suspense } from "react"
import { AuthExample } from "./components/auth-example/auth-example"

export default function HomePage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Suspense fallback="loading user...">
        <AuthExample></AuthExample>
      </Suspense>
    </div>
  )
}
