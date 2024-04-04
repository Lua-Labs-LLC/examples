import { ServerActionWrapperReturn } from "@/utils/server-action-wrapper"
import { useTransition } from "react"

export default function useServerAction() {
  const [isPending, startTransition] = useTransition()

  async function serverAction<T>(
    action: () => Promise<ServerActionWrapperReturn<T>>
  ) {
    let promise: Promise<ServerActionWrapperReturn<T>> | undefined

    startTransition(() => {
      promise = action()
    })

    const awaited = await promise!

    if (!awaited.success) {
      const error = new Error()
      error.stack = awaited.res.stack
      error.name = awaited.res.name
      error.message = awaited.res.message
      error.cause = awaited.res.cause
      throw error
    }

    return awaited.res
  }

  return { serverAction, isPending }
}
