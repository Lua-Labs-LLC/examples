type PromiseType<T> = T extends Promise<infer U> ? U : T

export type ServerActionWrapperReturn<T> = PromiseType<
  ReturnType<typeof serverActionWrapper<T>>
>

export async function serverActionWrapper<T>(action: () => Promise<T>) {
  try {
    const res = await action()
    return { success: true, res } as const
  } catch (e: any) {
    return {
      success: false,
      res: serializeError(e),
    } as const
  }
}

function serializeError(error: Error) {
  if (!(error instanceof Error))
    return {
      name: "No Instance of Error",
      message: "Unexpected: cought response is not an instance of Error",
    }

  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: error.cause,
  }
}
