import { Resource } from "sst"
import { realtime } from "sst/aws/realtime"
import { lucia } from "./auth/lucia"

export const handler = realtime.authorizer(async (token) => {
  const prefix = `${Resource.App.name}/${Resource.App.stage}`
  try {
    if (!token) {
      throw new Error("No token provided")
    }
    const result = await lucia.validateSession(token)

    if (!result.session) {
      throw new Error("Invalid or stale session")
    }
    return {
      subscribe: [`${prefix}/*`],
    }
  } catch {
    return {
      publish: [],
      subscribe: [],
    }
  }
})
